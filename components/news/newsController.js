const mongoose = require('mongoose');
const fse = require("fs-extra");
const findStatus = require('../status/statusServices').findById;
const { newsValidation } = require('./newsValidation'),
    { findByIdAndDelete, findById, createContent, updateContent, findAll, reUpdateContent, findByAuthor } = require('./newsServices');

// CREATE an VR Content
exports.create = async (req, res) => {
    const { error, value } = newsValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    const objectId = mongoose.Types.ObjectId.isValid(value.status);
    if (!objectId) {
        return res.status(400).json({ message: 'Invalild status id' })
    }

    const status = await findStatus(value.status, () => { });
    if (!status) {
        return res.status(404).send({ success: false, message: `status not found with ID ${vrcontentId}` })
    }

    try {
        const { title, body, status } = value, author_id = req.user._id;
        const data = await createContent(title, body, status, author_id);
        return res.status(201).json({ success: true, message: "Successfully add new content", news: data });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Error creating VR content", err: err });
    }
};

exports.findAll = async (req, res) => {
    try {
        const ContentAll = await findAll(() => { })
        return res.status(200).json(ContentAll);
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
};

// FIND an VR Content
exports.findOne = async (req, res) => {
    const { newsId } = req.params
    const objectId = mongoose.Types.ObjectId.isValid(newsId);
    if (!objectId) {
        return res.status(400).json({ message: 'Invalild id' })
    }

    const content = await findById(newsId, () => { });
    if (!content) {
        return res.status(404).send({ success: false, message: `News not found with ID ${newsId}` })
    }

    try {
        return res.status(200).send(content)
    } catch (err) {
        return res.status(500).send(err);
    }
};

// FIND an VR Content
exports.findMe = async (req, res) => {
    try {
        const content = await findByAuthor(req.user._id, () => { });
        return res.status(200).json(content);
    } catch (err) {
        return res.status(500).send(err);
    }
};

// UPDATE an VR Content
exports.update = async (req, res) => {
    const content = req.content

    const { error, value } = newsValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    try {
        const { title, body, status } = value;
        const data = await updateContent(content, title, body, status)
        return res.status(201).json({ success: true, message: "Successfully update content", news: data });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Error updating VR content", err: err })
    }
};

// DELETE an VR content
exports.delete = async (req, res) => {
    const { newsId } = req.params
    try {
        const content = await findByIdAndDelete(newsId, () => { });
        if (!content) {
            return res.status(404).send({ success: false, message: "news content not found" })
        }

        return res.status(200).send({ success: true, message: "Content deleted successfully", content: content })
    } catch (err) {
        return res.status(500).send(err);
    }
};
