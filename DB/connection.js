const mongoose=require("mongoose");

const connectionString=process.env.ATLAS_CONNECTION_URL

mongoose.connect(connectionString).then(()=>{
    console.log("mongoose connected to ATLAS CLOUD")
}).catch((err)=>
    console.log("connection faild")
)


