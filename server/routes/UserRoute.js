const { createUser, loginUser } = require('../controllers/UserController');
const { createUserValidation, loginUserValidation } = require('../middlewares/AuthValidation');

const route=require('express').Router()

route.post('/signUp',createUserValidation,createUser)
route.post('/login',loginUserValidation,loginUser)

module.exports=route;