"use server"

import { cookies } from "next/headers";

export const sauthbaseGetToken = async (): Promise<
  string | undefined
> => {
  const cookie = await cookies();
  const token = cookie.get("_sauth-token");
  return token?.value;
};
