import express from "express";

import authController from "../../controllers/auth-controller.js";

import { isEmptyBody } from "../../middlewares/index.js";
import validateBody from "../../decorators/validateBody.js"
import { userAuthSchema } from "../../models/User.js"

const router = express.Router();

router.post("/register", isEmptyBody, validateBody(userAuthSchema), authController.registerUser);

router.post("/login", isEmptyBody, validateBody(userAuthSchema), authController.loginUser);

// router.post("/logout", authController.logoutUser);

// router.get("/current", authController.currentUser);

export default router;
