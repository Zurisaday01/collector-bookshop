import nodemailer from 'nodemailer';

const sendEmail = async options => {
	// 1) Create a transporter
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	// Define the email options
	const mailOptions = {
		from: 'Zurisaday Espadas',
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	// send the email: returns a promise
	await transporter.sendMail(mailOptions);
};

export default sendEmail;
