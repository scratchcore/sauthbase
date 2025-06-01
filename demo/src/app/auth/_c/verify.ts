"use server";

import sauthbase from "@/libs/sauthbase";

const sab = sauthbase.use();

export const verifySession = async (session?: string) => {
  const res = await sab.verifySession(session);
  return res;
};
