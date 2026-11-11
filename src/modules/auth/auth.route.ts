import { Router } from "express";
import { auth } from "../../middleware/auth";
import { authController } from "./auth.controller";

const router = Router();

router.get("/auth/me", auth(), authController.getMe);
router.post("/auth/refresh-token", authController.refreshAccessToken);

export const authRoute = router;