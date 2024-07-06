// src/utils/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientPromise from "./db";
import { User, UserRole } from "./authTypes";
import { getLogger } from "../lib/logger";

const logger= getLogger();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please add a JWT_SECRET to your .env.local file.");
}

export const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { firstname, email, password } = req.body;

  if (!email || !password || !firstname) {
    res
      .status(400)
      .json({ message: "Firstname, email, and password are required" });
    return;
  }

  try {
    logger.info("Connecting to database...");
    const client = await clientPromise;
    logger.info("Connected to database");

    const db = client.db("city_new");
    const usersCollection = db.collection<User>("users");

    logger.info("Checking for existing user...");
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      logger.info("User already exists");
      res.status(400).json({ message: "User already exists" });
      return;
    }

    logger.info("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    logger.info("Password hashed");

    const newUser: User = {
      firstname,
      email,
      password: hashedPassword,
      role: UserRole.USER,
    };

    logger.info("Inserting new user...");
    await usersCollection.insertOne(newUser);
    logger.info("New user inserted");

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
export const loginUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "email and password are required" });
    return;
  }

  try {
    const client = await clientPromise;
    const db = client.db("city_new");
    const usersCollection = db.collection<User>("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const tokenPayload = {
      userId: user._id,
      firstname: user.firstname,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
