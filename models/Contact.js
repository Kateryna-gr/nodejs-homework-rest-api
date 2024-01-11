import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, handleUpdate } from "../models/hooks.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", handleUpdate);
contactSchema.post("findOneAndUpdate", handleSaveError);

export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "missing required 'name' field",
  }),
  email: Joi.string().email().messages({
    "any.required": "missing required 'email' field",
  }),
  phone: Joi.string().required().messages({
    "any.required": "missing required 'phone' field",
  }),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
});

export const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "missing field 'favorite'",
  }),
});

const Contact = model("contact", contactSchema);

export default Contact;
