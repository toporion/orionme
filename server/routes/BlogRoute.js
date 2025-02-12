const { blogCreate, getBlogData, getCategories, getRecent, getSingleblogData } = require('../controllers/BlogController');
const imageUpload = require('../middlewares/imageUploader');

const router=require('express').Router()


router.post('/',imageUpload.single('blogImage'),blogCreate)
router.get('/',getBlogData)
router.get('/categories',getCategories)
router.get('/recent',getRecent)
router.get('/:id',getSingleblogData)

module.exports=router;