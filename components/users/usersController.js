const { find } = require('./usersServices');
const UserController = {};

UserController.listAll = async (req, res) => {
    try {
        // Store all user data in 'users' except password and admin status
        const data = await find(() => { });
        return res.status(200).send(data)
    } catch (err) {
        return res.status(500).send(err);
    }
}

module.exports = UserController;
