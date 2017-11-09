//==== Auth FB Token
exports.init = FbAuth => {
	return async function authFirebaseToken(ctx, next) {
		const token = ctx.request.headers.authorization;
		let decodedToken;
		if (!token) {
			return ctx.throw(401);
		}
		
		decodedToken = await FbAuth.verifyIdToken(token);

		if (true) {
			await next(); // Token valid
		} else {
			console.warn('FbAuth.verifyIdToken error: ', err); // Wrong Token
			return ctx.throw(401);
		}
	}
}
