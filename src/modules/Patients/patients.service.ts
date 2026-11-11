
import { ObjectId } from "mongodb";
import { getDB } from "../../lib/db";
import { CreatePatientPayload, Patient, PatientQuery, UpdatePatientPayload } from "./patients.interface";

const createPatient = async (payload: CreatePatientPayload) => {

  const { name, age, phone, address, condition, doctorId } = payload;

  // Validate doctor ID
  if (!ObjectId.isValid(doctorId)) {
    throw new Error("Invalid doctor ID");
  }

  // Check whether doctor exists
const doctor = await getDB().collection("doctors").findOne({
  _id: new ObjectId(doctorId)
});


  if (!doctor) {
    throw new Error("Doctor not found");
  }

  const patientData: Patient = {
    name,
    age,
    phone,
    address,
    condition,
    doctorId: new ObjectId(doctorId),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await getDB().collection("patients").insertOne(patientData);

  return {
    _id: result.insertedId,
    ...patientData,
  };
};

// Get all patients with search, filtering and pagination

const getAllPatients = async (query: PatientQuery) => {
  const patientsCollection = getDB().collection("patients");

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: any = {};

  // Search by patient name or phone
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { phone: { $regex: query.search, $options: "i" } },
    ];
  }

  // Filter by condition
  if (query.condition) {
    filter.condition = query.condition;
  }

  // Filter by doctor
  if (query.doctorId) {
    filter.doctorId = new ObjectId(query.doctorId);
  }

  // Filter by date
  if (query.startDate || query.endDate) {
    filter.createdAt = {};

    if (query.startDate) {
      filter.createdAt.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      const endDate = new Date(query.endDate);
      endDate.setHours(23, 59, 59, 999);

      filter.createdAt.$lte = endDate;
    }
  }

  const patients = await patientsCollection
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const totalPatients = await patientsCollection.countDocuments(filter);

  return {
    meta: {
      page,
      limit,
      total: totalPatients,
      totalPages: Math.ceil(totalPatients / limit),
    },
    data: patients,
  };
};

// Get patients assigned to a specific doctor
const getPatientsByDoctor = async (
  doctorId: string,
  query: PatientQuery
) => {
  if (!ObjectId.isValid(doctorId)) {
    throw new Error("Invalid doctor ID");
  }

  return getAllPatients({
    ...query,
    doctorId,
  });
};

// Update patient
const updatePatient = async (
  id: string,
  payload: UpdatePatientPayload
) => {
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid patient ID");
  }

  const patientsCollection = db.collection<Patient>("patients");

  const existingPatient = await patientsCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!existingPatient) {
    throw new Error("Patient not found");
  }

  const updateData: Record<string, any> = {};

  if (payload.name !== undefined) updateData.name = payload.name;
  if (payload.age !== undefined) updateData.age = payload.age;
  if (payload.phone !== undefined) updateData.phone = payload.phone;
  if (payload.address !== undefined) updateData.address = payload.address;
  if (payload.condition !== undefined) updateData.condition = payload.condition;

  // If changing the assigned doctor
  if (payload.doctorId !== undefined) {
    if (!ObjectId.isValid(payload.doctorId)) {
      throw new Error("Invalid doctor ID");
    }

    const doctor = await db.collection("doctors").findOne({
      _id: new ObjectId(payload.doctorId),
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    updateData.doctorId = new ObjectId(payload.doctorId);
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields provided for update");
  }

  updateData.updatedAt = new Date();

  await patientsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  return await patientsCollection.findOne({
    _id: new ObjectId(id),
  });
};

// Delete patient
const deletePatient = async (id: string) => {

  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid patient ID");
  }

  const result = await getDB().collection("patients").deleteOne({
    _id: new ObjectId(id),
  });

  if (result.deletedCount === 0) {
    throw new Error("Patient not found");
  }

  return {
    deletedCount: result.deletedCount,
  };
};

export default {
  createPatient,
  getAllPatients,
  getPatientsByDoctor,
  updatePatient,
  deletePatient,
};
