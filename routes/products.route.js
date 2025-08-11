import {
  getAllProducts,
  getSingleProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";

import express from "express";
import { validationSchema } from "../middlewares/validationSchema.js";
import upload from "../middlewares/uploadProductImg.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { allowedTo } from "../middlewares/allowedTo.js";
import { userRoles } from "../utils/userRoles.js";

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(verifyToken, upload.single("image"), validationSchema(), addNewProduct);
router
  .route("/:productId")
  .get(getSingleProduct)
  .patch(verifyToken, updateProduct)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    deleteProduct
  );

const productRouter = router;

export default productRouter;
