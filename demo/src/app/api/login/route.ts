import { NextRequest, NextResponse } from "next/server";
import sabInstance from "@/components/sab/sauth";

export async function GET(req: NextRequest) {
  const sab = await sabInstance(req);
  const res = sab.generationAuthPageUrl();

  if (res.success) {
    return NextResponse.redirect(res.data);
  }

  return NextResponse.redirect("/");
}
