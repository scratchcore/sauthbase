"use server";

import sauthbase from "@/libs/sauthbase";
import { sauthbaseGetToken } from "./get-token";

const sab = sauthbase.use();

export const sauthbaseGetUser = async (): Promise<string | undefined> => {
  const token = await sauthbaseGetToken();
  const user = await sab.extractUserWithVerify(token);
  return (user.success && user.data) || undefined;
};

export const getUser = async (username: string) => {
  const userInfo = await sab.getUser(username);
  return userInfo;
};
