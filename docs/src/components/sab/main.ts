"use server";

import { cookies } from "next/headers";
import sauthbase from "@/components/sab/sauth";
import { APIResult } from "sauthbase/types";

const sab = sauthbase.use();

const tokenName = "sauthbase-token";

export const serverLogout = async () => {
  const cookieStore = await cookies();
  const is = cookieStore.has(tokenName);
  if (!is) return;
  cookieStore.delete(tokenName);
};

export const serverGetUser = async (): Promise<APIResult<string>> => {
  const cookieStore = await cookies();
  const is = cookieStore.has(tokenName);
  const token = is ? cookieStore.get(tokenName).value : "";
  const res = await sab.extractUserWithVerify(token);
  if (is && !res.success) {
    cookieStore.delete(tokenName);
  }
  return res;
};

export const serverGetUserInfo = async (username: null | string) => {
  if (!username) return null;
  const res = await sab.getUser(username);
  return res;
};
