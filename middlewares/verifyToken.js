import jwt from "jsonwebtoken";
import appError from "../utils/appError.js";
import httpStatusText from "../utils/httpStatusText.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(appError.create("Token is missing", 401, httpStatusText.FAIL));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = decoded;
    next();
  } catch (err) {
    return next(
      appError.create("Token is invalid or expired", 403, httpStatusText.FAIL)
    );
  }
};
