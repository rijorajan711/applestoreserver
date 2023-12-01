const mongoose=require ("mongoose")


const wishlistSchema=new mongoose.Schema({
   

    userId:{
        type:String,
        required:true
    },
    products:[

        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"products",
                required:true
            }
        }

    ]

})

const wishlistModel=mongoose.model("wishlists",wishlistSchema)
module.exports =wishlistModel