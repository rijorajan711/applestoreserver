require("mongoose");
const jwt = require("jsonwebtoken");
const userLoginModel = require("../DB/Models/userLoginSchema");
const productsModel = require("../DB/Models/productSchema");
const cartModel = require("../DB/Models/cartSchema");
const wishlistModel = require("../DB/Models/wishlistSchema");
const orderModel=require("../DB/Models/orderModel")
const trendingProductsModel=require("../DB/Models/trendingProductSchema")
const nodemailer =require("nodemailer")
const authEmail=process.env.EMAIL
const authPass=process.env.STEP_VERIFICATION_PASS

module.exports = {
    userSignUpController: async (req, res) => {
        const { username, email, password } = req.body;
        const isSignUpExist = await userLoginModel.findOne({ email });
        if (isSignUpExist) {
            res.status(501).json("This user is already exist");
        } else {
            
              
            let mailerConfig={
                service:'gmail',
                host:"smtp.gmail.com",
                auth:{
                    user:authEmail,
                    pass:authPass
                }
            }

            const emailVerificationToken = jwt.sign(
                {username:username,email:email,password:password},
                "emailVerificationToken"
            );
            

            let transporter=nodemailer.createTransport(mailerConfig)
            let message={
                from:authEmail,
                to:"rijorajan27594@gmail.com",
                subject:"hellow rijo",
                text:`${emailVerificationToken}`
             
                    }

                    
            await transporter.sendMail(message).then((data)=>{
                res.status(200).json("Open your Gmail and copy the token")
                }).catch((err)=>{
                    res.status(401).json({"error":err})
                })
                
                
                
            }
    },
    
    
    nodeMailerPastedTokenController:async(req,res)=>{
         console.log("jaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        const token= req.headers.authorization.split(" ")[1]
        console.log("please give a token god",token)
        try{
          const  result=jwt.verify(token,"emailVerificationToken")
          const  username=result.username
          const  email=result.email
          const  password=result.password

          const newUserSignUp = new userLoginModel({
            username: username,
            email: email,
            password: password,

        });
        await newUserSignUp
        .save()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(401).json(err);
        });
            
    
    
        }catch(err){
            res.status(401).json("There is a problem in your JWT verification please sign up with a valid email")
        }  

              
          
          
    },
    

    // res.status(200).json(isUserLoginExist)
    userLoginController: async (req, res) => {
        const { email, password } = req.body;
        console.log(req.body);
        await userLoginModel
            .findOne({ email })
            .then((result) => {
                if (result) {
                    console.log("after userrrrrrrrrrrr checking from database", result);
                    const { username, email, status } = result;

                    if (status) {
                        console.log("user is blocked");
                        res.status(401).json("User is blocked By Admin");
                    } else {
                        const usertoken = jwt.sign(
                            { userId: result?._id, username: result?.username },
                            "userapplestoreserver"
                        );
                        console.log("created tokennnnnnvnnnnrrrrrrrrrrrrr", usertoken);
                        res.status(200).json({ usertoken, username });
                    }
                } else {
                    res.status(501).json("sorry user does not exist");
                }
            })
            .catch((err) => {
                res.status(401).json(err);
            });
    },
    userGetAllProductController: async (req, res) => {
         let searhKey=req.query.search
         console.log(searhKey)
        
        await productsModel
            .find({title:{$regex:searhKey,$options:"i"}})
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(401).json(err);
            });
    },

    //get product by category

    userGetCategoryProductController: async (req, res) => {
        const { filterKey } = req.body;
        await productsModel
            .find({ category: filterKey })
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(401).json(err);
            });
    },

    //add to cart
    userAddProductToCart: async (req, res) => {
        const userId = req.payload;
        const { productId } = req.body;
        const userCartDetail = await cartModel.findOne({ userId: userId });
        if (userCartDetail) {
            // console.log("padayapppaaaa", userCartDetail)
            const productExistInCart = userCartDetail.products.filter((product) => {
                return product.productId == productId;
            });

            if (productExistInCart.length > 0) {
                // console.log("sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss", productExistInCart)
                const result = await cartModel.updateOne(
                    { "products.productId": productId },
                    { $inc: { "products.$.count": 1 } }
                );
                if (result.acknowledged === true) {
                    res.status(200).json("Product Count increment by 1");
                }
            } else {
                const result = await cartModel.updateOne(
                    { userId: userId },
                    { $push: { products: { productId, count: 1 } } }
                );
                if (result.acknowledged === true) {
                    res.status(200).json("New product is added to product array");
                }
            }
        } else {
            const newCartProduct = new cartModel({
                userId: userId,
                products: [
                    {
                        productId: productId,
                        count: 1,
                    },
                ],
            });

            await newCartProduct.save();
            res.status(200).json("neww product with new user added to cart");
        }
    },
    // add to wishlist

    userGetCartProductController: async (req, res) => {
        const userId = req.payload;

        const cartProducts = await cartModel.aggregate([
            { $match: { userId: userId } },
            { $unwind: "$products" },
            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "products.productDetails",
                },
            },
            { $unwind: "$products.productDetails" },
            {
                $group: {
                    _id: {
                        count: "$products.count",
                        productDetails: "$products.productDetails",
                    },
                },
            },
            {
                $project: {
                    "_id.count": 1,
                    "_id.productDetails": 1,
                    "_id.total": {
                        $multiply: ["$_id.count", "$_id.productDetails.price"],
                    },
                },
            },
            { $sort: { "_id.productDetails.title": 1 } },
        ]);
        if (cartProducts) {
            let grandTotal = 0;
            cartProducts.forEach((product) => {
                grandTotal += product._id.total;
            });

            res.status(200).json({ cartProducts, grandTotal });
        } else {
            res
                .status(401)
                .json("There is no Cart product So Plese add some PRoduct to cart");
        }
    },
    removeProductFromCartController: async (req, res) => {
        const userId = req.payload;
        const { productId } = req.body;
        try {
            const result = await cartModel.findOneAndUpdate(
                { userId: userId },
                { $pull: { products: { productId: productId } } }
            );

            res.status(200).json(result);
        } catch (err) {
            res.status(401).json(err);
        }
    },
    //increment and decrement cart product count

    increDecreCartProductQuantity: async (req, res) => {
        const userId = req.payload;
        const { productId, actionValue } = req.body;
        const result = await cartModel.findOneAndUpdate(
            { userId: userId, "products.productId": productId },
            { $inc: { "products.$.count": actionValue } }
        );
        res.status(200).json(result);
    },

    //add to wishlist
    userAddProductToWishlist: async (req, res) => {
        const userId = req.payload;
        const { productId } = req.body;
        const userWishlistDetail = await wishlistModel.findOne({ userId: userId });
        if (userWishlistDetail) {
            // console.log("padayapppaaaa", userCartDetail)
            const productExistInWishlist = userWishlistDetail.products.filter(
                (product) => {
                    return product.productId == productId;
                }
            );
            if (productExistInWishlist.length > 0) {
                res.status(501).json("Product already exist in wishlist");
            } else {
                const result = await wishlistModel.updateOne(
                    { userId: userId },
                    { $push: { products: { productId } } }
                );
                if (result.acknowledged === true) {
                    res
                        .status(200)
                        .json("New product is added to wishlist product array");
                }
            }
        } else {
            const newCartProduct = new wishlistModel({
                userId: userId,
                products: [
                    {
                        productId: productId,
                    },
                ],
            });
            await newCartProduct.save();
            res.status(200).json("neww product with new user added to wishlist");
        }
    },
    //user want wishlist product 

    userGetWishlistProductController:async(req,res)=>{







        const userId = req.payload;

        const wishlistProducts = await wishlistModel.aggregate([
            { $match: { userId: userId } },
            { $unwind: "$products" },
            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "products.productDetails",
                },
            },
            { $unwind: "$products.productDetails" }
          
            
        ]);
        if (wishlistProducts) {
         
          

            res.status(200).json(wishlistProducts);
        } else {
            res
                .status(401)
                .json("There is no Cart product So Plese add some PRoduct to cart");
        }

    },
    removeProductFromWishlistController:async(req,res)=>{

        const userId = req.payload;
        const { productId } = req.body;
        try {
            const result = await wishlistModel.findOneAndUpdate(
                { userId: userId },
                { $pull: { products: { productId: productId } } }
            );

            res.status(200).json(result);
        } catch (err) {
            res.status(401).json(err);
        }


    },

    placeOrderSubmitController:async(req,res)=>{
        const userId = req.payload;
        const {name,housename,state,district,phone,email,total}=req.body
        const userCartDetail=await cartModel.aggregate([{$match:{userId:userId}},{$unwind:"$products"},{$project:{_id:1,userId:1,"products.productId":1,"products.count":1}},{$group:{_id:{cartId:"$_id",userId:"$userId"},products:{$push:{productId:"$products.productId",count:"$products.count"}}}}])
        // 
        if(userCartDetail){
            console.log("hsbdhavfjhdvjfhvshdkvfhksd",userCartDetail)
            const userCartProductDetails=userCartDetail[0]?.products
            if(userCartProductDetails?.length>0){
                  const newOrderModel=new orderModel({
                    userId,name,housename,state,district,phone,email,total,date:Date.now(),products:userCartProductDetails
                })
                newOrderModel.save()
                await cartModel.findOneAndDelete({userId:userId})
                res.status(200).json("placed")

            }else{
                res.status(401).json("You did not have any cart product")
            }
          
        }else{
            res.status(401).json("You did not have any cart product")
        }

    },
    getAllOrderController:async(req,res)=>{
        console.log("userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")

        
        const userId = req.payload;
        const result=await orderModel.find({userId:userId})
        if(result.length>0){
            console.log(result)
            res.status(200).json(result)
        }else{
            res.status(401).json("You have no Orders")
        }

    
    },
    getAllTrendingProductController:async(req,res)=>{
        console.log()
        await trendingProductsModel.find().then((data)=>{
            res.status(200).json(data)
    }).catch((err)=>{
            res.status(401).json(err)
    })

    },


   


};
          
            

            


