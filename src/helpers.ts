import httpStatus from "http-status-codes";
import { Response } from "express";

export const handleError = (message: string, res: Response) => {
  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ message });
};

export const handleNotFound = (message: string, res: Response) => {
  if (message.includes("not found")) {
    res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json({ message: "Record not found." });
  } else {
    handleError(message, res);
  }
};

export const handleRegistrationError = (message: string, res: Response) => {
  if (message.includes("Unique")) {
    res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json({ message: "Username already taken." });
  } else {
    handleError(message, res);
  }
};
