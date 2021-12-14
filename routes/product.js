const express = require("express");
const router = express.Router();

const { getProductById, createProduct, getProduct, photo, updateProduct, deleteProduct, getAllProducts } = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/authenticate");
const { getUserById } = require("../controllers/user");

//params
router.param("userId",getUserById);
router.param("productId",getProductById);

//Route
//create a product
router.post("/product/create/:userId",isSignedIn, isAuthenticated, isAdmin, createProduct);

//read product/s
router.get("/product/:productId",getProduct);
router.get("/product/photo/:productId",photo);

//update a product
router.put("/product/:productId/:userId",isSignedIn, isAuthenticated, isAdmin, updateProduct);

//delete a product
router.delete("/product/:productId/:userId",isSignedIn, isAuthenticated, isAdmin, deleteProduct);

//listing route [to list 8 products only]
router.get("/products",getAllProducts);

module.exports = router;