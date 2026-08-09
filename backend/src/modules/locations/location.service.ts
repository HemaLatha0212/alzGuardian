import { pool } from "../../config/database";

export const patientExists = async (patientId: string) => {
  const result = await pool.query(
    `SELECT id FROM patients WHERE id = $1`,
    [patientId]
  );

  return result.rowCount !== 0;
};

export const patientBelongsToUser = async (
  patientId: string,
  userId: string
) => {
  const result = await pool.query(
    `
    SELECT id
    FROM patients
    WHERE id = $1
      AND user_id = $2
    `,
    [patientId, userId]
  );

  return result.rowCount !== 0;
};

export const createLocation = async (
  patientId: string,
  latitude: number,
  longitude: number,
  accuracyMeters: number | null,
  recordedAt: string
) => {
  const result = await pool.query(
    `
    INSERT INTO locations (
      patient_id,
      location,
      accuracy_meters,
      recorded_at
    )
    VALUES (
      $1,
      ST_SetSRID(
        ST_MakePoint($2, $3),
        4326
      )::geography,
      $4,
      $5
    )
    RETURNING
      id,
      patient_id,
      ST_Y(location::geometry) AS latitude,
      ST_X(location::geometry) AS longitude,
      accuracy_meters,
      recorded_at,
      created_at
    `,
    [
      patientId,
      longitude,
      latitude,
      accuracyMeters,
      recordedAt,
    ]
  );

  return result.rows[0];
};