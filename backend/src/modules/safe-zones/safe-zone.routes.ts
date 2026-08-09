import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import { createSafeZoneController } from "./safe-zone.controller";

const router = Router();

router.post(
  "/patients/:patientId/safe-zones",
  authenticate,
  createSafeZoneController
);

export default router;