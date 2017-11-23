const crypto = require('crypto');
const mailer = require('../handlers/mailer');

// Create Hash in DB
async function saveVerificationHash(Db,uid) {
	const hash = crypto.randomBytes(20).toString('hex');
	await Db.ref(`verification-links/${uid}`)
		.set({ verifyEmailHash: hash });
	return hash;
}

// Send Verification E-mail
async function sendVerificationEmail(uid, email, hash) {
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

	return await new Promise((res, rej) => {
		mailer.sendMail(mailOptions, (err, info) => {
			if (err) return res(err);
			return res(info);
		});
	});
}

exports.init = Db => {
	return async function sendVerificationLink(ctx, next) {
		const body = ctx.request.body;
		if (!body.uid || !body.email) {
			return ctx.throw(400, { message: 'Wrong data provided!' });
		}
		const hash = await saveVerificationHash(Db, body.uid);
		const isMailSend = await sendVerificationEmail(body.uid, body.email, hash);
		if (isMailSend.messageId) {
			return ctx.body = { letterWasSent: true };
		}
		ctx.body = { letterWasSent: false, error: isMailSend };
	}
};
