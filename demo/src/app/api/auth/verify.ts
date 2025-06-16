"use server";

import { cookies } from "next/headers";
import sabInstance from "@/components/sab/sauth";
import { APIResult } from "sauthbase/types";

export const verifySession = async (
  session?: string
): Promise<APIResult<null>> => {
  const sab = await sabInstance();
  const cookieStore = await cookies();
  const res = await sab.verifySession(session);
  if (res.success === true) {
    cookieStore.set("sauthbase-token", res.data.token);
    return {
      code: res.code,
      success: true,
      data: null,
    };
  } else {
    return {
      code: res.code,
      success: false,
      status: res.status,
      message: res.message,
    };
  }
};
