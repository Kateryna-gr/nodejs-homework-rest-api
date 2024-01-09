import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import { checkToken, isEmptyBody, isValidId } from "../../middlewares/index.js";
import validateBody from "../../decorators/validateBody.js"
import { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema } from "../../models/Contact.js"

const router = express.Router();

router.use(checkToken);

router.get("/", contactsController.getAll);

router.get("/:contactId", isValidId, contactsController.getById);

router.post("/", isEmptyBody, validateBody(contactAddSchema), contactsController.addNew);

router.delete("/:contactId", isValidId, contactsController.removeById);

router.put("/:contactId", isValidId, isEmptyBody, validateBody(contactUpdateSchema), contactsController.updateById);

router.patch("/:contactId/favorite", validateBody(contactUpdateFavoriteSchema), contactsController.updateStatusContact)

export default router;
