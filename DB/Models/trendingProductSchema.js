const mongoose=require("mongoose")

const trendingProductSchema=new mongoose.Schema({

    
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
        type:Number,
        required:true
    },
    uploadimages:{
        type:Array,
        required:true
    }

})

const trndingProductsModel=mongoose.model("trndingproducts",trendingProductSchema)
module.exports=trndingProductsModel



