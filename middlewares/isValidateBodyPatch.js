import { contactUpdateFavoriteSchema } from "../models/Contact.js";

export const isValidateBodyPatch = (req, res, next) => {
  const { error } = contactUpdateFavoriteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};
