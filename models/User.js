import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, handleUpdate } from "./hooks.js";

const userSchema = new Schema({
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
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

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

const User = model("user", userSchema);

export default User;
