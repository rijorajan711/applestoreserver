const mongoose=require ("mongoose")


const cartSchema=new mongoose.Schema({
   

    userId:{
        type:String,
        required:true,
        ref:"products"
    },
    products:[

        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
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