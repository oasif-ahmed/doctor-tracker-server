import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./signup.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status-codes";

const signupUser = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.signUpUser(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "User created successfully.",
        data: result
    })
})

export const userController = {
    signupUser
}