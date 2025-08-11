import bcrypt from "bcrypt";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import User from "../model/user.model.js";
import httpStatusText from "../utils/httpStatusText.js";
import appError from "../utils/appError.js";
import { tokenGenerator } from "../utils/generateToken.js";

export const register = asyncWrapper(async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;

  const userMatch = await User.find({ email: email });

  if (userMatch.length > 0) {
    const error = appError.create(
      "This email is already registered",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  if (password !== confirmPassword) {
    const error = appError.create(
      "Passwords must match",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const passwardHashed = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: passwardHashed,
    role,
  });

  const token = tokenGenerator({
    id: userMatch.id,
    email: userMatch.email,
    role: newUser.role,
  });

  newUser.token = token;

  await newUser.save();

  res.status(201).json({ status: httpStatusText.SUCCESS, data: { newUser } });
});

export const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      appError.create(
        "Email and password are required",
        400,
        httpStatusText.FAIL
      )
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(appError.create("User not found", 404, httpStatusText.FAIL));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(appError.create("Invalid password", 401, httpStatusText.FAIL));
  }

  const payload = { id: user._id, email: user.email, role: user.role };
  const { accessToken, refreshToken } = tokenGenerator(payload);

  user.refreshToken = refreshToken;
  await user.save();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Login successful",
    accessToken,
    refreshToken,
  });
});
