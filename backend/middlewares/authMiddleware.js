import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected Routes token base

export const requiresSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin access

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    // console.log("user:::", user);
    if (user.role !== 1) {
      console.log(user.role);
      return res.status(401).json({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
      // return res.status(404).json({
      //   success: true,
      //   message: "Admin Access Done",
      // });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      error,
      message: "Error in Admin Middleware",
    });
  }
};