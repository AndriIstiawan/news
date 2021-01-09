const { create, findAll } = require('./statusServices'),
    { statusValidation } = require('./statusValidation');
const StatusController = {};

StatusController.create = async (req, res) => {
    const { error, value } = statusValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    try {
        // Store all user data in 'users' except password and admin status
        const data = await create(value.status);
        return res.status(200).send(data)
    } catch (err) {
        return res.status(500).send(err);
    }
}

StatusController.findAll = async (req, res) => {
    try {
        // Store all user data in 'users' except password and admin status
        const data = await findAll(() => { });
        return res.status(200).send(data)
    } catch (err) {
        return res.status(500).send(err);
    }
}

module.exports = StatusController;
