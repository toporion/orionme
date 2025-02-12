const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const blogSChema=new Schema({
    title:{type:String,required:true},
    keyword:{type:String,required:true},
    details:{type:String,required:true}, 
    publish_by:{type:String,required:true},
    like:{type:String,required:true},
    blogImage:{type:String,required:true},
    category:{type:String,required:true},
    createdAt: {type: Date,default: Date.now},
    updatedAt: {type: Date,default: Date.now},
})
const BlogModel=mongoose.model('blogs',blogSChema)
module.exports=BlogModel;