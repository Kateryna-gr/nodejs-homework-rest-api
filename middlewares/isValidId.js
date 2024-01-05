import { isValidObjectId } from "mongoose";

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    const error = new Error(`${contactId} not valid id`);
    error.status = 404;
    return next(error);
  }
  next();
};
