import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const missing = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"].filter((key) => !process.env[key]);
  if (missing.length) {
    return NextResponse.json({ error: `Cloudinary upload is not configured. Missing: ${missing.join(", ")}.` }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File is required" }, { status: 400 });

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
  const MAX_BYTES = 8 * 1024 * 1024;
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WEBP, AVIF, or GIF images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 8 MB or smaller." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "real-estate/properties" }, (error, uploadResult) => {
        if (error || !uploadResult) reject(error || new Error("Cloudinary did not return an upload result."));
        else resolve({ secure_url: uploadResult.secure_url, public_id: uploadResult.public_id });
      }).end(buffer);
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cloudinary upload failed.";
    return NextResponse.json({ error: `Cloudinary upload failed: ${message}` }, { status: 500 });
  }
}
