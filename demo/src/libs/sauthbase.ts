// src/lib/sauthbase.ts
import { sauthbase } from "sauthbase";

sauthbase.init({
  secretKey: "b48233b530a77252627b22a4ba084a96be92e4fba656a58c3e8db3b1e520fe0d",
  redirect_url: "http://localhost:3000/auth",
});

export default sauthbase