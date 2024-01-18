import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import gravatar from "gravatar";

import User from "../models/User.js";
import createError from "../helpers/createError.js";
import { controllerWrapper } from "../middlewares/index.js";
import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;

const avatarPath = path.join("public", "avatars");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw createError(409, "Email in use");
  }

  const avatar = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const result = await User.create({
    ...req.body,
    avatarURL: avatar,
    password: hashPassword,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verification email",
    html: `<p>Click to <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">verify your email</a></p>`,
  };
  await sendEmail(verifyEmail);

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
  if (result.verificationToken) {
    throw createError(401, "Not verified email");
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

const updateAvatar = async (req, res) => {
  const { path: tempPath, filename } = req.file;

  Jimp.read(tempPath)
    .then((img) => {
      return img
        .cover(250, 250)
        .write(path.join(avatarPath, `resize_${filename}`));
    })
    .catch((error) => {
      return error;
    });
  await fs.unlink(tempPath);
  const avatar = path.join("avatars", `resize_${filename}`);

  const { _id: id } = req.user;
  const result = await User.findByIdAndUpdate(id, { avatarURL: avatar });
  if (!result) {
    throw createError(404);
  }

  res.json({
    email: req.user.email,
    avatarURL: avatar,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const result = await User.findOne({ verificationToken });
  if (!result) {
    throw createError(400, "Email not found or verified");
  }

  await User.findByIdAndUpdate(result._id, {
    verificationToken: null,
    verify: true,
  });

  res.json({ message: "Verification successful" });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const result = await User.findOne({ email });
  if (!result) {
    throw createError(404, "User not found");
  }

  if (result.verify) {
    throw createError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Resend verification email",
    html: `<p>Click to <a target="_blank" href="${BASE_URL}/api/users/verify/${result.verificationToken}">verify your email</a></p>`,
  };
  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent" });
};

export default {
  registerUser: controllerWrapper(registerUser),
  loginUser: controllerWrapper(loginUser),
  logoutUser: controllerWrapper(logoutUser),
  currentUser: controllerWrapper(currentUser),
  updateSubscription: controllerWrapper(updateSubscription),
  updateAvatar: controllerWrapper(updateAvatar),
  verifyEmail: controllerWrapper(verifyEmail),
  resendVerify: controllerWrapper(resendVerify),
};
