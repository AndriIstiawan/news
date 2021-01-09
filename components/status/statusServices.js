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

exports.findById = (statusId, callback) => {
    return Status.findById(statusId, (err, result) => {
        if (err) {
            return callback(err);
        }
        return callback(null, result);
    }).lean();
}
