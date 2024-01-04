import Contact from "../models/Contact.js";

import { controllerWrapper } from "../middlewares/index.js";

const getAll = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(result);
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({
    message: "contact deleted",
  });
};

const addNew = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body);
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(result);
};

export default {
  getAll: controllerWrapper(getAll),
  getById: controllerWrapper(getById),
  removeById: controllerWrapper(removeById),
  addNew: controllerWrapper(addNew),
  updateById: controllerWrapper(updateById),
};
