import jwt from "jsonwebtoken";

export const tokenGenerator = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1m",
  });

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};
