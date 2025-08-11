import express from "express";
import { getAllUsers } from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.route("/").get(verifyToken, getAllUsers);

const usersRouter = router;

export default usersRouter;
