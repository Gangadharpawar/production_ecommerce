import express from "express";

import {
  registerController,
  loginController,
  testConteroller,
  ForgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  orderCancel,
  orderDelete,
} from "../controllers/authController.js";
import { isAdmin, requiresSignIn } from "../middlewares/authMiddleware.js";
//router Object
const router = express.Router();

//routing
//Register || METHOD POST

router.post(`/register`, registerController);

//Login || POST
router.post(`/login`, loginController);

//Forgot Password ||POST
router.post(`/forgot-password`, ForgotPasswordController);

//test Routes
router.get(`/test`, requiresSignIn, isAdmin, testConteroller);

//Protected User Route auth

router.get(`/user-auth`, requiresSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//Protected Admin Route auth

router.get(`/admin-auth`, requiresSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//Update User Profile
router.put(`/profile`, requiresSignIn, updateProfileController);

//orders
router.get('/orders', requiresSignIn, getOrdersController);

// all orders
router.get('/all-orders', requiresSignIn, isAdmin, getAllOrdersController);

// Order status Update
router.put('/order-status/:orderId', requiresSignIn, isAdmin, orderStatusController);
//order cancel from user side 
router.put('/order-Cancel/:orderId', orderCancel);
//cancel order delete from user side 
router.delete('/order-delete/:orderId', orderDelete)
export default router;
