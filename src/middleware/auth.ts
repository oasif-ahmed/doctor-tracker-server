import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { JwtPayload } from "jsonwebtoken";

import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { getDB } from "../lib/db";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

export const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // 1. Extract access token
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw Object.assign(
        new Error("You are not logged in. Please log in to access this resource."),
        { statusCode: 401 }
      );
    }

    // 2. Verify access token
    const verifiedToken = jwtUtils.verifyToken(
      token,
      process.env.JWT_ACCESS_SECRET!
    );

    if (!verifiedToken.success) {
      throw Object.assign(
        new Error(verifiedToken.error),
        { statusCode: 401 }
      );
    }

    // 3. Extract userId from JWT payload
    const decoded = verifiedToken.data;

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded) ||
      typeof decoded.userId !== "string" ||
      !ObjectId.isValid(decoded.userId)
    ) {
      throw Object.assign(
        new Error("Invalid token payload."),
        { statusCode: 401 }
      );
    }

    const { userId } = decoded as JwtPayload & { userId: string };

    // 4. Find user in MongoDB
    const userCollection = getDB().collection("users");

    const user = await userCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      throw Object.assign(
        new Error("User not found. Please login again."),
        { statusCode: 401 }
      );
    }

    // 5. Attach authenticated user to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    // 6. Continue to next middleware/controller
    next();
  });
};