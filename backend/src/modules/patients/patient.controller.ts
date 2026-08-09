import { Response } from "express";
import {
  AuthenticatedRequest,
} from "../auth/auth.middleware";
import {
  createPatient,
  getPatientById,
} from "./patient.service";

export const createPatientProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {

     console.log("req.user:", req.user);   // 👈 Add here
    console.log("req.body:", req.body);   // 👈 Add here
    
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    if (req.user.role !== "patient") {
      return res.status(403).json({
        error: "Only patients can create a patient profile",
      });
    }

    const { dateOfBirth, emergencyNotes } = req.body;

    const patient = await createPatient(
      req.user.userId,
      dateOfBirth,
      emergencyNotes
    );

    return res.status(201).json({
      patient,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to create patient profile",
    });
  }
};

export const getPatient = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const patient = await getPatientById(req.params.patientId);

    if (!patient) {
      return res.status(404).json({
        error: "Patient not found",
      });
    }

    return res.status(200).json({
      patient,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to fetch patient",
    });
  }
};