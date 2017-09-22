const FS = require('fs');
const Tmp = require('tmp');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const BodyParser = require('koa-bodyparser');
const App = new Koa();
const Router = KoaRouter();
const Cors = require('koa2-cors');

// Firebase
const Firebase = require('firebase-admin');
const ServiceAccount = require('./firebase-key.json');

Firebase.initializeApp({
	credential: Firebase.credential.cert(ServiceAccount),
	databaseURL: 'https://projects-lab-cc451.firebaseio.com'
});

const Db = Firebase.database();
const FbAuth = Firebase.auth();


//=== CORS
App.use(Cors());

//=== Body Parser
App.use(BodyParser());


//=== Routes
async function FbAuthToken(ctx, next) {
	if (!ctx.request.body.token) {
		ctx.body = 'No token provided!';
		return;
	}

	let uid = '';
	try {
		await new Promise((res, rej) => {
			FbAuth.verifyIdToken(ctx.request.body.token)
				.then((decodedToken) => {
					console.log('decodedToken: ', decodedToken);
					if (decodedToken) {
						uid = decodedToken.uid;
						res();
					}
				})
				.catch((err) => {
					rej(err);
				});
		});
	} catch(error){
		console.warn('FbAuth.verifyIdToken error: ', error); // Wrong Token
	}
	
	if (uid) {
		await next(); // Token valid
		return;
	}
	ctx.body = { ApiAuth: false }; // Token invalid
}

Router.post('/api/add-participant', FbAuthToken, async(ctx, next) => {
	console.log('/api/add-participant', ctx);
	if (ctx.request.body.email) {
		let user = null;
		await new Promise((res, rej) => {
			Db.ref('users')
				.orderByChild('email')
				.equalTo(ctx.request.body.email)
				.once('value', (snapshot) => {
					user = snapshot.val();
					res();
				}).catch((err) => {
					console.error(err);
					rej();
				});
		});
		if (!user) {
			ctx.body = 'No user with this e-mail.';
			return;
		}
		await new Promise((res, rej) => {
			console.log('====> user: ', user);
			Db.ref(`users/${Object.keys(user)[0]}/collectiveProjects`)
				.update({ [ctx.request.body.uid]: ctx.request.body.projectId })
				.then(() => res() );
		});
		ctx.body = user;
	}
});

App.use(Router.routes())
	.use(Router.allowedMethods());

// Start App
App.listen(3090);
