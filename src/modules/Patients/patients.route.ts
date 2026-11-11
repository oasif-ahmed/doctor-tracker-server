import { Router } from "express";
import { patientController } from "./patients.controller";
// import auth from "../../middlewares/auth";

const router = Router();

// Create patient
router.post("/patient", patientController.createPatient);

// Get all patients
router.get("/patient", patientController.getAllPatients);

// Get patients by doctor ID
router.get("/doctor/:doctorId", patientController.getPatientsByDoctor);

// Update patient
router.patch("/:id", patientController.updatePatient);

// Delete patient
router.delete("/:id", patientController.deletePatient);

export const patientRoute = router;