import { Router } from "express";
import { createLocationController } from "./location.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

router.post(
  "/patients/:patientId/locations",
  authenticate,
  createLocationController
);

export default router;