exports.init = App => {
	App.use(async(ctx, next) => {
		try {
			await next();
		} catch (err) {
			console.log('Error name: ', err.name);
			if (err.status) {
				ctx.body = err.message;
				ctx.status = err.status;
				return;
			}
			ctx.body = 'Error 500';
			ctx.status = 500;
			console.error(err.message, err.stack);
		}
	});
}