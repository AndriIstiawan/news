const { find, findById, updateUser } = require('./usersServices');
const UserController = {};
const mongoose = require('mongoose');

UserController.listAll = async (req, res) => {
    try {
        // Store all user data in 'users' except password and admin status
        const data = await find(() => { });
        return res.status(200).send(data)
    } catch (err) {
        return res.status(500).send(err);
    }
}

UserController.updateUser = async (req, res) => {
    const { userId } = req.params
    const objectId = mongoose.Types.ObjectId.isValid(userId);
    if (!objectId) {
        return res.status(400).json({ message: 'Invalild id' });
    }

    const user = await findById(userId, (err, result) => { })
    if (!user) {
        return res.status(404).send({ success: false, message: `User not found ID ${userId}` })
    }

    try {
        if (req.body.password !== req.body.confirm) {
            return res.status(400).json({ message: 'Password tidak cocok.' })
        }

        const userupdate = await updateUser(user, req);
        return res.status(201).send({ success: true, message: "Success updating user", user: userupdate })
    } catch (err) {
        return res.status(500).send(err);
    }
}

module.exports = UserController;
