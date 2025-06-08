"use server";

import { redirect } from "next/navigation";
import sauthbase from "@/components/sab/sauth";

const sab = sauthbase.use();

export default async function page() {
  const res = sab.generationAuthPageUrl();
  if (res.success) {
    redirect(res.data);
  }
  redirect("/");
}
