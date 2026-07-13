const nodemailer = require('nodemailer');
require('dotenv').config()

const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            // port: 587,
            // secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"StudyNotion" <${process.env.MAIL_USER}>`, // sender address
            to: email, // list of receivers
            subject: title, // Subject line
            html: body, // plain text body
            // to, 
            // subject,
            // text, 
        };

        let info = await transporter.sendMail(mailOptions);
        console.log(info);
        console.log('Email sent successfully');
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = mailSender;