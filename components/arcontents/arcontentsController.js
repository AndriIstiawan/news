const mongoose = require('mongoose');
const fse = require('fs-extra'),
    { checkUserRequest } = require('../../_helpers/checkUserRequest'),
    { Pagination, DataPagination } = require('../../_helpers/pagination'),
    findAllContent = require('./arcontentsServices').findAllContent,
    { findContent, findById, findAllMarker, findMarker, findAllMarkerList, findMarkerList, addDownloader, addViewer, createContent, reCreateContent,
        searchAllContent, updateContent, findByIdAndDelete, searchContent, reUpdateContent } = require('./arcontentsServices'),
    
    { arValidation } = require('./arcontentsValidation'),
    { makeHash } = require('../../_helpers/converter');

// CREATE an AR Content
exports.create = async (req, res) => {
    const { error, value } = arValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    try {
        //save new content to create id
        const { title, category, description, passcode, priority, commerce_title, commerce_description } = value, files = req.files;
        const user = req.user.username;
        const data = await createContent(title, category, description, passcode, user, commerce_title, commerce_description);
        //make id to hash
        const hash = await makeHash(data._id);
        //dir folder
        const dir = `userdata/${data.username}/ar/${hash}/`;
        //check folder images dan audios
        await mkdir(`${dir}images/`);
        await mkdir(`${dir}commerceData/`);
        await mkdir(`${dir}audios/`);
        //upload file
        const uploadSuccess = await uploadFiles(files, dir);
        //recreate content full field
        const content = await reCreateContent(data, hash, priority, files, dir);
        if (uploadSuccess === true) {
            return res.status(201).json({ success: true, message: "Successfully create new content", content: content })
        }
        return res.status(500).json({ success: false, message: 'Failed to upload all files. Please retry.' });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Error creating VR content", err: err })
    }
}


// FETCH all AR Contents
exports.findAll = async (req, res) => {
    try {
        const username = await checkUserRequest(req.user.username);
        const queryCond = {
            ...(username && { username })
        }
        const pageNum = req.query.page || 1; // parseInt(req.query.pageNo)
        const sizePage = req.query.perPage || 10;

        const query = await Pagination(pageNum, sizePage)
        const contents = await findContent(queryCond, query, () => { });
        const allContents = await findAllContent(queryCond, () => { });
        const { totalPage, hasNextPage, hasPrevPage } = await DataPagination(allContents, sizePage, pageNum);

        return res.status(200).send({
            success: true,
            docs: contents,
            totaldata: allContents.length,
            perPage: parseInt(sizePage),
            pageNo: parseInt(pageNum),
            totalPage: totalPage,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage
        });
    } catch (err) {
        return res.status(500).send(err);
    }
}

// FETCH all AR Contents
exports.findMarker = async (req, res) => {
    try {
        const pageNum = req.query.page || 1; // parseInt(req.query.pageNo)
        const sizePage = req.query.perPage || 10;

        const query = await Pagination(pageNum, sizePage)
        const contents = await findMarker({ marker: { $exists: true, $ne: "" } }, query, () => { });
        const allContents = await findAllMarker({ marker: { $exists: true, $ne: "" } }, () => { });
        const { totalPage, hasNextPage, hasPrevPage } = await DataPagination(allContents, sizePage, pageNum);

        return res.status(200).send({
            success: true,
            docs: contents,
            totaldata: allContents.length,
            perPage: parseInt(sizePage),
            pageNo: parseInt(pageNum),
            totalPage: totalPage,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage
        });
    } catch (err) {
        return res.status(500).send(err);
    }
}

// FETCH all AR Contents
exports.findNonMarker = async (req, res) => {
    try {
        const pageNum = req.query.page || 1; // parseInt(req.query.pageNo)
        const sizePage = req.query.perPage || 10;

        const query = await Pagination(pageNum, sizePage)
        const contents = await findMarker({ marker: { $nin: /http/ } }, query, () => { });
        const allContents = await findAllMarker({ marker: { $nin: /http/ } }, () => { });
        const { totalPage, hasNextPage, hasPrevPage } = await DataPagination(allContents, sizePage, pageNum);

        return res.status(200).send({
            success: true,
            docs: contents,
            totaldata: allContents.length,
            perPage: parseInt(sizePage),
            pageNo: parseInt(pageNum),
            totalPage: totalPage,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage
        });
    } catch (err) {
        return res.status(500).send(err);
    }
}

// FETCH all AR Contents
exports.findMarkerList = async (req, res) => {
    try {
        const pageNum = req.query.page || 1; // parseInt(req.query.pageNo)
        const sizePage = req.query.perPage || 10;

        const query = await Pagination(pageNum, sizePage)
        const contents = await findMarkerList({ 'commerceData.commerce_buttons': { $exists: true, $ne: [] } }, query, () => { });
        const allContents = await findAllMarker({ 'commerceData.commerce_buttons': { $exists: true, $ne: [] } }, () => { });
        const { totalPage, hasNextPage, hasPrevPage } = await DataPagination(allContents, sizePage, pageNum);

        return res.status(200).send({
            success: true,
            docs: contents,
            totaldata: allContents.length,
            perPage: parseInt(sizePage),
            pageNo: parseInt(pageNum),
            totalPage: totalPage,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage
        });
    } catch (err) {
        return res.status(500).send(err);
    }
}

