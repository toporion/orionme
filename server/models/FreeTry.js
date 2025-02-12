const mongoose=require('mongoose')
const Schema=mongoose.Schema


const freeSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    message:{type:String,required:true}
})

const FreeMockUpModel=mongoose.model('mockUps',freeSchema)
module.exports=FreeMockUpModel;