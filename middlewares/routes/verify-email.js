exports.init = (Db, FbAuth) => {
	return async(ctx, next) => {
		const body = ctx.request.body;
		if (!body.uid || !body.hash) {
			const err = 'Error: wrong data provided!'
			ctx.body = {error: err};
			return console.error(err);
		}
		let verifyEmail; // Boolean
		await Db.ref(`verification-links/${body.uid}/verifyEmailHash`)
			.once('value', function(snapshot) {
				verifyEmail = (snapshot.val() === body.hash);
			});
		if (!verifyEmail){
			ctx.body = {error: 'Wrong verification link'};
			ctx.status = 400;
		}
		await Db.ref(`verification-links/${body.uid}/verifyEmailHash`).remove();
		const user = await FbAuth.updateUser(body.uid, { emailVerified: true });
		await Db.ref(`verification-links/${body.uid}`).remove();
		ctx.body = user;
	}
};