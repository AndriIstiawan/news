const mongoose = require('mongoose');
const fse = require("fs-extra");
const checkuser = require('../../_helpers/checkUserRequest').checkUserRequest,
    { newsValidation } = require('./newsValidation'),
    { SearchAllContent, SearchAllUserContent, findByIdAndDelete, findPublicContent,
        createContent, reCreateContent, updateContent, reUpdateContent, findCategoryPublic, 
        findCategoryPrivate, findFilterAllContent, findFilterContent, findByUser, sendMail } = require('./newsServices'),
    { paginate, DataPagination, dynamicSort, Pagination } = require('../../_helpers/pagination');

// CREATE an VR Content
exports.create = async (req, res) => {
    console.log(req.body)
    const { error, value } = newsValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    try {
        const { title, body, status } = value, username = req.user.username;
        const data = await createContent(title, body, status, username);
        const content = await reCreateContent(data, hash, priority, files, dir)
        return res.status(201).json({ success: true, message: "Successfully add new content", content: content });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Error creating VR content", err: err });
    }
};

exports.findAll = async (req, res) => {
    try {
        const pageNo = req.query.page || 1; // parseInt(req.query.pageNo)
        const size = req.query.perPage || 10;
        const user = checkuser(req.user.username);
        const ContentAll = await findContent(() => { })
        const AllUserContent = await findAllContent(user, () => { })

        const AllContent = await ContentAll.concat(AllUserContent).sort(dynamicSort('title'));
        const content = await paginate(AllContent, size, pageNo);

        const { totalPage, hasNextPage, hasPrevPage } = await DataPagination(AllContent, size, pageNo);

        return res.status(200).json({
            success: true,
            docs: content,
            totaldata: AllContent.length,
            perPage: parseInt(size),
            pageNo: parseInt(pageNo),
            totalPage: totalPage,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage
        });
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
};

// FIND an VR Content
exports.findOne = async (req, res) => {
    const { vrcontentId } = req.params
    const objectId = mongoose.Types.ObjectId.isValid(vrcontentId);
    if (!objectId) {
        return res.status(400).json({ message: 'Invalild id' })
    }

    const content = await findById(vrcontentId, () => { });
    if (!content) {
        return res.status(404).send({ success: false, message: `VR content not found with ID ${vrcontentId}` })
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
        const pageNo = req.query.page || 1; // parseInt(req.query.pageNo)
        const size = req.query.perPage || 10;
        const content = await findByUser(req.user.username, () => { });
        const contents = await paginate(content, size, pageNo);
        const { totalPage, hasNextPage, hasPrevPage } = await DataPagination(content, size, pageNo);

        return res.status(200).json({
            success: true,
            docs: contents,
            totaldata: content.length,
            perPage: parseInt(size),
            pageNo: parseInt(pageNo),
            totalPage: totalPage,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage
        });
    } catch (err) {
        return res.status(500).send(err);
    }
};

// create downloadCount an VR Content
exports.downloadCount = async (req, res) => {
    const { vrcontentId } = req.params
    const objectId = mongoose.Types.ObjectId.isValid(vrcontentId);
    if (!objectId) {
        return res.status(400).json({ message: 'Invalild id' })
    }

    const content = await findById(vrcontentId, () => { });
    if (!content) {
        return res.status(404).send({ success: false, message: `VR content not found with ID ${vrcontentId}` })
    }

    try {
        const data = await addDownloader(content)
        return res.status(200).send(data);
    } catch (err) {
        return res.status(500).send(err);
    }
};

// create viewCount an VR Content
exports.viewCount = async (req, res) => {
    const { vrcontentId } = req.params
    const objectId = mongoose.Types.ObjectId.isValid(vrcontentId);
    if (!objectId) {
        return res.status(400).json({ message: 'Invalild id' })
    }

    const content = await findById(vrcontentId, () => { });
    if (!content) {
        return res.status(404).send({ success: false, message: `VR content not found with ID ${vrcontentId}` })
    }

    try {
        const data = await addViewer(content)
        return res.status(200).send(data);
    } catch (err) {
        return res.status(500).send(err);
    }
};

// FIND an VR Content
exports.findByFilter = async (req, res) => {
    try {
        const { username } = req.user
        const category = req.query.category || toString();
        const pageNo = req.query.page || 1; // parseInt(req.query.pageNo)
        const size = req.query.perPage || 10;
        const user = checkuser(username);

        let AllContent, AllUserContent, ContentAll;
        if (!username) {
            AllContent = await findFilterContent(category, () => { })
        } else {
            ContentAll = await findFilterContent(category, () => { })
            AllUserContent = await findFilterAllContent(user, category, () => { })
            AllContent = await ContentAll.concat(AllUserContent).sort(dynamicSort('title'))
        }

        const contents = await paginate(AllContent, size, pageNo);

        const { totalPage, hasNextPage, hasPrevPage } = await DataPagination(AllContent, size, pageNo);

        return res.status(200).json({
            success: true,
            docs: contents,
            totaldata: AllContent.length,
            perPage: parseInt(size),
            pageNo: parseInt(pageNo),
            totalPage: totalPage,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage
        });
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
};

// FIND an VR Content
exports.findByPublic = async (req, res) => {
    try {
        const search = req.query.search || '';
        const page = req.query.page || 1; // parseInt(req.query.pageNo)
        const perPage = req.query.perPage || 10;

        const query = await Pagination(page, perPage)
        const contents = await findPublicContent(search, query, () => { });
        const allContents = await findAllPublicContent(search, () => { });
        const { totalPage, hasNextPage, hasPrevPage } = await DataPagination(allContents, perPage, page);

        return res.status(200).send({
            success: true,
            docs: contents,
            totaldata: allContents.length,
            perPage: parseInt(perPage),
            pageNo: parseInt(page),
            totalPage: totalPage,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage
        });
    } catch (err) {
        return res.status(500).send(err);
    }
};

// FIND an VR Content
exports.findCategory = async (req, res) => {
    try {
        const { username } = req.user
        let contents, result, x, y;
        const user = checkuser(username);
        if (!username) {
            result = await findCategoryPublic(() => { })
            contents = [...new Set(result.map(item => item._id[0]))]
        } else {
            x = await findCategoryPrivate(user, () => { })
            y = await findCategoryPublic(() => { })
            result = x.concat(y)
            contents = [...new Set(result.map(item => item._id[0]))]
        }

        return res.status(200).send({
            success: true,
            category: contents
        });
    } catch (err) {
        return res.status(500).send(err);
    }
};

// Search ARcontent
exports.searchVRContent = async (req, res) => {
    try {
        const { username } = req.user
        const search = req.query.search || '';
        const pageNo = req.query.page || 1; // parseInt(req.query.pageNo)
        const size = req.query.perPage || 10;
        const user = checkuser(username);

        let AllContent, AllUserContent, ContentAll;
        if (!username) {
            AllContent = await SearchAllContent(search, () => { });
        } else {
            ContentAll = await SearchAllContent(search, () => { });
            AllUserContent = await SearchAllUserContent(user, search, () => { })
            AllContent = await ContentAll.concat(AllUserContent).sort(dynamicSort('title'));
        }
        const AllContentSearch = await paginate(AllContent, size, pageNo);

        const { totalPage, hasNextPage, hasPrevPage } = await DataPagination(AllContent, size, pageNo);

        return res.status(200).json({
            success: true,
            docs: AllContentSearch,
            totaldata: AllContent.length,
            perPage: parseInt(size),
            pageNo: parseInt(pageNo),
            totalPage: totalPage,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage
        });
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
}

// UPDATE an VR Content
exports.update = async (req, res) => {
    const contentVr = req.contentVr

    const { error, value } = vrValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    try {
        const { title, category, description, passcode, access_level, priority } = value, files = req.files, username = req.user.username;
        // direktori file
        const dir = `userdata/${contentVr.username}/vr/${contentVr.slug}/`;
        //check folder images dan audios        
        await mkdir(dir);
        //await mkdir(`${dir}images/`);
        // await mkdir(`${dir}audios/`);
        //resize
        // await resizeFile(files, dir)
        let resize = await resizeFileAWS(files, dir)
        if (resize) {
            let uploadResize = await uploadResizeFileAWS(dir)
            if (uploadResize) {
                // //upload file
                // const updateSuccess = await uploadvrFiles(files, dir);
                const updateSuccess = await uploadFilesAWS(files, dir);
                if (updateSuccess) {
                    //update content
                    const data = await updateContent(contentVr, title, category, description, passcode, priority, access_level, files, username, dir)
                    //reupdate content
                    await fse.remove(dir)
                    const contents = await reUpdateContent(contentVr, data)
                    return res.status(201).json({ success: true, message: "Successfully update content", content: contents });
                }
                return res.status(500).json({ success: false, message: 'Failed to upload files. Please retry.' });
            }
            return res.status(500).json({ success: false, message: 'Failed to upload resize files. Please retry.' });
        }
        return res.status(500).json({ success: false, message: 'Failed to resize files. Please retry.' });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Error updating VR content", err: err })
    }
};

// Req UPDATE priority an VR Content
exports.updateReqPriority = async (req, res) => {
    const contentVr = req.contentVr

    try {
        const sendtoMail = await sendMail(req.user.email, req.user.username, contentVr._id)
        if (sendtoMail) {
            return res.status(200).json({ message: 'Permintaan Anda Telah Terikirim.' });
        }
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Error request update VR content", err: err })
    }
};

// DELETE an VR content
exports.delete = async (req, res) => {
    const { vrcontentId } = req.params
    try {
        const content = await findByIdAndDelete(vrcontentId, () => { });
        if (!content) {
            return res.status(404).send({ success: false, message: "VR Content not found" })
        }

        const folder = `userdata/${content.username}/vr/${content.slug}`;
        const deleteSucces = await removeFileAWS(folder)
        if (deleteSucces) {
            return res.status(200).send({ success: true, message: "Content deleted successfully", content: content })
        }
        return res.status(500).json({ success: false, message: 'Content deleted not successfully' });
    } catch (err) {
        return res.status(500).send(err);
    }
};
