import httpstatus from "http-status-codes";
import { Request, Response } from "express";
import { doctorService } from "./doctor.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createDoctor = catchAsync(
  async (req: Request, res: Response) => {
    const result = await doctorService.createDoctor(req.body);

    sendResponse(res,{
      success: true,
      statusCode: httpstatus.CREATED,
      message: "Doctor created successfully.",
      data: result,
    });
  }
);



const getAllDoctors = catchAsync(
  async (req: Request, res: Response) => {
    const result = await doctorService.getAllDoctors(req.query);

    sendResponse(res,{
      success: true,
      statusCode: httpstatus.OK,
      message: "Doctors retrieved successfully.",
      meta: result.meta,
      data: result.data,
    });
  }
);




export const doctorController = {
  createDoctor,
  getAllDoctors
};
