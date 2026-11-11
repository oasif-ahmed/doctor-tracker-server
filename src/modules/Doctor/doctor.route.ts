
import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/doctors", doctorController.createDoctor);
router.get("/getAllDoctors", doctorController.getAllDoctors);

export const doctorRoute = router;
