const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    token: { type: String, default: null }, // Token for offer
    discount: { type: Number, default: null }, // Discount percentage
    offer: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Offer model
        ref: "Offer", // Links to the OfferModel
        default: null,
      }
})

const UserModel=mongoose.model('users',userSchema)
module.exports=UserModel;