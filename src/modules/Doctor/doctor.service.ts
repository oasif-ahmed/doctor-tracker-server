
import { getDB } from "../../lib/db";
import { CreateDoctorPayload } from "./doctor.interface";

const createDoctor = async (payload: CreateDoctorPayload) => {
  const doctorCollection = getDB().collection("doctors");

  const doctorData = {
    name: payload.name,
    specialization: payload.specialization,
    hospital: payload.hospital,
    phone: payload.phone,
    email: payload.email.toLowerCase(),
    createdAt: new Date(),
  };

  const result = await doctorCollection.insertOne(doctorData);

  return {
    _id: result.insertedId,
    ...doctorData,
  };
};


// Get all doctors

const escapeRegex = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getAllDoctors = async (query: Record<string, unknown>) => {
  const doctorCollection = getDB().collection("doctors");

  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Number(query.limit) || 10, 100);
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (query.search) {
    filter.name = { $regex: escapeRegex(String(query.search)), $options: "i" };
  }
  if (query.specialization) filter.specialization = query.specialization;
  if (query.hospital) filter.hospital = query.hospital;

  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(String(query.startDate));
    if (query.endDate) {
      const end = new Date(String(query.endDate));
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  const doctors = await doctorCollection
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await doctorCollection.countDocuments(filter);

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: doctors,
  };
};



export const doctorService = {
  createDoctor,
  getAllDoctors,
};
