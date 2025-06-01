import { redirect } from "next/navigation";
import sauthbase from "@/libs/sauthbase";

export default function page() {
  const sab = sauthbase.use();
  const res = sab.generationAuthPageUrl();
  if (res.success) {
    redirect(res.data);
  }
  redirect("/");
}
