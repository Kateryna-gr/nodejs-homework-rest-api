import Contact from "../models/Contact.js";
import createError from "../helpers/createError.js";
import { controllerWrapper } from "../middlewares/index.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;

  const { page = 1, limit = 5, favorite } = req.query;
  const skip = (page - 1) * limit;

  const result = favorite
    ? await Contact.find({ owner, favorite }, "name phone").populate("owner", "email")
    : await Contact.find({ owner }, "", { skip, limit });
  res.json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOne({ _id: contactId, owner }, "name phone");
  if (!result) {
    throw createError(404);
  }
  res.json(result);
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndDelete({ _id: contactId, owner });
  if (!result) {
    throw createError(404);
  }
  res.json({
    message: "contact deleted",
  });
};

const addNew = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });

  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    req.body
  );
  if (!result) {
    throw createError(404);
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    req.body
  );
  if (!result) {
    throw createError(404);
  }
  res.json(result);
};

export default {
  getAll: controllerWrapper(getAll),
  getById: controllerWrapper(getById),
  removeById: controllerWrapper(removeById),
  addNew: controllerWrapper(addNew),
  updateById: controllerWrapper(updateById),
  updateStatusContact: controllerWrapper(updateStatusContact),
};
