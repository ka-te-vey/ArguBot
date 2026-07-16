const express = require('express');
const authController = require('../controller/authController');
const Router = express.Router();


Router.post('/Signin', authController.signin);
Router.post('/Signup', authController.signup);
Router.post('/Signout', authController.signout);


module.exports = Router;