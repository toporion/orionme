const BlogModel = require("../models/blogModel");

const blogCreate=async(req,res)=>{
    try{
        const blogdata=req.body;
           // Handle profile image (if file upload is set up)
           const blogImage = req.file ? req.file.path : null;
        const createBlog=await BlogModel({
            ...blogdata,
            blogImage
        })
        await createBlog.save()
        res.status(201).json({
            success:true,
            message:"successfully created your blog",
            data:createBlog
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal server error",

        })
    }
}
const getBlogData=async(req,res)=>{
    try{
        let {search,page,limit}=req.query;
        page=parseInt(page) || 1;
        limit=parseInt(limit) || 5;

        const skip=(page-1)* limit;

        let searchCriteria={}
        if (search) {
            searchCriteria.title = { $regex: search, $options: 'i' }

        }
        const totalBlogs=await BlogModel.countDocuments(searchCriteria)
        const getAllBlogs=await BlogModel.find(searchCriteria)
        .skip(skip)
        .limit(limit)
        .sort({updatedAt:-1})

        if(!getAllBlogs || getAllBlogs.length===0){
            return res.status(404).json({
                success:false,
                message:"No Blog Found"
            })
        }

        const totalPages=Math.ceil(totalBlogs/limit)
        res.status(201).json({
            success:true,
            message:"Sccessfuly get all",
            data:{
                blogs:getAllBlogs,
                pagination:{
                    totalBlogs,
                    currentPage:page,
                    pageSize:limit,
                    totalPages
                }
            }
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

const getSingleblogData=async(req,res)=>{
    try{
        const {id}=req.params;
        const singleData=await BlogModel.findOne({_id:id})
        res.status(201).json({success:true,message:"Get successfully",data:singleData})

    }catch(error){
        console.log(error)
        res.status(500).json({success:false,message:"internal server error"})
    }
}

const getCategories=async(req,res)=>{
    try{
        const categories=await BlogModel.distinct('category')
        res.json({categories})
    }catch(error){
        res.status(400).json({
            message:"not found"
        })
    }
}
const getRecent=async(req,res)=>{
    try{
        const recent=await BlogModel.find().sort({createdAt:-1}).limit(5);
        res.json({recent})

    }catch(error){
        res.status(400).json({
            message:"not found"
        })
    }
}
module.exports={blogCreate,getBlogData,getCategories,getRecent,getSingleblogData}