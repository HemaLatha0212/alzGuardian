import { pool } from "../../config/database";

export const createPatient = async (
  userId: string,
  dateOfBirth?: string,
  emergencyNotes?: string
) => {

  console.log("Creating patient with:", { userId, dateOfBirth, emergencyNotes }); // 👈 Add here
  
  const result = await pool.query(
    `
    INSERT INTO patients (
      user_id,
      date_of_birth,
      emergency_notes
    )
    VALUES ($1, $2, $3)
    RETURNING id, user_id, date_of_birth, emergency_notes, created_at
    `,
    [userId, dateOfBirth || null, emergencyNotes || null]
  );

  return result.rows[0];
};

export const getPatientById = async (patientId: string) => {
  const result = await pool.query(
    `
    SELECT
      p.id,
      p.user_id,
      u.name,
      u.email,
      p.date_of_birth,
      p.emergency_notes,
      p.created_at
    FROM patients p
    JOIN users u ON u.id = p.user_id
    WHERE p.id = $1
    `,
    [patientId]
  );

  return result.rows[0];
};