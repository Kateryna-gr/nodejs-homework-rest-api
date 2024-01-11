import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";

import User from "../models/User.js";
import createError from "../helpers/createError.js";
import { controllerWrapper } from "../middlewares/index.js";

const avatarsPath = path.resolve("public", "avatars");

const { JWT_SECRET } = process.env;

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw createError(409, "Email in use");
  }

  // const { path: oldPath, filename } = req.file;
  // const newPath = path.join(avatarsPath, filename);
  // await fs.rename(oldPath, newPath);
  // const avatar = path.join("avatars", filename);

  const avatarsPath = gravatar.url(email);

  const hashPassword = await bcrypt.hash(password, 10);
  const result = await User.create({
    ...req.body,
    avatarsPath,
    password: hashPassword,
  });

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

const updateSubscription = async (req, res) => {
  const { userId: id } = req.params;
  const result = await User.findByIdAndUpdate(id, req.body);
  if (!result) {
    throw createError(404);
  }

  res.json({
    email: result.email,
    subscription: result.subscription,
  });
};

export default {
  registerUser: controllerWrapper(registerUser),
  loginUser: controllerWrapper(loginUser),
  logoutUser: controllerWrapper(logoutUser),
  currentUser: controllerWrapper(currentUser),
  updateSubscription: controllerWrapper(updateSubscription),
};
