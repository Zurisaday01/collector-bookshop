import nodemailer from 'nodemailer';

export class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.url = url;
		this.from = `Zurisaday Espadas <${process.env.EMAIL_FROM}>`;
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			return 1;
		}

		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	// send the actual email
	async send(subject) {
		// Render HTML template
		const html = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
		
		<head>
		
		  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <meta name="x-apple-disable-message-reformatting">
		  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
		
			<title>Collector bookshop | Forgot password</title>
		
			<style type="text/css">
			  a,a[href],a:hover, a:link, a:visited {
				/* This is the link colour */
				text-decoration: none!important;
				color: #0000EE;
			  }
			  .link {
				text-decoration: underline!important;
			  }
		  
			  h1 {
				/* Fallback heading style */
				font-size:22px;
				line-height:24px;
				font-family:'Helvetica', Arial, sans-serif;
				font-weight:normal;
				text-decoration:none;
				color: #000000;
			  }
			  .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
			  .ExternalClass {width: 100%;}
			</style>
		   
		</head>
		
			<body style="text-align: center; margin: 0; padding-top: 10px;  padding-bottom: 10px; padding-left: 0; padding-right: 0; -webkit-text-size-adjust: 100%;background-image: linear-gradient(90deg, rgba(25,112,217,1) 0%, rgba(0,212,255,1) 100%); color: #000000 display:flex; justify-content: center; align-items:center;" align="center">
			
			<div style="display:flex; justify-content: center; flex-direction: column; align-items:center; height: 100%;">
				<p style="font-size: 15px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #fff;">Hello ${this.firstName} 👋</p> 
			
				<!-- Start single column section -->
				<table style="text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #ffffff;" width="600">
					<tbody>
					<tr>
						<td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 40px;" width="596">
			
						<h1 style="font-size: 20px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 600; text-decoration: none; color: #000000;">Reset your password</h1>
			
						<p style="font-size: 15px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #919293;">To reset your password only click on the button below.</p>              
			
				
						<a href="${this.url}" target="_blank" style="background-color: #2481f9; font-size: 15px; line-height: 22px; font-family: 'Helvetica', Arial, sans-serif; font-weight: normal; text-decoration: none; padding: 12px 15px; color: #ffffff; display: inline-block; mso-padding-alt: 0;">
				
							<span style="mso-text-raise: 15pt; color: #ffffff;">Reset password</span>
							
						</a>
						</td>
					</tr>
					</tbody>
				</table>
			
			</div>
			
			</body>
		
		</html>`;
		// Define email options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
		};

		await this.newTransport().sendMail(mailOptions);
	}

	async sendPasswordReset() {
		await this.send('Restore your password! (valid for only 10 minutes)');
	}
}
