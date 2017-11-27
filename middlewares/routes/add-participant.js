exports.init = (Db) => {
	return async(ctx, next) => {
		const body = ctx.request.body;
		console.log(body);
		if (!body.email) return ctx.throw(400, {message: 'No e-mail provided!'});

		let pSnapshot = await Db.ref('users')
				.orderByChild('email')
				.equalTo(ctx.request.body.email)
				.once('value');

		console.log('pSnapshot: ', pSnapshot.val());
		if (!pSnapshot.val()) {
			ctx.body = { msg: 'No user with this e-mail!' };
			return;
		}
		let pUid = Object.keys(pSnapshot.val())[0];
		let participant = pSnapshot.val()[pUid];

		console.log(pUid, participant);

		await Db.ref(`users/${pUid}/collectiveProjects/${body.projectKey}`)
			.set({ authorId: body.authorId });

		participant.read = true; // Allow Read

		let project = await Db.ref(`projects/${body.authorId}/${body.projectKey}/participants/${pUid}`)
			.set(participant);
		console.log('project: ', project);	
		
		ctx.body = participant;
	};
};

