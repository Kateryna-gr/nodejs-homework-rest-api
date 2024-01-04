import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError } from "../models/hooks.js";

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
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);

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

const Contact = model("contact", contactSchema);

export default Contact;
