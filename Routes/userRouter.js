const express = require("express");
const router = new express.Router();
const userJwtVerification = require("../middleware/userJsonMiddleWare");
const {
    userSignUpController,
    nodeMailerPastedTokenController,
    userLoginController,
    userGetAllProductController,
    userGetCategoryProductController,
    userAddProductToCart,
    userGetCartProductController,
    removeProductFromCartController,
    increDecreCartProductQuantity,
    userAddProductToWishlist,
    userGetWishlistProductController,
    removeProductFromWishlistController,
    placeOrderSubmitController,
    getAllOrderController,
    getAllTrendingProductController,
    
} = require("../Controller/userController");

//user signup and add to database
router.post("/signin", userSignUpController);

//user login and server gives a jwt token to user
router.post("/login", userLoginController);

//user want all product from data base
router.get("/getproduct", userGetAllProductController);

//user want product by catogory
router.post("/getproductcategory", userGetCategoryProductController);

//addToCart a product from user
router.patch("/addtocart", userJwtVerification, userAddProductToCart);

//get product from cart

router.get(
    "/getcartproduct",
    userJwtVerification,
    userGetCartProductController
);

//remove product from cart

router.patch(
    "/removeproductfromcart",
    userJwtVerification,
    removeProductFromCartController
);

//increment or decrement the product quantity in cart

router.patch(
    "/incredecrecartquantity",
    userJwtVerification,
    increDecreCartProductQuantity
);

// addTo Wishlist a product from user
router.patch("/addtowishlist", userJwtVerification, userAddProductToWishlist);


router.get(
    "/getwishlistproduct",
    userJwtVerification,
    userGetWishlistProductController
);


router.patch(
    "/removeproductfromwishlist",
    userJwtVerification,
    removeProductFromWishlistController
);

router.patch(
    "/placeordersubmit",
    userJwtVerification,
    placeOrderSubmitController
)


router.get(
    "/getallorder",
    userJwtVerification,
    getAllOrderController
)

router.get("/gettrendingproduct", getAllTrendingProductController);


router.post("/nodemailerpatsedtoken",nodeMailerPastedTokenController)



module.exports = router;
