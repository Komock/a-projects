//==== Mailer
const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
const mailer = nodemailer.createTransport({
	host: 'smtp.timeweb.ru',
	port: 465,
	secure: true, // true for 465, false for other ports
	auth: {
		user: 'mailer@creativefarm.ru', // generated ethereal user
		pass: '6hvfhZ7W' // generated ethereal password
	}
});

module.exports = mailer;