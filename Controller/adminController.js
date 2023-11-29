   const mongoose=require("mongoose")
   const adminLoginModel =require("../DB/Models/adminLoginSchema")
   const jwt=require("jsonwebtoken")
   const productsModel=require("../DB/Models/productSchema")
   const userLoginModel=require("../DB/Models/userLoginSchema")


    module.exports={

      isAdminLoginExist: async(req,res)=>{
        const {adminemail}=req.body
        // console.log("chathiiiii",adminemail)
        const isAdmin=await adminLoginModel.findOne({adminemail:adminemail})
        if(isAdmin){
            
            const token=jwt.sign({adminUserId:isAdmin._id},"applestoreserver")
            // ,{expiresIn:60}
            res.status(200).json({token,isAdmin})

         
        }else{
            res.status(501).json("sorry email is incorrect")
        }
          
      },
      addProductController:async(req,res)=>{
            const {title,description,category,price}=req.body
            console.log("ethaaaaaaaaanu files",req.files)
            const uploadImagesArray=req.files.map((file)=>{return file.filename})
            console.log("ethaaaaaaaaanu files arrayyyyyyyyyyyyyyy",uploadImagesArray)
            const productExist=await productsModel.findOne({title})
            if(productExist){
                res.status(501).json("The product already Exist..")
            }else{
                const addProductToDataBase=new productsModel({
                    title:title,
                    description:description,
                    category:category,
                    price:price,
                    uploadimages:uploadImagesArray
                })

                await addProductToDataBase.save().then((data)=>{
                     res.status(200).json(`${data.title} is added successfully`)
                }).catch((err)=>{
                    res.status(400).json(err)
                })
            }



           
      },
      getAllproductController:async(req,res)=>{
                await productsModel.find().then((data)=>{
                        res.status(200).json(data)
                }).catch((err)=>{
                        res.status(401).json(err)
                })
      },

      deleteProductController:async(req,res)=>{
               const productId=req.body.productId
            // console.log("product id from server",productId)
               await productsModel.findOneAndDelete({_id:productId}).then((data)=>{
                   res.status(200).json(data)
                }).catch((err)=>{
                    res.status(401).json(err)
                    
                })
            },

            getAllUserController:async(req,res)=>{
                await userLoginModel.find().then((data)=>{
                           res.status(200).json(data)      
                }).catch((err)=>{
                          res.status(401).json(err)
                })

            },

            deleteUserController:async(req,res)=>{
                     
                const {userId}=req.body
                  await userLoginModel.findByIdAndDelete({_id:userId}).then((data)=>{
                    res.status(200).json(data)
                  }).catch((err)=>{
                    res.status(401).json(err)
                  })

            },

            blockAndUnblockUserController:async(req,res)=>{
                const {userStatus,userId}=req.body
                await userLoginModel.findOneAndUpdate({_id:userId},{$set:{status:userStatus}},{new:true}).then((data)=>{
                    
                    res.status(200).json(data)
                }).catch((err)=>{
                    console.log("there is an error")
                    res.status(401).json(err)
                })
            },
            editProductController:async(req,res)=>{

                const {productid,title,description,category,price,uploadimages}=req.body
             
                const uploadimagesInControler=req.files?req.files.map((file)=>(file.filename)):uploadimages.split(",")
                
                const result=await productsModel.findByIdAndUpdate({_id:productid},{title,description,category,price,uploadimages:uploadimagesInControler},{new:true})
                await result.save().then((data)=>{
                    
                        res.status(200).json(data)
                   }).catch((err)=>{
                        res.status(401).json(err)
                   })
                   

            }
    }
                   
         


                
