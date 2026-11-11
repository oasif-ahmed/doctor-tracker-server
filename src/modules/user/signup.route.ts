import { Router } from "express";
import { userController } from "./signup.controller";

const router = Router();

router.post("/user/signup", userController.signupUser);


export const signUpRoute = router;