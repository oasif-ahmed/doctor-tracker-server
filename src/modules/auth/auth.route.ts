import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/auth/login", authController.loginUser);
router.post("/auth/refresh-token", authController.refreshAccessToken);

export const authRoute = router;