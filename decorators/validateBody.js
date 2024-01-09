import createError from "../helpers/createError.js";

const validateBody = (schema) => {
  const isValidateBody = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      console.log(error.message);
      
      throw createError(400, error.message);
    }
    next();
  };
  return isValidateBody;
};

export default validateBody;
