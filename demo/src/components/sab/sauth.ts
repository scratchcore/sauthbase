"use server";

import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { sauthbase } from "sauthbase";

const node_env = process.env.NODE_ENV === "production";
export default async function sabInstance(req?: NextRequest) {
  const header = await headers();
  const host = header.get("host");
  const proto = node_env ? "https" : "http";
  const origin = req ? new URL(req.url).origin : `${proto}://${host}`;

  if (!sauthbase.isReady()) {
    if (origin) {
      return sauthbase.init({
        secretKey: node_env
          ? process.env.SAUTHBASE_SECRET_KEY!
          : "7c2c0ad33e15880c563ceb8a26a1734bc7d71c3e99770e79e8251d3fedebeb2f",
        redirect_url: `${origin}/api/auth`,
      });
    } else {
      throw new Error("\n\nERROR: x-origin ヘッダーがありません。\n\n");
    }
  } else {
    return sauthbase.use();
  }
}
