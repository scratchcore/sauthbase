import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { sauthbase } from "sauthbase";

const app = new Hono();
const sab = sauthbase.init({
  secretKey: "576efb791a32d940c23ecabb1a3292e74e1ab62c4838ed7659c24fd9c9645b06",
  redirect_url: "http://localhost:3000/auth",
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/login", (c) => {
  const response = sab.generationAuthPageUrl();
  if (response.success) {
    return c.redirect(response.data);
  } else {
    return c.json(response);
  }
});

app.get("/auth", async (c) => {
  const session = c.req.query("privateCode");
  const response = await sab.verifySession(session);
  if (response.success) {
    return c.json(response);
  } else {
    return c.json(response);
  }
});

app.get("/verify", async (c) => {
  const token = c.req.query("token");
  const response = await sab.extractUserWithVerify(token);
  if (response.success) {
    return c.json(response);
  } else {
    return c.json(response);
  }
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
