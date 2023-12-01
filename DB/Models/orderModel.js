const mongoose=require ("mongoose")


const orderSchema=new mongoose.Schema({
   

    userId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    housename:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    total:{
        type:String,
        required:true
    },
    date:{
        type:Date,
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


const orderModel=mongoose.model("orders",orderSchema)
module.exports =orderModel