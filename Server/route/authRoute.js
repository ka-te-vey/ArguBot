const express = require('express');
const authController = require('../controller/authController');
const Router = express.Router();


Router.post('/Signin', authController.signin);
Router.post('/Signup', authController.signup);
Router.post('/Signout', authController.signout);

Router.patch('/send-verification-code', authController.sendVerificationCode);
Router.patch('/verify-verification-code', authController.verifyVerificationCode);

Router.patch('/change-password', authController.changePassword);

Router.patch('/forgot-password', authController.sendForgotPasswordCode);
Router.patch('/new-password', authController.verifyForgotPasswordCode);


module.exports = Router;