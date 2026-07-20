const express = require('express');
const authController = require('../controller/authController');
const { identifier } = require('../middleware/identification');
const Router = express.Router();


Router.post('/Signin', authController.signin);
Router.post('/Signup', authController.signup);
Router.post('/Signout', authController.signout);

Router.patch('/Send-verification-code', authController.sendVerificationCode);
Router.patch('/Verify-verification-code', authController.verifyVerificationCode);

Router.patch('/Change-password', identifier,authController.changePassword);

Router.patch('/Forgot-password', authController.sendForgotPasswordCode);
Router.patch('/New-password', authController.verifyForgotPasswordCode);


module.exports = Router;