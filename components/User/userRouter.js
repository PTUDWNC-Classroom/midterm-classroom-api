const express = require('express');
const router = express.Router();

const userController = require('./userController');

router.post('/sign-up', userController.signUpHandler);

router.post('/sign-in', userController.signInHandler);


module.exports = router;