require("mongoose")
const jwt = require("jsonwebtoken")
const userLoginModel = require("../DB/Models/userLoginSchema")
const productsModel = require("../DB/Models/productSchema")
const cartModel = require("../DB/Models/cartSchema")

module.exports = {

    userSignUpController: async (req, res) => {
        const { username, email, password } = req.body
        const isSignUpExist = await userLoginModel.findOne({ email })
        if (isSignUpExist) {
            res.status(501).json("This user is already exist")
        } else {
            const newUserSignUp = new userLoginModel({
                username: username,
                email: email,
                password: password
            })
            await newUserSignUp.save().then((data) => {
                res.status(200).json(data)
            }).catch((err) => {
                res.status(401).json(err)
            })
        }
    },

    // res.status(200).json(isUserLoginExist)
    userLoginController: async (req, res) => {
        const { email, password } = req.body
        console.log(req.body)
        await userLoginModel.findOne({ email }).then((result) => {
            if (result) {
                console.log("after userrrrrrrrrrrr checking from database", result)
                const { username, email, status } = result

                if (status) {
                    console.log("user is blocked")
                    res.status(401).json("User is blocked By Admin")
                } else {

                    const usertoken = jwt.sign({ userId: result?._id, username: result?.username }, "userapplestoreserver")
                    console.log("created tokennnnnnvnnnnrrrrrrrrrrrrr", usertoken)
                    res.status(200).json({ usertoken, username })
                }

            } else {
                res.status(501).json("sorry user does not exist")
            }
        }).catch((err) => {
            res.status(401).json(err)
        })
    },
    userGetAllProductController: async (req, res) => {
        await productsModel.find().then((data) => {
            res.status(200).json(data)
        }).catch((err) => {
            res.status(401).json(err)
        })
    },


    //get product by category
    userGetCategoryProductController: async (req, res) => {


        const { filterKey } = req.body
        await productsModel.find({ category: filterKey }).then((data) => {
            res.status(200).json(data)
        }).catch((err) => {
            res.status(401).json(err)
        })
    },


    //add to cart 
    userAddProductToCart: async (req, res) => {
        const userId = req.payload
        const { productId } = req.body
        const userCartDetail = await cartModel.findOne({ userId: userId })
        if (userCartDetail) {
            console.log("padayapppaaaa", userCartDetail)
            const productExistInCart = userCartDetail.products.filter((product) => {
                return product.productId == productId
            })

            if (productExistInCart.length > 0) {

                console.log("sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss", productExistInCart)
                const result = await cartModel.updateOne({ "products.productId": productId }, { $inc: { "products.$.count": 1 } })
                if (result.acknowledged === true) {
                    res.status(200).json("Product Count increment by 1")
                }
            } else {

                const result = await cartModel.updateOne({ userId: userId }, { $push: { products: { productId, count: 1 } } })
                if (result.acknowledged === true) {
                    res.status(200).json("New product is added to product array")
                }
            }

        } else {

            const newCartProduct = new cartModel({
                userId: userId,
                products: [
                    {
                        productId: productId,
                        count: 1
                    }
                ]
            })

            await newCartProduct.save()
            res.status(200).json("neww product with new user added to cart")

        }

    },

    // add to wishlist


    userGetCartProductController: async (req, res) => {
        const userId = req.payload

        const cartProduct = await cartModel.findOne({userId:userId}).populate("products.productId")
        if (cartProduct) {
            res.status(200).json(cartProduct)
        } else {
            res.status(401).json("There is no Cart product So Plese add some PRoduct to cart")
        }


    },

    userAddProductToWishlist: async (req, res) => {


    }



}





