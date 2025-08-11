import mongoose from "mongoose";
import validator from "validator";
import { userRoles } from "../utils/userRoles.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "field must be a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: [userRoles.ADMIN, userRoles.USER, userRoles.MANAGER],
    default: userRoles.USER,
  },
  accessToken: String,
  refreshToken: String,
});

const User = mongoose.model("User", userSchema);

export default User;
