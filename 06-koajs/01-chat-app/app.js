const path = require('path');
const Koa = require('koa');
const app = new Koa();
const EventEmmiter = require('events')

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const delayPublish = new EventEmmiter()

const hundler = function (res) {
    return function (message) {
        res(message)
    }
}

async function delaySubscribe(ctx, next) {
    ctx.body = await new Promise(async (res,rej) => {
        delayPublish.on('publish', hundler(res))
        ctx.hundlerFun = hundler(res)
        await next()
    })
}

router.get('/subscribe', delaySubscribe, async (ctx, next) => {
    delayPublish.off('publish', ctx.hundlerFun)
    await next()
});

router.post('/publish', async (ctx, next) => {
    const message = ctx.request.body.message
    if (message) delayPublish.emit('publish', message)
    ctx.body = true
    await next()
});

app.use(router.routes());

module.exports = app;
