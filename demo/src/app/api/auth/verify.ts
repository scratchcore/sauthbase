"use server";

import { cookies } from "next/headers";
import sauthbase from "@/components/sab/sauth";
import { APIResult } from "sauthbase/types";

const sab = sauthbase.use();

export const verifySession = async (
  session?: string
): Promise<APIResult<null>> => {
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
