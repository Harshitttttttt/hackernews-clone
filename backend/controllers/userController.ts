import type { Response, Request, NextFunction, RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import {
  RegisterUserSchema,
  LoginUserSchema,
} from "../zod/schemas/auth.schema.ts";
import { db } from "../db/db.ts";
import { usersTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.ts";

import {
  checkIfUserExists,
  createUser,
  getUserByEmail,
} from "../db/queries/userQueries.ts";

// @desc Register a user
// @route POST /api/users/register
// @access Public

const registerUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log("Hitting registerUser endpoint");
    try {
      const validated = RegisterUserSchema.parse(req.body);
      const { username, email, password } = validated;

      // const userAlreadyExists = await db.query.usersTable.findFirst({
      //   where: (u, { eq }) => eq(u.email, email),
      // });

      const userAlreadyExists = await checkIfUserExists(email);

      if (userAlreadyExists) {
        return res.status(409).json({
          message: "User already exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // const [user] = await db
      //   .insert(usersTable)
      //   .values({ username, email, password: hashedPassword })
      //   .returning();

      const userData = {
        username: username,
        email: email,
        password: hashedPassword,
      };

      const [user] = await createUser(userData);

      if (user) {
        generateToken(res, user.id);
        res.status(201).json({
          message: "User Registered Successfully",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({
          message: err.message,
        });
      }

      next(err);
    }
  }
);

// @desc Login a user
// @route POST /api/users/login
// @access Public

const loginUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log("Hitting loginUser endpoint");
    try {
      const validated = LoginUserSchema.parse(req.body);
      const { email, password } = validated;

      console.log("Login attempt:", { email, password });

      // const findUser = await db.query.usersTable.findFirst({
      //   where: (u, { eq }) => eq(u.email, email),
      // });

      const findUser = await getUserByEmail(email);

      if (findUser && (await bcrypt.compare(password, findUser.password))) {
        generateToken(res, findUser.id);
        res.status(201).json({
          message: "User Logged In Successfully",
          user: {
            id: findUser.id,
            username: findUser.username,
            email: findUser.email,
          },
        });
      } else {
        res.status(401);
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          message: error.message,
        });
      }
    }
  }
);

// @desc Logout a user / Clear cookies
// @route POST /api/users/logout
// @access Public

const logoutUser: RequestHandler = async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    message: "User logged out",
  });
};

// @desc Get user profile
// @route GET /api/users/profile
// @access Private

const getUserProfile: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    if (!req.user) {
      return res.status(401).json({
        message: "Not Authenticated",
      });
    }

    console.log("req.user: ", req.user);

    const { id, username, email } = req.user;

    res.status(200).json({
      id,
      username,
      email,
    });
  }
);

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private

const updateUserProfile = () => {};

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
