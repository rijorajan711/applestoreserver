require("dotenv").config()
const express=require("express")
const cors=require("cors")
const userRouter=require("./Routes/userRouter")
const adminRouter=require("./Routes/adminRouter")
require("./DB/connection")

const appleServer=express()

appleServer.use(cors())

appleServer.use(express.json())

appleServer.use("/admin",adminRouter)
appleServer.use("/user",userRouter)

appleServer.use("/images",express.static("./uploads"))

const PORT=4000||process.env.PORT

appleServer.listen(PORT,()=>{
    console.log("server create a connection with port 4000")
})



