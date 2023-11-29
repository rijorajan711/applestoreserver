const express=require("express")
const router=new express.Router()
const userJwtVerification =require("../middleware/userJsonMiddleWare")
const {userSignUpController,userLoginController,userGetAllProductController,userGetCategoryProductController,userAddProductToCart,userAddProductToWishlist,userGetCartProductController} =require("../Controller/userController")


//user signup and add to database
router.post("/signin",userSignUpController)

//user login and server gives a jwt token to user
router.post("/login",userLoginController)

//user want all product from data base
router.get("/getproduct",userGetAllProductController)

//user want product by catogory
router.post("/getproductcategory",userGetCategoryProductController)

//addToCart a product from user
router.patch("/addtocart",userJwtVerification,userAddProductToCart)

//get product from cart

router.get("/getcartproduct",userJwtVerification,userGetCartProductController)

//addTo Wishlist a product from user
router.patch("addtowhislist",userJwtVerification,userAddProductToWishlist)


module.exports=router