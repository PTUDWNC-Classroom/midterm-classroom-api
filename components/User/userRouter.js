const express = require('express');
const passport = require('./passport')

const router = express.Router();

const userController = require('./userController');

router.post('/sign-up', userController.signUpHandler);

router.post('/sign-in', passport.authenticate('local', { session: false }),userController.signInHandler);


module.exports = router;