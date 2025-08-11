import appError from "../utils/appError.js";

export const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      const error = appError.create("This role is not authorized", 401);
      return next(error);
    }
    next();
  };
};
