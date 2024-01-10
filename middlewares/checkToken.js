import jwt from "jsonwebtoken";

import createError from "../helpers/createError.js";

import User from "../models/User.js";

const { JWT_SECRET } = process.env;

export const checkToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(createError(401));
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(createError(401));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const result = await User.findById(id);
    if (!result || !result.token || token !== result.token) {
      return next(createError(401));
    }
    req.user = result;
    next();
  } catch (error) {
    next(createError(401));
  }
  next();
};
