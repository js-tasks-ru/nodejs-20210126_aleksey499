const path = require('path');
const Koa = require('koa');
const app = new Koa();
const EventEmmiter = require('events')

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const delayPublish = new EventEmmiter()

router.get('/subscribe', async (ctx, next) => {
    ctx.body = await new Promise(async res => {
        delayPublish.once('publish', message => res(message))
        await next()
    })
});

router.post('/publish', async (ctx, next) => {
    const message = ctx.request.body.message
    if (message) delayPublish.emit('publish', message)
    ctx.body = true
    await next()
});

app.use(router.routes());

module.exports = app;
