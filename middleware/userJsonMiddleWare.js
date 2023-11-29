const jwt=require("jsonwebtoken")

const userJsonMiddleware=(req,res,next)=>{

    const token=req.headers.authorization.split(" ")[1]
    console.log("tooooooken userrrrrrrrrr",token)
     
    try{
        const result=jwt.verify(token,"userapplestoreserver")
        req.payload=result.userId 
        
        next()

    }catch(err){
        res.status(401).json("There is a problem in your JWT verification please ReLogin")
    }  
}



module.exports=userJsonMiddleware