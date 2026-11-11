import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { signUpRoute } from "./modules/user/signup.route";
import { authRoute } from "./modules/auth/auth.route";
import { doctorRoute } from "./modules/Doctor/doctor.route";
import { patientRoute } from "./modules/Patients/patients.route";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api", signUpRoute);
app.use("/api", authRoute);
app.use("/api", doctorRoute);
app.use("/api", patientRoute);

export default app;