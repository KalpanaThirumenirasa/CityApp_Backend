import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "./db";
import { ObjectId } from "mongodb";
import { getLogger } from "../lib/logger";

const logger= getLogger();
// Add a new Chatbox message
export const UserAddChatbox = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    res.status(400).json({ message: " userId, message are required" });
    return;
  }

  try {
    logger.info("Connecting to database...");
    const client = await clientPromise;
    logger.info("Connected to database");

    const db = client.db("city_new");
    const chatboxCollection = db.collection("Chatbox");

    logger.info("Adding Chatbox message...");
    const newChatbox = {
      userId,
      message,
      adminId: "",
      adminReply: "",
    };

    logger.info("Inserting new Chatbox message...");
    await chatboxCollection.insertOne(newChatbox);
    logger.info("New Chatbox message inserted");

    res.status(201).json(newChatbox );
  } catch (error) {
    logger.error("Error adding message:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const AdminAddChatbox = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { userId, adminReply ,adminId} = req.body;

  if (!userId || !adminReply ||!adminId) {
    res.status(400).json({ message: " userId, adminReply,adminId are required" });
    return;
  }

  try {
    logger.info("Connecting to database...");
    const client = await clientPromise;
    logger.info("Connected to database");

    const db = client.db("city_new");
    const chatboxCollection = db.collection("Chatbox");

    logger.info("Adding Chatbox message...");
    const newChatbox = {
      userId,
      message:"",
      adminId,
      adminReply,
    };

    logger.info("Inserting new Chatbox message...");
    await chatboxCollection.insertOne(newChatbox);
    logger.info("New Chatbox message inserted");

    res.status(201).json(newChatbox );
  } catch (error) {
    logger.error("Error adding message:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get all Chatbox messages
export const getChatboxes = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    logger.info("Connecting to database...");
    const client = await clientPromise;
    logger.info("Connected to database");

    const db = client.db("city_new");
    const chatboxCollection = db.collection("Chatbox");

    logger.info("Fetching all Chatbox messages...");
    const chatboxes = await chatboxCollection.find({}).toArray();

    res.status(200).json(chatboxes);
  } catch (error) {
    logger.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get a single Chatbox message by ID
export const getChatboxById = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  logger.info("request is",userId);
  // const { userId  } = req.query;

  if (!userId ) {
    res.status(400).json({ message: "Chatbox message ID is required" });
    return;
  }

  try {
    logger.info("Connecting to database...");
    const client = await clientPromise;
    logger.info("Connected to database");

    const db = client.db("city_new");
    const chatboxCollection = db.collection("Chatbox");

    logger.info("Fetching Chatbox message by ID...");
    const query = { userId: String(userId) }; 

    // const chatboxes = await chatboxCollection.find(query).toArray();
    const chatboxes = await chatboxCollection.find({}).toArray();
    

    res.status(200).json(chatboxes);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
