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
  }, { versionKey: false, timestamps: true });

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", handleUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

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

const User = model("user", userSchema);

export default User;
