"use server";

import { cookies } from "next/headers";
import sabInstance from "@/components/sab/sauth";
import { APIResult, userInfoProps } from "sauthbase/types";

const tokenName = "sauthbase-token";

export const serverLogout = async () => {
  const cookieStore = await cookies();
  const is = cookieStore.has(tokenName);
  if (!is) return;
  cookieStore.delete(tokenName);
};

export const serverGetUser = async (): Promise<APIResult<string>> => {
  const sab = await sabInstance();
  const cookieStore = await cookies();
  const is = cookieStore.has(tokenName);
  const token = is ? cookieStore.get(tokenName)?.value : "";
  const res = await sab.extractUserWithVerify(token);
  if (is && !res.success) {
    cookieStore.delete(tokenName);
  }
  return res;
};

export const serverGetUserInfo = async (
  username: null | string
): Promise<APIResult<userInfoProps>> => {
  const sab = await sabInstance();
  if (!username)
    return {
      code: "",
      success: false,
      status: 400,
      message: "ユーザー名が指定されていません。",
    };
  const res = await sab.getUser(username);
  return res;
};
