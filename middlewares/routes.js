const crypto = require('crypto');
const KoaRouter = require('koa-router');
const Router = new KoaRouter({ prefix: '/api'});
const mailer = require('./handlers/mailer');

//==== Firebase
const Firebase = require('firebase-admin');
const FbCredential = require('../firebase-key.json');
Firebase.initializeApp({
	credential: Firebase.credential.cert(FbCredential),
	databaseURL: 'https://projects-lab-cc451.firebaseio.com'
});
const FbAuth = Firebase.auth();
const Db = Firebase.database();
const authFirebaseToken = require('./auth-firebase-token').init(FbAuth);

exports.init = App => {

	//==== Add Participant
	Router.post('/add-participant', authFirebaseToken, async(ctx, next) => {
		const body = ctx.request.body;
		if (!body.email) return ctx.throw(400, 'No e-mail provided!');
		try {
			let user = await Db.ref('users')
				.orderByChild('email')
				.equalTo(ctx.request.body.email)
				.once('value');
		} catch(err) {
			console.error('No user with this e-mail!');
			ctx.throw(404, err);
		}
		console.log('user: ', user.val());
		

		let project = await Db.ref(`users/${Object.keys(user.val())[0]}/collectiveProjects`)
			.push({
				key: body.projectId,
				ownerUid: body.uid
			});
		console.log('project: ', project.val());
		
		ctx.body = user;
	});


	//==== Send Verification E-mail
	async function saveVerificationHash(uid) {
		const hash = crypto.randomBytes(20).toString('hex');
		await Db.ref(`verification-links/${uid}`)
			.set({verifyEmailHash: hash});
		return { hash };	
	}

	async function sendVerificationEmail({uid, email}){
		const hash = await Db.ref(`verification-links/${uid}/verifyEmailHash`)
			.once('value', (snapshot) => snapshot.val() );
			console.log(hash);
		if (!hash) {
			ctx.body = 'Error: wrong link';
			ctx.status = 400;
			return;
		}

		// setup email data with unicode symbols
		let mailOptions = {
			from: '"A-Projects 👻" <mailer@creativefarm.ru>', // sender address
			to: email, // list of receivers
			subject: 'A-Projects. E-mail Verification', // Subject line
			text: `Link: http://localhost:3090/api/verify-email?hash=${hash}&uid=${uid}`, // plain text body
			html: `Link: 
				<a href="http://localhost:3090/api/verify-email?hash=${hash}&uid=${uid}" target="_blank">
				http://localhost:3090/api/verify-email?hash=${hash}&uid=${uid}
				</a>` // html body
		};

		await new Promise((res, rej) => {
			mailer.sendMail(mailOptions, (error, info) => {
				if (error) {
					rej();
					return console.log(error);
				}
				console.log('Message was sent: ', info);
				res();
			});
		});
	}


	Router.post('/add-verification-link', async(ctx, next) => {
		console.log('add-verification-link: ', ctx.request.body);
		const body = ctx.request.body;
		if (body.uid) {
			const hash = await saveVerificationHash(body.uid);
			ctx.body = { hashAdded: true };
		} else {
			ctx.body = { error: 'Error: link not added' };
			ctx.status = 400;
		}
	});

	Router.post('/sent-verification-link', async(ctx, next) => {
		console.log('sent-verification-link: ', ctx.request.body);
		const body = ctx.request.body;
		if (body.uid && body.email) {
			await sendVerificationEmail(body);
			ctx.body = { letterWasSent: true };
		} else {
			ctx.body = { error: 'Error: link not added' };
			ctx.status = 400;
		}
	});

	//==== Verify E-mail by Link
	Router.get('/verify-email', async(ctx, next) => {
		const query = ctx.request.query;
		if (!query.uid || !query.hash) {
			const err = 'Error: wrong data provided!'
			ctx.body = err;
			return console.error(err);
		}
		let verifyEmail; // Boolean
		const hashRef = Db.ref(`verification-links/${query.uid}/verifyEmailHash`);
		await hashRef.once('value', function(snapshot) {
			verifyEmail = (snapshot.val() === query.hash);
		});
		if (!verifyEmail){
			ctx.body = 'Wrong verification link';
			ctx.status = 400;
		}
		let user = await FbAuth.updateUser(query.uid, { emailVerified: true });
		hashRef.set('');
		ctx.body = user;
	});


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

	async function createCustomToken(uid, update){
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


	//==== Test
	Router.get('/test', async(ctx, next) => { // authFirebaseToken
		console.log(ctx.request);
		
		// await ref
		// 	.child()
		// 	.once('value', function(snapshot) {
		// 	var exists = (snapshot.val() !== null);
		// 	console.log('exists: ', exists);
		// 	ctx.body = exists;
		// });

		ctx.body = 'Test!';
	});


	//==== Add MDW
	App.use(Router.routes())
		.use(Router.allowedMethods());
}