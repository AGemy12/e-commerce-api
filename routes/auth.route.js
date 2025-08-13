import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import upload from "../middlewares/uploadProductImg.js";

const router = express.Router();

router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(login);

const authRouter = router;

export default authRouter;
