import { pool } from "../../config/database";

export const isCaregiverAuthorizedForPatient = async (
  caregiverId: string,
  patientId: string
) => {
  const result = await pool.query(
    `
    SELECT 1
    FROM patient_caregiver
    WHERE caregiver_id = $1
      AND patient_id = $2
    `,
    [caregiverId, patientId]
  );

  return result.rows.length > 0;
};

export const patientExists = async (patientId: string) => {
  const result = await pool.query(
    `
    SELECT 1
    FROM patients
    WHERE id = $1
    `,
    [patientId]
  );

  return result.rows.length > 0;
};

export const createSafeZone = async (
  patientId: string,
  name: string,
  latitude: number,
  longitude: number,
  radiusMeters: number
) => {
  const result = await pool.query(
    `
    INSERT INTO safe_zones (
      patient_id,
      name,
      center,
      radius_meters
    )
    VALUES (
      $1,
      $2,
      ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography,
      $5
    )
    RETURNING
      id,
      patient_id,
      name,
      ST_Y(center::geometry) AS latitude,
      ST_X(center::geometry) AS longitude,
      radius_meters,
      is_active,
      created_at,
      updated_at
    `,
    [
      patientId,
      name,
      longitude,
      latitude,
      radiusMeters,
    ]
  );

  return result.rows[0];
};

export const getPatientSafeZones = async (patientId: string) => {
  const result = await pool.query(
    `
    SELECT
      id,
      patient_id,
      name,
      ST_Y(center::geometry) AS latitude,
      ST_X(center::geometry) AS longitude,
      radius_meters,
      is_active,
      created_at,
      updated_at
    FROM safe_zones
    WHERE patient_id = $1
      AND is_active = true
    ORDER BY created_at DESC
    `,
    [patientId]
  );

  return result.rows;
};