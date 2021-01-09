const User = require('../users/usersModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const CONFIG = require('../../config/config');

const { sendMail } = require('../../_helpers/nodemailer_conn_builder');

exports.findOne = (username, callback) => {
    return User.findOne({ username: username }, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result)
    });
}

exports.findOneByemail = (email, callback) => {
    return User.findOne({ email: email }, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result)
    });
}

exports.findOneByToken = (token, callback) => {
    return User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    }, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result)
    });
}

exports.saveResetPasswordToken = async (user, token) => {
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    return user.save();
}

exports.generateTokenForgotPass = async () => {
    const buf = await crypto.randomBytes(20);
    return buf.toString('hex');
}

exports.generateToken = async (user) => {
    const data = {
        _id: user._id,
        name: user.name,
        email: user.email
    };
    const signature = 'super-secret-token';

    return jwt.sign({ data, }, signature);
}

exports.sendMail = async (email, resetPasswordToken) => {
    const mailOptions = {
        to: email,
        from: 'smarteye.id@gmail.com',
        subject: 'Konfirmasi Reset Password',
        text: `Kami telah menerima permintaan kamu untuk reset password akun Platform Smarteye.id.
            Silakan konfirmasi lewat link di bawah ini:\n\n ${CONFIG.ip_address_frontend}/reset/${resetPasswordToken} 
            \n\nAbaikan email ini jika kamu tidak pernah meminta untuk reset password.\n`
    };
    return sendMail(mailOptions);
}

exports.saveNewPassword = async (user, req) => {
    try {
        user.setPassword(req.body.password, (_err, u) => {
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            u.save((_error) => {
                req.logIn(user, (err) => {
                    if (err) {
                        return err
                    }
                });
            });
        });
        return user.save();
    } catch (e) {
        // Log Errors
        return Promise.reject(new Error('errors save'))
    }
}

exports.sendMailResetSuccess = async (email) => {
    const mailOptions = {
        to: email,
        from: 'smarteye.id@gmail.com',
        subject: 'Kata sandi Anda telah diubah',
        text: `Hallo, \n\n Ini adalah konfirmasi bahwa kata sandi untuk akun anda ${email}
            baru saja diubah.\n\n Silakan Login lewat link di bawah ini:\n ${CONFIG.ip_address_frontend}/`
    };
    return sendMail(mailOptions);
}
