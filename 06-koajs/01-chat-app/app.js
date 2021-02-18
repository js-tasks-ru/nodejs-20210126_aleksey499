const path = require('path');
const Koa = require('koa');
const app = new Koa();
const EventEmmiter = require('events');

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const delayPublish = new EventEmmiter();

router.get('/subscribe', async (ctx, next) => {
});

router.post('/publish', async (ctx, next) => {
});

app.use(router.routes());

module.exports = app;
