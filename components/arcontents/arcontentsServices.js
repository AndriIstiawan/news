const ArContent = require('./arcontentsModel'),
    CONFIG = require('../../config/config'),
    { checkUserRequest } = require('../middlewares/checkUserRequest');

exports.findAllContent = (queryCond, callback) => {
    return ArContent.find(queryCond, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result);
    }).sort({ priority: 1 });
}

exports.createContent = (title, category, description, passcode, username, commerceTitle, commerceDescription) => {
    if (!title) {
        return Promise.reject(new Error('Invalid arguments'));
    }
    return new ArContent({
        title: title,
        category: category,
        description: description,
        username: username,
        thumbnail: 'thumbnail.jpg',
        passcode: passcode,
        commerceData: {
            commerce_title: commerceTitle,
            commerce_description: commerceDescription,
            commerce_thumbnail: '',
            commerce_buttons: []
        }
    })
}

exports.reCreateContent = async (data, hash, priority, files, dir) => {
    try {
        if (checkUserRequest(data.username) === '') {
            data.priority = priority
        }
        data.projectDir = `${CONFIG.ip_address}/userdata/${data.username}/ar/${hash}` || '';
        data.marker = await checkFiles.saveFileMarker(files, dir, data.marker) || '';
        data.backsound = await checkFiles.saveFileAudio(files, dir, data.backsound || '');
        data.dataApkArr = await checkFiles.saveFileApktoArray(files, dir, data.dataApkArr || '');
        data.commerceData.commerce_thumbnail = await checkFiles.saveFileThumbnailCommerce(files, dir, data.commerceData.commerce_thumbnail || '');
        data.slug = hash;
        //console.log(content)
        return data.save();
    } catch (e) {
        // Log Errors
        return Promise.reject(new Error('errors save'))
    }
}

exports.findById = (arcontentId, callback) => {
    return ArContent.findById(arcontentId, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    });
}

exports.addDownloader = (content) => {
    content.downloadCount++;
    return content.save();
}

exports.addViewer = async (content) => {
    content.viewCount++;
    return content.save();
}

exports.updateContent = async (content, title, category, description, priority, passcode, files, username, dir) => {
    try {
        content.title = title || content.title;
        content.category = category || content.category;
        content.description = description || content.description;
        if (checkUserRequest(username) === '') {
            content.priority = priority || content.priority;
        }
        content.passcode = passcode || content.passcode;
        content.marker = await checkFiles.saveFileMarker(files, dir, content.marker || '');
        content.backsound = await checkFiles.saveFileAudio(files, dir, content.backsound || '');
        content.dataApkArr = await checkFiles.saveFileApktoArray(files, dir, content.dataApkArr || '');
        content.commerceData.commerce_thumbnail = await checkFiles.saveFileThumbnailCommerce(files, dir, content.commerceData.commerce_thumbnail || '');
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

exports.findContent = (queryCond, query, callback) => {
    return ArContent.find(queryCond, {}, query, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result);
    }).sort({ priority: 1 });
}

exports.findMarker = (queryCond, query, callback) => {
    return ArContent.find(queryCond, {}, query, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result);
    }).sort({ priority: 1 }).select('-commerceData');
}

exports.findAllMarker = (queryCond, callback) => {
    return ArContent.find(queryCond, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result);
    }).sort({ priority: 1 }).select('marker');
}

exports.findMarkerList = (queryCond, query, callback) => {
    return ArContent.find(queryCond, {}, query, (err, result) => {
        if (err) {
            return callback(err)
        };
        return callback(result);
    }).sort({ priority: 1 }).select('marker updatedAt');
}

// exports.findAllMarkerList = (queryCond, callback) => {
//     return ArContent.find(queryCond, (err, result) => {
//         if (err) { return callback(err) }
//         return callback(result);
//     }).sort({ priority: 1 }).select('marker');
// }

exports.searchAllContent = async (user, search, callback) => {
    return ArContent.find({
        username: { '$regex': user },
        "$or": [
            { passcode: { '$regex': search, '$options': 'i' } },
            { category: { '$regex': search, '$options': 'i' } },
            { description: { '$regex': search, '$options': 'i' } },
            { title: { '$regex': search, '$options': 'i' } }
        ]
    }, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result);
    });
}

exports.searchContent = (query, user, search, callback) => {
    return ArContent.find({
        username: { '$regex': user },
        "$or": [
            { passcode: { '$regex': search, '$options': 'i' } },
            { category: { '$regex': search, '$options': 'i' } },
            { description: { '$regex': search, '$options': 'i' } },
            { title: { '$regex': search, '$options': 'i' } }
        ]
    }, {}, query, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(result);
    });
}

exports.assignButtonCommerce = (arcontent, buttonCommerceId) => {
    arcontent.commerceData.commerce_buttons.push(buttonCommerceId)
    return arcontent.save();
}

exports.findByIdAndDelete = (arcontentId) => {
    if (!arcontentId) {
        return Promise.reject(new Error('Invalid id'));
    }
    return ArContent.findByIdAndDelete(arcontentId);
}
