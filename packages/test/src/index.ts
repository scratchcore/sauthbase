import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { sauthbase } from 'sauthbase';

const app = new Hono()
const sab = sauthbase.init({
  secretKey: "576efb791a32d940c23ecabb1a3292e74e1ab62c4838ed7659c24fd9c9645b06",
  redirect_url: "http://localhost:3000/auth",
});

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
