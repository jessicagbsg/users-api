import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  let parsedError;

  try {
    parsedError = JSON.parse(err.message);
  } catch (parseError) {
    parsedError = {
      status: 500,
      message: err.message ?? "Internal server error",
      issues: [],
    };
  }

  res.status(parsedError.status).json({
    status: "error",
    message: parsedError.message,
    issues: parsedError.issues,
  });
}
