import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  phone?: string;
  bio?: string;
  refreshTokenHash?: string;
  createdAt: Date;
}


export interface LoginPayload {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}