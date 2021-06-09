import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import { generateToken } from "../token";
import {
  handleNotFound,
  handleRegistrationError,
  handleError,
} from "../helpers";
import { PrismaClient } from "@prisma/client";

const saltRounds = 10;

const prisma = new PrismaClient();

const userColumns = {
  id: true,
  username: true,
  posts: true,
};

export const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        username,
        password: hash,
      },
      select: {
        id: true,
        username: true,
      },
    });
    res.json(user);
  } catch (error) {
    handleRegistrationError(error.message, res);
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user)
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: "User does not exist." });
    const isCorrectPassword: boolean = await bcrypt.compare(
      password,
      user.password
    );
    if (isCorrectPassword) {
      const token = await generateToken({
        user_id: user.id,
        username: user.username,
      });
      res
        .status(httpStatus.OK)
        .send({ message: "Logged in successfully", token });
    } else {
      res.status(httpStatus.UNAUTHORIZED).json({
        error: {
          message: "Incorrect username/password combination.",
        },
      });
    }
  } catch (error) {
    handleError(error.message, res);
  }
};

export const updateUserPassword = async (req, res) => {
  const { username, password, newPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user)
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: "User not found" });

    const isCorrectPassword: boolean = await bcrypt.compare(
      password,
      user.password
    );
    if (isCorrectPassword) {
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
      const updatedUser = await prisma.user.update({
        where: {
          username,
        },
        data: {
          password: newPasswordHash,
        },
      });
      console.log(updatedUser);
      res
        .status(httpStatus.OK)
        .send({ message: "Password updated successfully" });
    } else {
      res.status(httpStatus.UNAUTHORIZED).json({
        error: {
          message: "Passwords do not match. Try again.",
        },
      });
    }
  } catch (error) {
    handleError(error.message, res);
  }
};

export const getUsers = async (req, res) => {
  const { limit = 10, page = 1, sortOrder = "asc" } = req.query;
  try {
    const users = await prisma.user.findMany({
      take: limit,
      skip: limit * (page - 1),
      orderBy: {
        id: sortOrder,
      },
      select: userColumns,
    });
    const result = {
      count: users.length,
      data: users,
    };
    res.json(result);
  } catch (error) {
    handleError(error.message, res);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.authInfo;
  if (id != user_id)
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ message: "You are not authorized to update this user." });
  const params = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: +id },
      data: params,
      select: userColumns,
    });
    res.json(user);
  } catch (error) {
    handleNotFound(error.message, res);
  }
};

export const getOneUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: +id,
      },
      select: userColumns,
    });
    if (!user)
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: "User not found." });
    res.json(user);
  } catch (error) {
    handleNotFound(error.message, res);
  }
};

export const deleteuser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({
      where: {
        id: +id,
      },
      select: userColumns,
    });
    res.json(user);
  } catch (error) {
    handleNotFound(error.message, res);
  }
};
