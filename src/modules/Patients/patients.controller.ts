import { Request, Response } from "express";
import patientService from "./patients.service";
import { PatientQuery } from "./patients.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status-codes";
// Create Patient
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await patientService.createPatient(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpstatus.CREATED,
    message: "Patient created successfully",
    data: result,
  });
});

// Get All Patients
const getAllPatients = catchAsync(async (req: Request, res: Response) => {
  const result = await patientService.getAllPatients(
    req.query as unknown as PatientQuery
  );

  sendResponse(res,{
    success: true,
    statusCode: httpstatus.OK,
    message: "Patients retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// Get Patients By Doctor ID
const getPatientsByDoctor = catchAsync(
  async (req: Request, res: Response) => {
    const result = await patientService.getPatientsByDoctor(
      req.params.doctorId as string,
      req.query as unknown as PatientQuery
    );

    res.status(200).json({
      success: true,
      message: "Doctor's patients retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

// Update Patient
const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const result = await patientService.updatePatient(
    req.params.id as string,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Patient updated successfully",
    data: result,
  });
});

// Delete Patient
const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const result = await patientService.deletePatient(req.params.id as string);

  res.status(200).json({
    success: true,
    message: "Patient deleted successfully",
    data: result,
  });
});

export const patientController = {
  createPatient,
  getAllPatients,
  getPatientsByDoctor,
  updatePatient,
  deletePatient,
};