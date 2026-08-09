import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import {
  linkCaregiver,
  getMyPatients,
} from "./caregiver.controller";

const router = Router();

router.post(
  "/patients/:patientId",
  authenticate,
  linkCaregiver
);

router.get(
  "/me/patients",
  authenticate,
  getMyPatients
);

export default router;