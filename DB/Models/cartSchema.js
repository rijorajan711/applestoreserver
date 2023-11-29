const mongoose=require ("mongoose")


const cartSchema=new mongoose.Schema({
   

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
            },
            count:{
                type:Number
               
             }
        }

    ]

})

const cartModel=mongoose.model("carts",cartSchema)
module.exports =cartModel