const express = require("express")
const UserRouter = express.Router()
const registerController = require('../controllers/userController')

UserRouter.post('/', registerController);

module.exports = UserRouter