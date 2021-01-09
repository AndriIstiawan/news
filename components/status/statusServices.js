const Status = require('./statusModel');

exports.create = (status) => {
    return new Status({
        status: status
    }).save();
}

exports.findAll = (callback) => {
    return Status.find((err, result) => {
        if (err) {
            return callback(err);
        }
        return callback(null, result);
    }).lean()
}

exports.findOne = (username, callback) => {
    return User.findOne({ username: username }, (err, result) => {
        if (err) {
            return callback(err);
        }
        return callback(null, result);
    })
}

exports.findById = (userId, callback) => {
    return User.findById(userId, (err, result) => {
        if (err) {
            return callback(err);
        }
        return callback(null, result);
    }).select('-password -isAdmin');
}

exports.updateUser = async (user, req) => {
    try {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.device = req.body.device || user.device;
        if (req.body.password !== '' && req.body.password !== undefined && req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, (_err, u) => {
                u.save((_error) => {
                    req.logIn(user, (err) => {
                        if (err) {
                            return err
                        }
                    });
                });
            });
        }
        return user.save();
    } catch (e) {
        // Log Errors
        return Promise.reject(new Error('errors save'))
    }
}
