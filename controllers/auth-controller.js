import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import createError from "../helpers/createError.js";
import { controllerWrapper } from "../middlewares/index.js";

const { JWT_SECRET } = process.env;

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw createError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const result = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const result = await User.findOne({ email });
  if (!result) {
    throw createError(401, "Email or password is wrong");
  }
  const comparePassword = await bcrypt.compare(password, result.password);
  if (!comparePassword) {
    throw createError(401, "Email or password is wrong");
  }

  const { _id: id } = result;
  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET);
  await User.findByIdAndUpdate(id, { token });

  res.json({
    token,
    user: {
      email,
      subscription: result.subscription,
    },
  });
};

const logoutUser = async (req, res) => {
  const { _id: id } = req.user;
  await User.findByIdAndUpdate(id, { token: "" });

  res.status(204).json();
};

const currentUser = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

export default {
  registerUser: controllerWrapper(registerUser),
  loginUser: controllerWrapper(loginUser),
  logoutUser: controllerWrapper(logoutUser),
  currentUser: controllerWrapper(currentUser),
};
