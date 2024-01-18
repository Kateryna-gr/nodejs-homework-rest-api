import createError from "../helpers/createError.js";

const validateBody = (schema) => {
  const isValidateBody = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw createError(400, error.message);
    }
    next();
  };
  return isValidateBody;
};

export default validateBody;
