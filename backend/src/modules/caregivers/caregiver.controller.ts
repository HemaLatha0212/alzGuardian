import { Response } from "express";
import { AuthenticatedRequest } from "../auth/auth.middleware";
import {
  linkCaregiverToPatient,
  getCaregiverPatients,
} from "./caregiver.service";

export const linkCaregiver = async (
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
        error: "Only caregivers can perform this action",
      });
    }

    const { patientId } = req.params;
    const { relationshipType } = req.body;

    const relationship = await linkCaregiverToPatient(
      patientId,
      req.user.userId,
      relationshipType
    );

    return res.status(201).json({
      relationship,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PATIENT_NOT_FOUND") {
        return res.status(404).json({
          error: "Patient not found",
        });
      }

      if (error.message === "CAREGIVER_NOT_FOUND") {
        return res.status(404).json({
          error: "Caregiver not found",
        });
      }

      if (error.message === "RELATIONSHIP_EXISTS") {
        return res.status(409).json({
          error: "Caregiver is already linked to this patient",
        });
      }
    }

    console.error(error);

    return res.status(500).json({
      error: "Unable to link caregiver",
    });
  }
};

export const getMyPatients = async (
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
        error: "Only caregivers can access this resource",
      });
    }

    const patients = await getCaregiverPatients(
      req.user.userId
    );

    return res.status(200).json({
      patients,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to fetch patients",
    });
  }
};