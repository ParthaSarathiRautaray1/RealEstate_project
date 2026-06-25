import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File is required" }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: "real-estate/properties" }, (error, uploadResult) => {
      if (error || !uploadResult) reject(error);
      else resolve({ secure_url: uploadResult.secure_url, public_id: uploadResult.public_id });
    }).end(buffer);
  });
  return NextResponse.json(result);
}
