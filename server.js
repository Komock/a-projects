const fs = require('fs');
const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const App = new Koa();
const Cors = require('koa2-cors');


//=== CORS
App.use(Cors());

//=== Body Parser
App.use(BodyParser({
	onerror: function(err, ctx) {
		ctx.throw(422, 'Error: Wrong data format!');
	}
}));

//=== Logger
require('./middlewares/logger').init(App);

//=== Top level error handler
require('./middlewares/errors').init(App);

//=== Routes
require('./middlewares/routes').init(App);



// Start App
App.listen(3090);
