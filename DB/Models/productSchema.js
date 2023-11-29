const mongoose=require("mongoose")

const productSchema=new mongoose.Schema({

    
    title:{
         type:String,
         required:true,
        },

    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    uploadimages:{
        type:Array,
        required:true
    }

})

const productsModel=mongoose.model("products",productSchema)
module.exports=productsModel



