import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, handleUpdate } from "./hooks.js";

const subscrList = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
      minlenth: 8,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscrList,
      default: "starter",
    },
    token: String,
    avatarURL: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },

  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findByIdAndUpdate", handleUpdate);
userSchema.post("findByIdAndUpdate", handleSaveError);

export const userAuthSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({ "any.required": "missing required 'email' field" }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({ "any.required": "missing required 'password' field" }),
});

export const userUpdateSubscrSchema = Joi.object({
  subscription: Joi.string().valid(...subscrList),
});

export const userVerify = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({ "any.required": "missing required field email" }),
});

const User = model("user", userSchema);

export default User;
