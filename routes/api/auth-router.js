import express from "express";

import authController from "../../controllers/auth-controller.js";

import { isEmptyBody } from "../../middlewares/index.js";
import validateBody from "../../decorators/validateBody.js"
import { userAuthSchema } from "../../models/User.js"

import { checkToken } from "../../middlewares/index.js";

const router = express.Router();

router.post("/register", isEmptyBody, validateBody(userAuthSchema), authController.registerUser);

router.post("/login", isEmptyBody, validateBody(userAuthSchema), authController.loginUser);

router.post("/logout", checkToken, authController.logoutUser);

router.get("/current", checkToken, authController.currentUser);

export default router;
