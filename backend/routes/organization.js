// NPM
const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, res, cb) => {
        cb(null, Date.now())
    }
})


// CONTROLLERS

const { isOriginVerify, authenticateJWT } = require('../helpers/origin_check');
const { signUp, login, organizationData, myProfile, seedAdmin } = require('../controller/user-controller');


router.post('/signup', signUp);

router.post('/login', login);

router.get('/admin-seed', seedAdmin);

router.post(['/add-fake-data', '/user-data-list', '/get-single-data'], authenticateJWT('admin'), organizationData);

router.post('/my-profile', authenticateJWT(''), myProfile);







module.exports = router;