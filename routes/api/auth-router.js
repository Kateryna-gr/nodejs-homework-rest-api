import express from "express";

import authController from "../../controllers/auth-controller.js";

import { isEmptyBody, upload } from "../../middlewares/index.js";
import validateBody from "../../decorators/validateBody.js"
import { userAuthSchema, userUpdateSubscrSchema, userVerify } from "../../models/User.js"

import { checkToken } from "../../middlewares/index.js";

const router = express.Router();

router.post("/register", isEmptyBody, validateBody(userAuthSchema), authController.registerUser);

router.get("/verify/:verificationToken", authController.verifyEmail);

router.post("/verify", isEmptyBody, validateBody(userVerify), authController.resendVerify);

router.post("/login", isEmptyBody, validateBody(userAuthSchema), authController.loginUser);

router.post("/logout", checkToken, authController.logoutUser);

router.get("/current", checkToken, authController.currentUser);

router.patch("/:userId/subscription", checkToken, validateBody(userUpdateSubscrSchema), authController.updateSubscription);

router.patch("/avatars", checkToken, upload.single("avatar"), authController.updateAvatar);

export default router;
