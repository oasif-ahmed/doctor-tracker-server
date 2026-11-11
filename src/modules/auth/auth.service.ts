import { ObjectId } from "mongodb";
import { getDB } from "../../lib/db";
import { jwtUtils } from "../../utils/jwt";
import { LoginPayload } from "./auth.interface";
import bcrypt from "bcrypt";

const loginUser = async (payload: LoginPayload) => {
  const { email, password } = payload;

  const userCollection = getDB().collection("users");

  // Find user by email
  const user = await userCollection.findOne({ email });
  console.log("User found:", !!user);

  if (!user || !user._id) {
    throw new Error("Invalid email or password.");
  }

  // Compare the submitted password with the stored hash
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  console.log("Password matched:", isPasswordMatched);

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password.");
  }

  // Prepare JWT payload
  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  // Generate tokens
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET!,
    "15m",
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    process.env.JWT_REFRESH_SECRET!,
    "7d",
  );
  // Store hashed refresh token in MongoDB
  const refreshTokenHash = jwtUtils.hashToken(refreshToken);

  await userCollection.updateOne(
    { _id: user._id },
    {
      $set: {
        refreshTokenHash,
      },
    },
  );

  // Never return the password or refresh token hash
  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      phone: user.phone,
      bio: user.bio,
    },
    accessToken,
    refreshToken,
  };
};


const refreshAccessToken = async (refreshToken: string) => {
  // 1. Check whether refresh token exists
  if (!refreshToken) {
    throw Object.assign(new Error("Refresh token is required. Please login again."), {
      statusCode: 401,
    });
  }

  // 2. Verify refresh token
  const verifiedToken = jwtUtils.verifyToken(
    refreshToken,
    process.env.JWT_REFRESH_SECRET!
  );

  if (!verifiedToken.success) {
    throw Object.assign(new Error("Invalid or expired refresh token. Please login again."), {
      statusCode: 401,
    });
  }

  // 3. Validate JWT payload
  const decoded = verifiedToken.data;

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("userId" in decoded) ||
    typeof decoded.userId !== "string" ||
    !ObjectId.isValid(decoded.userId)
  ) {
    throw Object.assign(new Error("Invalid refresh token payload."), {
      statusCode: 401,
    });
  }

  const { userId } = decoded;

  // 4. Find user in MongoDB
  const userCollection = getDB().collection("users");

  const user = await userCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (!user) {
    throw Object.assign(new Error("User not found. Please login again."), {
      statusCode: 401,
    });
  }

  // 5. Check stored refresh token hash
  const incomingTokenHash = jwtUtils.hashToken(refreshToken);

  if (
    !user.refreshTokenHash ||
    user.refreshTokenHash !== incomingTokenHash
  ) {
    throw Object.assign(new Error("Refresh token has been revoked. Please login again."), {
      statusCode: 401,
    });
  }

  // 6. Generate a new access token
  const accessToken = jwtUtils.createToken(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET!,
    "15m"
  );

  return { accessToken };
};


export const authService = {
  loginUser,
  refreshAccessToken
};
