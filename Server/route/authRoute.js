const express = require('express');
const { authController } = require('../controller/authController');

const authController = {
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require ('../controller/authController');

route.get('/getAllUser', authController.getUser);
route.post('/createUser', authController.createUser);
route.put('/updateUserInformation', authController.updateUser);
route.delete('/removeUserInformation', authController.deleteUser);