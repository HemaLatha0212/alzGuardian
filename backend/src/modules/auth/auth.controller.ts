import { Request, Response } from "express";
import {
  registerSchema,
  loginSchema,
} from "./auth.validation";
import {
  registerUser,
  loginUser,
} from "./auth.service";

export const register = async (
  req: Request,
  res: Response
) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request",
      details: parsed.error.flatten(),
    });
  }

  try {
    const user = await registerUser(
      parsed.data.name,
      parsed.data.email,
      parsed.data.password,
      parsed.data.role
    );

    return res.status(201).json({
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "EMAIL_ALREADY_EXISTS"
    ) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request",
      details: parsed.error.flatten(),
    });
  }

  try {
    const result = await loginUser(
      parsed.data.email,
      parsed.data.password
    );

    return res.status(200).json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};