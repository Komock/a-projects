const KoaRouter = require('koa-router');
const Router = new KoaRouter({ prefix: '/api' });

//==== Env
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'dev';

//==== Firebase
const Firebase = require('firebase-admin');
let FbCredential;
if (isDev) {
	FbCredential = require('../firebase-key.json');
} else {
	// Production Env
	FbCredential = {
		type: process.env.FIREBASE_TYPE,
		project_id: process.env.FIREBASE_PROJECT_ID,
		private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
		private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
		client_email: process.env.FIREBASE_CLIENT_EMAIL,
		client_id: process.env.FIREBASE_CLIENT_ID,
		auth_uri: process.env.FIREBASE_AUTH_URI,
		token_uri: process.env.FIREBASE_TOKEN_URI,
		auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
		client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
	}
}
Firebase.initializeApp({
	credential: Firebase.credential.cert(FbCredential),
	databaseURL: 'https://projects-lab-cc451.firebaseio.com'
});
const FbAuth = Firebase.auth();
const Db = Firebase.database();
const authFirebaseToken = require('./auth-firebase-token').init(FbAuth);

exports.init = App => {

	//==== Add Participant
	Router.post('/add-participant', authFirebaseToken,
		require('./routes/add-participant.js').init(Db));

	//==== Send Verification link
	Router.post('/sent-verification-link',
		require('./routes/sent-verification-link.js').init(Db));

	//==== Verify E-mail by Link
	Router.post('/verify-email',
		require('./routes/verify-email.js').init(Db, FbAuth));

	//==== Update User Data
	async function updateUser(uid, update) {
		console.log(uid, update)
		let user = await FbAuth.updateUser(uid, update);
		return user;
	}
	Router.post('/update-user', async(ctx, next) => {
		const body = ctx.request.body;
		console.log(body);
		if (body === {} || !body.uid) ctx.body = 'Error: No data provided!';
		await updateUser(body.uid, body.update)
			.then((userData) => {
				ctx.body = userData;
			})
			.catch((err) => {
				console.warn(err);
				ctx.body = err;
			});
	});

	async function createCustomToken(uid, update) {
		return await FbAuth.createCustomToken(uid, update);
	}

	Router.post('/create-custom-token', async(ctx, next) => {
		const body = ctx.request.body;
		console.log(body);
		if (!body.uid || !body.update) ctx.body = 'Error: No data provided!';
		await createCustomToken(body.uid, body.update)
			.then((customToken) => {
				ctx.body = customToken;
			})
			.catch((err) => {
				console.log('Error creating custom token: ', err);
				ctx.body = err;
			});
	});

	//==== Get User Data
	async function getUser(uid) {
		return await FbAuth.getUser(uid);
	}
	Router.post('/get-user', async(ctx, next) => {
		const body = ctx.request.body;
		console.log(body);
		if (!body.uid) ctx.body = 'Error: No data provided!';
		await getUser(body.uid)
			.then((userRecord) => {
				console.log('Successfully fetched user data: ', userRecord.toJSON());
				ctx.body = userRecord.toJSON();
			})
			.catch((err) => {
				console.warn(err);
				ctx.body = err;
			});
	});

	//==== Test Add 
	Router.post('/add', async(ctx, next) => {
		const body = ctx.request.body;
		if (!body.email) return ctx.throw(400, { message: 'No e-mail provided!' });

		let pSnapshot = await Db.ref('users')
			.orderByChild('email')
			.equalTo(ctx.request.body.email)
			.once('value');

		console.log('pSnapshot: ', pSnapshot);
		if (!pSnapshot.val()) {
			ctx.body = { msg: 'No user with this e-mail!' };
			return;
		}
		ctx.body = pSnapshot.val();
		// let pUid = Object.keys(pSnapshot.val())[0];
		// let participant = pSnapshot.val()[pUid];

		// let collectiveProject = await Db.ref(`users/${pUid}/collectiveProjects/${body.projectKey}`)
		// 	.set({ authorId: body.authorId });
		// console.log('collectiveProject: ', collectiveProject);

		// let project = await Db.ref(`projects/${body.authorId}/${body.projectKey}/participants`)
		// 	.set(participant);
		// console.log('project: ', project);
	});

	//==== Test
	Router.post('/test', async(ctx, next) => { // authFirebaseToken
		console.log(ctx.request);

		// await ref
		// 	.child()
		// 	.once('value', function(snapshot) {
		// 	var exists = (snapshot.val() !== null);
		// 	console.log('exists: ', exists);
		// 	ctx.body = exists;
		// });

		ctx.body = { msg: 'test' };
	});

	//==== Add MDW
	App.use(Router.routes())
		.use(Router.allowedMethods());
}
