const findOneByToken = require('./authServices').findOneByToken;
const findOneByemail = require('./authServices').findOneByemail;
const saveResetPasswordToken = require('./authServices').saveResetPasswordToken;
const generateTokenForgotPass = require('./authServices').generateTokenForgotPass;
const saveNewPassword = require('./authServices').saveNewPassword;
const sendMail = require('./authServices').sendMail;
const sendMailResetSuccess = require('./authServices').sendMailResetSuccess;
const User = require('../users/usersModel');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const AuthController = {};

//Validation
const { registerValidation } = require('./authValidation')

AuthController.register = async (req, res) => {
    const { error, value } = registerValidation(req.body);
    if (error) {
        const message = error.details[0].message;
        if (message.includes('/^\\S+$/')) {
            return res.status(400).json({ message: '\"username\" cannot contain any spaces' })
        }
        return res.status(400).json({ message: message });
    }

    const user = new User({
        username: value.username,
        email: value.email
    })

    try {
        User.register(user, value.password, (err, user) => {
            if (err) {
                return res.status(500).send(err.message)
            }
            passport.authenticate('local', {
                session: false
            })(req, res, () => {
                return res.status(201).send('Success');
            });
        });
    } catch (err) {
        return res.status(500).send(err);
    }
}

AuthController.login = async (req, res, next) => {
    try {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({ message: 'Username or Password its wrong' })
            }
            req.login(user, { session: false }, (_err) => {
                if (_err) {
                    return res.status(500).json({ message: 'server error, please try again' })
                }
                // generate a signed json web token with the contents of user object and return it in the response
                const token = jwt.sign({ id: user.id, email: user.email }, 'super-secret-token');
                return res.status(200).json({ user: user.email, name: user.username, token });
            });
        })(req, res);
    }
    catch (err) {
        return res.status(500).json({ message: 'server error, try again' });
    }
}

AuthController.forgot = async (req, res, next) => {
    const user = await findOneByemail(req.body.email, () => { });
    if (!user) {
        return res.status(400).send({ message: "Tidak ada akun dengan alamat email yang anda masukan." })
    }

    try {
        const token = await generateTokenForgotPass();
        const dataUser = await saveResetPasswordToken(user, token);
        const sendtoMail = await sendMail(dataUser.email, dataUser.resetPasswordToken)
        if (sendtoMail) {
            return res.status(200).json({
                message: `Email telah dikirm ke ${user.email} dengan instruksi lebih lanjut.`
            });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'server bermasalah segera hubungi smarteye.id' });
    }
}

AuthController.reset = async (req, res) => {
    const user = await findOneByToken(req.params.token, () => { });
    if (!user) {
        return res.status(400).send({ message: "Token reset password tidak valid atau telah kedaluwarsa." })
    }

    let updateUser;
    try {
        if (req.body.password === req.body.confirm) {
            updateUser = await saveNewPassword(user, req)
        } else {
            return res.status(400).json({ message: 'Password tidak cocok.' });
        }

        const sendtoMail = await sendMailResetSuccess(updateUser.email)
        if (sendtoMail) {
            return res.status(200).json({
                message: 'Success! Password anda berhasil diubah. Silakan Login disini: <a href="/">Login disini.</a>'
            });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'server bermasalah segera hubungi smarteye.id' });
    }
}

module.exports = AuthController;
