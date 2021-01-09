const express = require('express');
const router = express.Router();
const multer = require('multer');
const arContents = require('./arcontentsController');
const upload = multer({ dest: 'userdata/' });
const auth = require('../../_helpers/checkUserRequest').authAr;
const passport = require('passport');

// Create new AR content
router.post('/arcontents', passport.authenticate('jwt', { session: false }), upload.any(), arContents.create);

// Retrieve ByOwner AR content
router.get('/arfilter', passport.authenticate('jwt', { session: false }), arContents.findByFilter);

// Retrieve all AR contents
router.get('/arcontents', passport.authenticate('jwt', { session: false }), arContents.findAll);

// Retrieve all Marker
router.get('/arcontents/marker', arContents.findMarker);

// Retrieve all Marker
router.get('/arcontents/non-marker', arContents.findNonMarker);

// Retrieve all Marker
router.get('/arcontents/marker-list', arContents.findMarkerList);

// Search AR content
router.get('/arsearch', passport.authenticate('jwt', { session: false }), arContents.searchARContent);

// create download AR content
router.post('/downloadar/:arcontentId', arContents.downloadCount);

// create view VR content
router.post('/viewar/:arcontentId', arContents.viewCount);

// Retrieve one AR content
router.get('/arcontents/:arcontentId', arContents.findOne);

// Update one AR content
router.put('/arcontents/:arcontentId', passport.authenticate('jwt', { session: false }), auth, upload.any(), arContents.update);

// Delete one AR content
router.delete('/arcontents/:arcontentId', passport.authenticate('jwt', { session: false }), auth, arContents.delete);

module.exports = router;
