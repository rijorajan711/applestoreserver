const express = require("express");
const router = new express.Router();
const jwtVerification = require("../middleware/jsonMiddleWare.js");
const {
  isAdminLoginExist,
  addProductController,
  getAllproductController,
  deleteProductController,
  getAllUserController,
  deleteUserController,
  blockAndUnblockUserController,
  editProductController,
  addTrendingProductController,
  getAllTrendingProductController,
  deleteTrendingProductController,
  editTrendingProductController
} = require("../Controller/adminController.js");
const multerConfig = require("../middleware/multerMiddleWare.js");
//admin login verification
router.post("/login", isAdminLoginExist);
//admin add product
router.post(
  "/addproduct",
  jwtVerification,
  multerConfig.array("uploadimages", 4),
  addProductController
);

//admin want all data from database

router.get("/getproduct", getAllproductController);

//admin want to delete a product from database

router.delete("/deleteproduct", jwtVerification, deleteProductController);

//admin want to dispaly all user in AdminViewUsers component

router.get("/getallusers", jwtVerification, getAllUserController);

//admin want to delete a user

router.delete("/userdelete", jwtVerification, deleteUserController);

// admin want block or unblock user

router.patch(
  "/blockandunblockuser",
  jwtVerification,
  blockAndUnblockUserController
);

//admin want to update the product

router.put(
  "/adminProductUpdationSubmit",
  jwtVerification,
  multerConfig.array("uploadimages", 4),
  editProductController
);

router.post(
  "/addtrndingproduct",
  jwtVerification,
  multerConfig.array("uploadimages", 4),
  addTrendingProductController
);

router.get("/gettrendingproduct", getAllTrendingProductController);

router.delete(
  "/deletetrendingproduct",
  jwtVerification,
  deleteTrendingProductController
);


router.put(
  "/admintrendingproductupdationsubmit",
  jwtVerification,
  multerConfig.array("uploadimages", 4),
  editTrendingProductController
);

module.exports = router;
