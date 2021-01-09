const nodemailer = require('nodemailer');
const stubTransport = require('nodemailer-stub-transport');

const CONFIG = require('../config/config');

const transport = nodemailer.createTransport(stubTransport());

let smtpTransport;
if (process.env.NODE_ENV === 'test') {
    smtpTransport = transport;
} else {
    smtpTransport = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: CONFIG.port_smtp,
        secure: true, // true for 465, false for other ports
        auth: {
            user: CONFIG.user_smtp,
            pass: CONFIG.pass_smtp
        }
    });
}

exports.sendMail = (mailOptions) => {
    return smtpTransport.sendMail(mailOptions)
}
