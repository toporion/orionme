const { mockUpCreate } = require('../controllers/MockUpController')

const route=require('express').Router()

route.post('/',mockUpCreate)

module.exports=route;