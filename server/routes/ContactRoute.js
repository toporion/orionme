const { Router } = require('express');
const { createContact } = require('../controllers/ContactController');

const router=require('express').Router()

router.post('/',createContact)

module.exports=router;