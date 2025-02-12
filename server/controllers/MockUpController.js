const FreeMockUpModel = require("../models/FreeTry");

const mockUpCreate=async(req,res)=>{
    try{
        const {name,email,message}=req.body;
        const newMockUpData=new FreeMockUpModel({name,email,message})
        await newMockUpData.save()
        res.status(201).json({
            success:true,
            message:"Successfully requested mockup idea",
            data:newMockUpData
        })
    }catch(error){
        console.log('see error',error)
        res.status(500).json({
            success:false,
            message:"Internal server issue"
        })
    }
}

module.exports={mockUpCreate};