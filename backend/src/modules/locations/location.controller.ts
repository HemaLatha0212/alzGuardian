import { Request, Response } from "express";
import {
  patientExists,
  patientBelongsToUser,
  createLocation,
} from "./location.service";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const createLocationController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    if (req.user.role !== "patient") {
      return res.status(403).json({
        error: "Only patients can submit their location",
      });
    }

    const { patientId } = req.params;

    const {
      latitude,
      longitude,
      accuracyMeters,
      recordedAt,
    } = req.body;

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
      accuracyMeters !== undefined &&
      accuracyMeters !== null &&
      (
        typeof accuracyMeters !== "number" ||
        accuracyMeters < 0
      )
    ) {
      return res.status(400).json({
        error: "Invalid accuracyMeters",
      });
    }

    if (!recordedAt) {
      return res.status(400).json({
        error: "recordedAt is required",
      });
    }

    const parsedRecordedAt = new Date(recordedAt);

    if (Number.isNaN(parsedRecordedAt.getTime())) {
      return res.status(400).json({
        error: "Invalid recordedAt timestamp",
      });
    }

    const exists = await patientExists(patientId);

    if (!exists) {
      return res.status(404).json({
        error: "Patient not found",
      });
    }

    const belongsToUser = await patientBelongsToUser(
      patientId,
      req.user.userId
    );

    if (!belongsToUser) {
      return res.status(403).json({
        error: "You are not authorized to submit location for this patient",
      });
    }

    const location = await createLocation(
      patientId,
      latitude,
      longitude,
      accuracyMeters ?? null,
      parsedRecordedAt.toISOString()
    );

    return res.status(201).json({
      location,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to record location",
    });
  }
};