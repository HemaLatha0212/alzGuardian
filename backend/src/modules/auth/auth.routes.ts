import { Router } from "express";
import {
  register,
  login,
} from "./auth.controller";
import {
  authenticate,
  AuthenticatedRequest,
} from "./auth.middleware";
import { pool } from "../../config/database";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/me",
  authenticate,
  async (req: AuthenticatedRequest, res) => {
    try {
      const result = await pool.query(
        `
        SELECT id, name, email, role, created_at
        FROM users
        WHERE id = $1
        `,
        [req.user!.userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      return res.status(200).json({
        user: result.rows[0],
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);

export default router;