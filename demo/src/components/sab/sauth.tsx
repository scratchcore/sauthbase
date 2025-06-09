"use server";

import { sauthbase } from "sauthbase";

sauthbase.init({
  secretKey: process.env.SAUTHBASE_SECRET_KEY!,
  redirect_url: `${process.env.SITE_URL}/api/auth`,
});

export default sauthbase;
