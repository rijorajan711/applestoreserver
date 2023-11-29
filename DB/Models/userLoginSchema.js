const mongoose=require("mongoose")


const userLoginSchema=new mongoose.Schema({
          
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    } ,
    
    status:{
        type:Boolean,
        default:false
    }



})


const userLoginModel=mongoose.model("users",userLoginSchema)
module.exports=userLoginModel