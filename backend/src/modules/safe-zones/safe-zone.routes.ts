import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import { createSafeZoneController } from "./safe-zone.controller";
import {
  createSafeZoneController,
  getPatientSafeZonesController,
  updateSafeZoneController,
  deleteSafeZoneController,
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

router.patch(
  "/safe-zones/:safeZoneId",
  authenticate,
  updateSafeZoneController
);

router.delete(
  "/safe-zones/:safeZoneId",
  authenticate,
  deleteSafeZoneController
);

export default router;