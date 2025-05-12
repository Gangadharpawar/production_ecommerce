import express from "express";
import { isAdmin, requiresSignIn } from "./../middlewares/authMiddleware.js";
import {
  categoryController,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";
const router = express.Router();
const app = express();
app.use(express.json());
//routes
// create category
router.post(
  "/create-category",
  requiresSignIn,
  isAdmin,
  createCategoryController
);
//update category
router.put(
  "/update-category/:id",
  requiresSignIn,
  isAdmin,
  updateCategoryController
);
//Get All Categories
router.get("/get-category", categoryController);
//Get Single Category
router.get("/single-category/:slug", singleCategoryController);
//Delete Single Category
router.delete(
  "/delete-category/:id",
  requiresSignIn,
  isAdmin,
  deleteCategoryController
);
export default router;
