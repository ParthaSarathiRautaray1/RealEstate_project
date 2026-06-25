import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createClient } from "@/lib/supabase/server";

type ExportLead = {
  name: string;
  email: string;
  phone: string;
  budget: number | null;
  message: string | null;
  created_at: string;
  properties?: { title: string; slug: string } | { title: string; slug: string }[] | null;
};

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: admin } = await supabase.from("admins").select("id").eq("id", user.id).single();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase.from("leads").select("id,name,email,phone,budget,message,created_at,properties(title,slug)").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const rows = ((data || []) as ExportLead[]).map((lead) => ({
    Name: lead.name,
    Email: lead.email,
    Phone: lead.phone,
    Budget: lead.budget,
    Property: propertyTitle(lead.properties),
    Message: lead.message,
    Created: lead.created_at
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "Leads");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=leads.xlsx"
    }
  });
}

function propertyTitle(property: ExportLead["properties"]) {
  if (!property) return "General inquiry";
  return Array.isArray(property) ? property[0]?.title || "General inquiry" : property.title;
}
