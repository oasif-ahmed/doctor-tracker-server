
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import crypto from "crypto";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"]
): string => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  });

  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);

    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Token verification failed";

    return {
      success: false,
      error: message,
    };
  }
};

const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const jwtUtils = {
  createToken,
  verifyToken,
  hashToken,
};
