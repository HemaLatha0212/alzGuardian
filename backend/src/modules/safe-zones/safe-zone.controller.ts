import { Response } from "express";
import { AuthenticatedRequest } from "../auth/auth.middleware";
import {
  isCaregiverAuthorizedForPatient,
  patientExists,
  createSafeZone,
} from "./safe-zone.service";
import { getPatientSafeZones } from "./safe-zone.service";

export const createSafeZoneController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    if (req.user.role !== "caregiver") {
      return res.status(403).json({
        error: "Only caregivers can create safe zones",
      });
    }

    const { patientId } = req.params;

    const {
      name,
      latitude,
      longitude,
      radiusMeters,
    } = req.body;

    if (
      typeof name !== "string" ||
      name.trim().length === 0
    ) {
      return res.status(400).json({
        error: "Name is required",
      });
    }

    if (
      typeof latitude !== "number" ||
      latitude < -90 ||
      latitude > 90
    ) {
      return res.status(400).json({
        error: "Invalid latitude",
      });
    }

    if (
      typeof longitude !== "number" ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        error: "Invalid longitude",
      });
    }

    if (
      typeof radiusMeters !== "number" ||
      radiusMeters <= 0
    ) {
      return res.status(400).json({
        error: "Radius must be greater than 0",
      });
    }

    const exists = await patientExists(patientId);

    if (!exists) {
      return res.status(404).json({
        error: "Patient not found",
      });
    }

    const authorized =
      await isCaregiverAuthorizedForPatient(
        req.user.userId,
        patientId
      );

    if (!authorized) {
      return res.status(403).json({
        error: "You are not authorized to manage this patient",
      });
    }

    const safeZone = await createSafeZone(
      patientId,
      name.trim(),
      latitude,
      longitude,
      radiusMeters
    );

    return res.status(201).json({
      safeZone,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to create safe zone",
    });
  }
};

export const getPatientSafeZonesController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    if (req.user.role !== "caregiver") {
      return res.status(403).json({
        error: "Only caregivers can view safe zones",
      });
    }

    const { patientId } = req.params;

    const exists = await patientExists(patientId);

    if (!exists) {
      return res.status(404).json({
        error: "Patient not found",
      });
    }

    const authorized = await isCaregiverAuthorizedForPatient(
      req.user.userId,
      patientId
    );

    if (!authorized) {
      return res.status(403).json({
        error: "You are not authorized to view this patient",
      });
    }

    const safeZones = await getPatientSafeZones(patientId);

    return res.status(200).json({
      safeZones,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to retrieve safe zones",
    });
  }
};