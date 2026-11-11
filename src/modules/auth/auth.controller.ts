import httpstatus from "http-status-codes";
import { Request, Response } from "express";
import { authService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  const isProduction = process.env.NODE_ENV === "production";

  // Set access token cookie
  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  // Set refresh token cookie
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Login successful.",
    data: result.user,
  });
});

const refreshAccessToken = catchAsync(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const result = await authService.refreshAccessToken(refreshToken);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      success: true,
      statusCode: httpstatus.OK,
      message: "Access token refreshed successfully.",
    });
  }
);


// Get current authenticated user info
const getMe = catchAsync(async (req: Request, res: Response) => {
  // auth middleware attaches user to req
  if (!req.user) {
    return res.status(401).json({ success: false, statusCode: 401, message: 'Not authenticated' });
  }
  res.status(200).json({ success: true, statusCode: 200, data: req.user });
});

export const authController = {
  loginUser,
  refreshAccessToken,
  getMe,
};
