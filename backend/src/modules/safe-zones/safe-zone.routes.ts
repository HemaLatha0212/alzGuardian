import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import { createSafeZoneController } from "./safe-zone.controller";
import {
  createSafeZoneController,
  getPatientSafeZonesController,
} from "./safe-zone.controller";

const router = Router();

router.post(
  "/patients/:patientId/safe-zones",
  authenticate,
  createSafeZoneController
);

router.get(
  "/patients/:patientId/safe-zones",
  authenticate,
  getPatientSafeZonesController
);

export default router;