const crypto = require('crypto');

exports.convertToSlug = (text) => {
    return text.toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
}

exports.makeHash = (_id) => {
    return crypto.createHmac('sha1', JSON.stringify(_id)).update(JSON.stringify(_id)).digest('hex');
}
