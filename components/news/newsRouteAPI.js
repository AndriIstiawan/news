const express = require('express');
const router = express.Router();
const newsContents = require('./newsController');
const passport = require('passport');
const { authVr } = require('../../_helpers/checkUserRequest');

// Create new VR content
router.post('/news', passport.authenticate('jwt', { session: false }), newsContents.create);

// Retrieve public and user's own VR content after user logged in
router.get('/news', passport.authenticate('jwt', { session: false }), newsContents.findAll);

// Retrieve By(username, access_level, passcode, category) VR content 
router.get('/newsfilter', newsContents.findByFilter);

// Retrieve one VR content
router.get('/news/me', passport.authenticate('jwt', { session: false }), newsContents.findMe);

// Retrieve one VR content
router.get('/news/:newsId', newsContents.findOne);

// Update one VR content
router.put('/news/:newsId', passport.authenticate('jwt', { session: false }), authVr, newsContents.update);

// Delete one VR content
router.delete('/news/:newsId', passport.authenticate('jwt', { session: false }), authVr, newsContents.delete);

module.exports = router;
