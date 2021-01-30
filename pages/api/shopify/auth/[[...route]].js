import shopifyAuth from "@shopify/koa-shopify-auth";
import KoaCompat from "koa-nextjs-compat";
import session from "koa-session";
const { SHOPIFY_API_KEY, SHOPIFY_SECRET } = process.env;

let app = new KoaCompat();

app.keys = [SHOPIFY_SECRET];

const handler = app
  .use(session({ secure: true, sameSite: "none" }, app))
  .use(
    shopifyAuth({
      prefix: "/api/shopify",
      // your shopify app api key
      apiKey: SHOPIFY_API_KEY,
      // your shopify app secret
      secret: SHOPIFY_SECRET,
      // scopes to request on the merchants store
      scopes: ["write_orders, write_products"],
      // set access mode, default is 'online'
      accessMode: "offline",
      // callback for when auth is completed
      afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;

        console.log("We did it!", accessToken);

        ctx.redirect("/");
      },
    })
  )
  .handle();

export default handler;
