import type { IncomingMessage, ServerResponse } from "http";
import app from "../src/app.js";
import { connectDB } from "../src/lib/db.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await connectDB();
  return app(req as any, res as any);
}