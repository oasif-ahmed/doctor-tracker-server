
import { ObjectId } from "mongodb";

export interface Patient {
  _id?: ObjectId;
  name: string;
  age: number;
  phone: string;
  address: string;
  condition: string;
  doctorId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePatientPayload {
  name: string;
  age: number;
  phone: string;
  address: string;
  condition: string;
  doctorId: string;
}

export interface UpdatePatientPayload {
  name?: string;
  age?: number;
  phone?: string;
  address?: string;
  condition?: string;
  doctorId?: string;
}

export interface PatientQuery {
  page?: string;
  limit?: string;
  search?: string;
  condition?: string;
  doctorId?: string;
  startDate?: string;
  endDate?: string;
}
