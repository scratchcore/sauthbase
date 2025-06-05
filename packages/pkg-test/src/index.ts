import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { sauthbase } from "sauthbase";

const app = new Hono();
const sab = sauthbase.init({
  secretKey: sauthbase.generateSecureKey(),
  redirect_url: "https://localhost:3000/auth",
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
