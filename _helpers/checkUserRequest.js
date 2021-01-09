const ArContent = require('../components/arcontents/arcontentsServices'),
    UserService = require('../components/users/usersServices');
const mongoose = require('mongoose');

exports.checkUserLogin = async (req, res, next) => {
    const userData = await UserService.findOne(req.body.username, () => { })
    if (!userData) {
        return res.status(400).send({ message: "Username yang anda masukan salah" })
    }
    const userDevice = userData.device.filter(x => x === req.body.device)
    if (userDevice.length !== 0) {
        return next();
    }
    return res.status(500).send({ success: false, message: "Your Account Can't Login In This Platform. You Can Try in Other Platform" });
}

exports.checkUserRequest = (user) => {
    if (user === 'admin') {
        return '';
    }
    return user;
}

exports.checkUserReqGetListAllandUpdateUser = (req, res, next) => {
    if (req.user.username === 'admin') {
        return next();
    }
    return res.status(401).end('Unauthorized');
}

exports.authVr = async (req, res, next) => {
    const { vrcontentId } = req.params
    const objectId = mongoose.Types.ObjectId.isValid(vrcontentId);
    if (!objectId) {
        return res.status(400).json({ message: 'Invalild id' })
    }

    const contentVr = await VrContent.findById(vrcontentId, () => { })
    if (!contentVr) {
        return res.status(404).send({ success: false, message: "VR Content not found" })
    }
    if (req.user.username === contentVr.username || req.user.username === 'admin') {
        req.contentVr = contentVr
        return next();
    }
    return res.status(401).end('Unauthorization');
};

// create auth middleware
exports.authAr = async (req, res, next) => {
    const { arcontentId } = req.params
    const objectId = mongoose.Types.ObjectId.isValid(arcontentId);
    if (!objectId) {
        return res.status(400).json({ message: 'Invalild id' })
    }

    const contentAr = await ArContent.findById(arcontentId, () => { })
    if (!contentAr) {
        return res.status(404).send({ success: false, message: "AR Content not found" })
    }
    if (req.user.username === contentAr.username || req.user.username === 'admin') {
        return next();
    }
    return res.status(401).end('Unauthorization');
};
