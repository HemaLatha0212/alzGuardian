import { Router } from "express";
import {
  createPatientProfile,
  getPatient,
} from "./patient.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  createPatientProfile
);

router.get(
  "/:patientId",
  authenticate,
  getPatient
);

export default router;