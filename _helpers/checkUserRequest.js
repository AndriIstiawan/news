const News = require('../components/news/newsServices');
const mongoose = require('mongoose');

exports.authNews = async (req, res, next) => {
    const { newsId } = req.params
    const objectId = mongoose.Types.ObjectId.isValid(newsId);
    if (!objectId) {
        return res.status(400).json({ message: 'Invalild id' })
    }

    const content = await News.findById(newsId, () => { })
    if (!content) {
        return res.status(404).send({ success: false, message: "News not found" })
    }

    if (req.user._id.toString() === content.author_id.toString()) {
        req.content = content
        return next();
    }
    return res.status(401).end('Unauthorization');
};
