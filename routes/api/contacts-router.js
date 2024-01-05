import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import { isEmptyBody, isValidateBodyPost, isValidateBodyPut, isValidateBodyPatch, isValidId } from "../../middlewares/index.js";

const router = express.Router();

router.get("/", contactsController.getAll);

router.get("/:contactId", isValidId, contactsController.getById);

router.post("/", isEmptyBody, isValidateBodyPost, contactsController.addNew);

router.delete("/:contactId", isValidId, contactsController.removeById);

router.put("/:contactId", isValidId, isEmptyBody, isValidateBodyPut, contactsController.updateById);

router.patch("/:contactId/favorite", isValidateBodyPatch, contactsController.updateStatusContact)

export default router;
