const VrContent = require("./newsModel"),
    CONFIG = require('../../config/config'),
    { checkUserRequest } = require('../middlewares/checkUserRequest');
const { sendMail } = require('../../_helpers/nodemailer_conn_builder');

exports.findAllPublicContent = (search, callback) => {
    return VrContent.find({
        access_level: { '$regex': 'public', '$options': 'i' },
        "$or": [
            { username: { '$regex': search, '$options': 'i' } },
            { category: { '$regex': search, '$options': 'i' } },
            { title: { '$regex': search, '$options': 'i' } }
        ]
    }, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result)
    }).sort({ priority: 1 });
}

exports.findPublicContent = (search, query, callback) => {
    return VrContent.find({
        access_level: { '$regex': 'public', '$options': 'i' },
        "$or": [
            { username: { '$regex': search, '$options': 'i' } },
            { category: { '$regex': search, '$options': 'i' } },
            { title: { '$regex': search, '$options': 'i' } }
        ]
    }, {}, query, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result)
    }).sort({ priority: 1 });
}

exports.SearchAllContent = async (search, callback) => {
    return VrContent.find({
        access_level: { '$regex': 'public', '$options': 'i' },
        "$or": [
            { username: { '$regex': search, '$options': 'i' } },
            { category: { '$regex': search, '$options': 'i' } },
            { title: { '$regex': search, '$options': 'i' } }
        ]
    }, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result)
    });
}

exports.SearchAllUserContent = async (user, search, callback) => {
    return VrContent.find({
        username: { '$regex': user },
        "$or": [
            { access_level: { '$regex': 'private', '$options': 'i' } },
            { category: { '$regex': search, '$options': 'i' } },
            { title: { '$regex': search, '$options': 'i' } }
        ]
    }, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result)
    });
}

exports.findContent = async (callback) => {
    return VrContent.find({
        access_level: { '$regex': 'public', '$options': 'i' }
    }, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result)
    });
}

exports.findAllContent = async (user, callback) => {
    return VrContent.find({
        username: { '$regex': user },
        "$or": [
            { access_level: { '$regex': 'private', '$options': 'i' } }
        ]
    }, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result)
    });
}

exports.findFilterContent = async (category, callback) => {
    return VrContent.find({
        access_level: { '$regex': 'public', '$options': 'i' },
        category: { '$regex': category, '$options': 'i' }
    }, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result)
    });
}

exports.findFilterAllContent = async (user, category, callback) => {
    return VrContent.find({
        username: { '$regex': user },
        category: { '$regex': category },
        "$or": [
            { access_level: { '$regex': 'private', '$options': 'i' } },

        ]
    }, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result)
    });
}

exports.findCategoryPublic = async (callback) => {
    return VrContent.aggregate(
        [
            {
                $match: { "access_level": { '$regex': 'public', '$options': 'i' } }
            },
            {
                $group: { _id: "$category" }
            },
            {
                $sort: { _id: 1 }
            }
        ],
        function (err, results) {
            if (err) {
                return callback(err);
            }
            return callback(results);
        })
}

exports.findCategoryPrivate = async (user, callback) => {
    //data: { $push: "$$ROOT" }
    return VrContent.aggregate(
        [
            {
                $match: { "username": { '$regex': user }, "access_level": { '$regex': 'private', '$options': 'i' } }
            },
            {
                $group: { _id: "$category" }
            },
            {
                $sort: { _id: 1 }
            }
        ],
        function (err, results) {
            if (err) {
                return callback(err);
            }
            return callback(results);
        })
}

exports.findByIdAndDelete = async (vrcontentId) => {
    if (!vrcontentId) {
        return Promise.reject(new Error('Invalid id'));
    }
    return VrContent.findByIdAndDelete(vrcontentId);
}

exports.findById = async (vrcontentId, callback) => {
    return VrContent.findById(vrcontentId, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    });
}

exports.findByUser = (username, callback) => VrContent.find({ username }, (err, result) => {
    if (err) {
        return callback(err);
    }
    return callback(null, result);
});

exports.createContent = (title, body, status, username) => {
    return new VrContent({
        title: title,
        body: body,
        status: status,
        username: username,
        status: status,
    });
}

exports.reCreateContent = async (data, hash, priority, files, dir) => {
    try {
        if (checkUserRequest(data.username) === '') {
            data.priority = priority
        }
        data.projectDir = `${CONFIG.URL_S3}/userdata/${data.username}/vr/${hash}`;
        data.images = await checkFiles.saveFileImagestoArray(files, dir, data.images);
        data.audios = await checkFiles.saveFileAudiotoArray(files, dir, data.audios);
        data.vr_data = await checkFiles.saveFileJson(files, dir, data.vr_data);
        data.slug = hash;
        return data.save();
    } catch (e) {
        // Log Errors
        return Promise.reject(new Error('errors save'))
    }
}

exports.updateContent = async (content, title, category, description, passcode, priority, accessLevel, files, username, dir) => {
    try {
        content.title = title || content.title;
        content.category = category || content.category;
        content.description = description || content.description;
        content.passcode = passcode || content.passcode;
        if (checkUserRequest(username) === '') {
            content.priority = priority || content.priority;
            content.access_level = accessLevel || content.access_level;
        }
        content.passcode = passcode || content.passcode;
        content.images = await checkFiles.saveFileImagestoArray(files, dir, content.images);
        content.audios = await checkFiles.saveFileAudiotoArray(files, dir, content.audios);
        content.vr_data = await checkFiles.saveFileJson(files, dir, content.vr_data);
        return content.save();
    } catch (e) {
        // Log Errors
        return Promise.reject(new Error('errors save'))
    }
}

exports.reUpdateContent = async (content, data) => {
    try {
        const compire = await JSON.stringify({ x: content }) !== JSON.stringify({ x: data })
        if (compire === true) {
            data.updatedAt = Date.now()
        }
        return data.save();
    } catch (e) {
        // Log Errors
        return Promise.reject(new Error('errors save'))
    }
}

exports.sendMail = async (email, username, _id) => {
    const mailOptions = {
        to: 'smarteye.id@gmail.com',
        from: email,
        subject: 'Konfirmasi Request Update Acces Level Content',
        text: `User ${username} ingin mengupdate Acces Level untuk kontent dengan link di bawah ini. 
            \n\n ${CONFIG.ip_address_frontend}/vr-edit/${_id} \n\n`
    };
    return sendMail(mailOptions);
}
