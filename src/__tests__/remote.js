
const Koa = require('koa');
const path = require('path');

const app = new Koa();;
const { createProxyMiddleware } = require('http-proxy-middleware');
const k2c = require('koa2-connect');

const port = 8012
 
app.listen(port, () => {
    app.use(async (ctx, next) => {
        const url = ctx.path;
        ctx.respond = false;
        await k2c(
         createProxyMiddleware({
         target: 'https://api.binance.com/',
         changeOrigin: true,
         secure: false,
         }),
        )(ctx, next);
        return await next();
       });
});
