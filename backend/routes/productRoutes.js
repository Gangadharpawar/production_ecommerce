import express from "express";
import { isAdmin, requiresSignIn } from "./../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  productPhotoController,
  singleProductController,
  updateProductController,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  proudctCategoryController,
  barintreeTokenController,
  braintreePaymentController,
} from "../controllers/productController.js";
import formidable from "express-formidable";
const router = express.Router();

//routes
router.post(
  "/create-product",
  requiresSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//Get Products

router.get("/get-product", getProductController);

//Get Single Product
router.get("/get-product/:slug", singleProductController);

//Get Photo
router.get("/product-photo/:pid", productPhotoController);

//Delete Proudct
router.delete("/delete-product/:pid", deleteProductController);

//Update Product
router.put(
  "/update-product/:pid",
  requiresSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//Filter Products
router.post("/product-filters", productFiltersController);

//Product Count
router.get("/product-count", productCountController);

//product per page 
router.get("/product-list/:page", productListController);

//search Product
router.get('/search/:keyword', searchProductController);

//similar Product 
router.get('/related-product/:pid/:cid', relatedProductController);

//category wise Producct
router.get('/product-category/:slug', proudctCategoryController);

//payments Route
//token
router.get('/braintree/token', barintreeTokenController)
//payements
router.post('/braintree/payment', requiresSignIn, braintreePaymentController)
export default router;
