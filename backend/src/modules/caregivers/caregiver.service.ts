import { pool } from "../../config/database";

export const linkCaregiverToPatient = async (
  patientId: string,
  caregiverId: string,
  relationshipType?: string
) => {
  // Verify patient exists
  const patient = await pool.query(
    `
    SELECT id
    FROM patients
    WHERE id = $1
    `,
    [patientId]
  );

  if (patient.rows.length === 0) {
    throw new Error("PATIENT_NOT_FOUND");
  }

  // Verify caregiver exists and has caregiver role
  const caregiver = await pool.query(
    `
    SELECT id
    FROM users
    WHERE id = $1
      AND role = 'caregiver'
    `,
    [caregiverId]
  );

  if (caregiver.rows.length === 0) {
    throw new Error("CAREGIVER_NOT_FOUND");
  }

  const existing = await pool.query(
    `
    SELECT 1
    FROM patient_caregiver
    WHERE patient_id = $1
      AND caregiver_id = $2
    `,
    [patientId, caregiverId]
  );

  if (existing.rows.length > 0) {
    throw new Error("RELATIONSHIP_EXISTS");
  }

  const result = await pool.query(
    `
    INSERT INTO patient_caregiver (
      patient_id,
      caregiver_id,
      relationship_type
    )
    VALUES ($1, $2, $3)
    RETURNING patient_id, caregiver_id, relationship_type, created_at
    `,
    [patientId, caregiverId, relationshipType || null]
  );

  return result.rows[0];
};

export const getCaregiverPatients = async (
  caregiverId: string
) => {
  const result = await pool.query(
    `
    SELECT
      p.id AS patient_id,
      u.id AS user_id,
      u.name,
      u.email,
      p.date_of_birth,
      pc.relationship_type,
      pc.created_at AS linked_at
    FROM patient_caregiver pc
    JOIN patients p
      ON p.id = pc.patient_id
    JOIN users u
      ON u.id = p.user_id
    WHERE pc.caregiver_id = $1
    ORDER BY pc.created_at DESC
    `,
    [caregiverId]
  );

  return result.rows;
};