// FIND an AR Content
exports.findOne = async (req, res) => {
    const { arcontentId } = req.params;
    const objectId = mongoose.Types.ObjectId.isValid(arcontentId);
    if (!objectId) {
        return res.status(400).json({ message: 'Invalild id' })
    }

    const content = await findById(arcontentId, () => { });
    if (!content) {
        return res.status(404).send({ success: false, message: `AR content not found with ID ${arcontentId}` })
    }

    try {
        return res.status(200).send(content)
    } catch (err) {
        return res.status(500).send(err);
    }
}

// create downloadCount an AR Content
exports.downloadCount = async (req, res) => {
    const { arcontentId } = req.params;
    const objectId = mongoose.Types.ObjectId.isValid(arcontentId);
    if (!objectId) {
        return res.status(400).json({ message: 'Invalild id' })
    }

    const content = await findById(arcontentId, () => { });
    if (!content) {
        return res.status(404).send({ success: false, message: `AR content not found with ID ${arcontentId}` })
    }

    try {
        const data = await addDownloader(content)
        return res.status(200).send(data);
    } catch (err) {
        return res.status(500).send(err);
    }
};

// create viewCount an AR Content
exports.viewCount = async (req, res) => {
    const { arcontentId } = req.params;
    const objectId = mongoose.Types.ObjectId.isValid(arcontentId);
    if (!objectId) {
        return res.status(400).json({ message: 'Invalild id' })
    }

    const content = await findById(arcontentId, () => { });
    if (!content) {
        return res.status(404).send({ success: false, message: `AR content not found with ID ${arcontentId}` })
    }

    try {
        const data = await addViewer(content)
        return res.status(200).send(data);
    } catch (err) {
        return res.status(500).send(err);
    }
};

// FIND an AR Content
exports.findByFilter = async (req, res) => {
    try {
        const { category, passcode } = req.query;
        const username = await checkUserRequest(req.user.username);
        const queryCond = {
            ...(username && { username }),
            ...(passcode && { passcode }),
            ...(category && { category })
        }

        const pageNo = req.query.page || 1; // parseInt(req.query.pageNo)
        const size = req.query.perPage || 10;

        const query = await Pagination(pageNo, size)
        const contents = await findContent(queryCond, query, () => { });
        const allContents = await findAllContent(queryCond, () => { });
        const { totalPage, hasNextPage, hasPrevPage } = await DataPagination(allContents, size, pageNo);

        return res.status(200).send({
            success: true,
            docs: contents,
            totaldata: allContents.length,
            perPage: parseInt(size),
            pageNo: parseInt(pageNo),
            totalPage: totalPage,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage
        });
    } catch (err) {
        return res.status(500).send(err);
    }
}

// Search ARcontent
exports.searchARContent = async (req, res) => {
    try {
        const search = req.query.query || '';
        const pageNo = req.query.page || 1; // parseInt(req.query.pageNo)
        const size = req.query.perPage || 10;
        const user = await checkUserRequest(req.user.username);

        const query = await Pagination(pageNo, size);
        const contents = await searchContent(query, user, search, () => { });
        const data = await searchAllContent(user, search, () => { });
        const { totalPage, hasNextPage, hasPrevPage } = await DataPagination(data, size, pageNo);

        return res.status(200).json({
            success: true,
            docs: contents,
            totaldata: data.length,
            perPage: parseInt(size),
            pageNo: parseInt(pageNo),
            totalPage: totalPage,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage
        });
    } catch (err) {
        return res.status(500).send(err);
    }
}

// UPDATE an AR Content
exports.update = async (req, res) => {
    const { arcontentId } = req.params;
    const content = await findById(arcontentId, () => { });
    if (!content) {
        return res.status(404).send({ success: false, message: `AR content not found with ID " ${arcontentId}` })
    }

    const { error, value } = arValidation(req.body);
    if (error) {
        return res.send(error.details[0].message)
    }

    try {
        const username = req.user.username;
        const { title, category, description, priority, passcode } = value, files = req.files;
        // direktori file
        const dir = `userdata/${content.username}/ar/${content.slug}/`;
        const updateSuccess = await uploadFiles(files, dir);
        const data = await updateContent(content, title, category, description, priority, passcode, files, username, dir);
        const contents = await reUpdateContent(content, data)

        if (updateSuccess === true) {
            return res.status(200).send({ success: true, message: "Success updating content", contents: contents })
        }
        return res.status(500).json({ success: false, message: 'Failed to upload all files. Please retry.' })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Error updating VR content", err: err })
    }
}

// DELETE an AR content
exports.delete = async (req, res) => {
    const { arcontentId } = req.params;
    const content = await findByIdAndDelete(arcontentId);
    if (!content) {
        return res.status(404).send({ success: false, message: "Content not found" })
    }

    try {
        const folder = `userdata/${content.username}/ar/${content.slug}`;
        await fse.remove(folder);
        return res.status(200).send({ success: true, message: "Content deleted successfully", content: content })
    } catch (err) {
        return res.status(500).send(err);
    }
}
