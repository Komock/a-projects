const fs = require('fs');
const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const App = new Koa();
const Cors = require('koa2-cors');

//=== Env
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'dev';

//=== Domains
process.env.SPA_DOMAIN = isDev ? 'http://localhost:5000' : 'http://creativefarm.ru';

//=== CORS
App.use(Cors());

//=== Body Parser
App.use(BodyParser({
	onerror: function(err, ctx) {
		ctx.throw(422, 'Error: Wrong data format!');
	}
}));

//=== Logger
if (isDev) require('./middlewares/logger').init(App);

//=== Top level error handler
require('./middlewares/errors').init(App);

//=== Routes
require('./middlewares/routes').init(App);

// Start App
const port = process.env.PORT || 3090;
App.listen(port);