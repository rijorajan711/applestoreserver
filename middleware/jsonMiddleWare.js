const jwt=require("jsonwebtoken")

const jwtVerification=async(req,res,next)=>{

    // console.log("before mullllllllllllllllllll")
    const token= req.headers.authorization.split(" ")[1]
    try{
       const response=jwt.verify(token,"applestoreserver")
    //    console.log("jwt verificationn response",response) 
        // console.log("jwt verification",token)
        next()
    }catch(err){
        res.status(401).json("problems occure in token in jwt verificaton please login again ")
    }
}

module.exports=jwtVerification
            
    
    



