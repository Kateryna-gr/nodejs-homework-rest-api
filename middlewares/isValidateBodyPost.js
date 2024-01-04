import { contactAddSchema } from "../models/Contact.js";

export const isValidateBodyPost = (req, res, next) => {
  const { error } = contactAddSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};
