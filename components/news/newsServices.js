const News = require("./newsModel");

exports.findAll = (callback) => {
    return News.aggregate(
        [
            {
                $lookup:
                {
                    from: "users",
                    localField: "author_id",
                    foreignField: "_id",
                    as: "author_id"
                }
            },
            {
                $lookup:
                {
                    from: "status",
                    localField: "status",
                    foreignField: "_id",
                    as: "status"
                }
            },
            {
                $project: {
                    "author_id": { "$arrayElemAt": ['$author_id.username', 0] },
                    "title": 1,
                    "createdAt": 1,
                    "status": { "$arrayElemAt": ['$status.status', 0] },
                }
            }
        ], (err, result) => {
            if (err) {
                return callback(err)
            }
            return callback(result)
        });
}

exports.findByIdAndDelete = async (newsId) => {
    return News.findByIdAndDelete(newsId).lean();
}

exports.findById = async (newsId, callback) => {
    return News.findById(newsId, (err, result) => {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    });
}

exports.findByAuthor = (author_id, callback) => News.aggregate(
    [
        { $match: { author_id } },
        {
            $lookup:
            {
                from: "users",
                localField: "author_id",
                foreignField: "_id",
                as: "author_id"
            }
        },
        {
            $lookup:
            {
                from: "status",
                localField: "status",
                foreignField: "_id",
                as: "status"
            }
        },
        {
            $project: {
                "author_id": { "$arrayElemAt": ['$author_id.username', 0] },
                "title": 1,
                "createdAt": 1,
                "status": { "$arrayElemAt": ['$status.status', 0] },
            }
        }
    ], (err, result) => {
        if (err) {
            return callback(err);
        }
        return callback(null, result);
    });

exports.createContent = (title, body, status, author_id) => {
    return new News({
        title: title,
        body: body,
        status: status,
        author_id: author_id,
        status: status,
    }).save();
}

exports.updateContent = async (content, title, body, status) => {
    try {
        content.title = title || content.title;
        content.body = body || content.body;
        content.status = status || content.status;
        return content.save();
    } catch (e) {
        // Log Errors
        return Promise.reject(new Error('errors update'))
    }
}
