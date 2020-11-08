const express = require('express');
const router = express.Router();

const { signup, signin, accountActivation } = require('../controllers/auth');

const {
    userSignupValidator,
    userSigninValidator,
} = require('../validators/auth');
const { runValidation } = require('../validators/index');

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.post('/account-activation', accountActivation);

module.exports = router;
