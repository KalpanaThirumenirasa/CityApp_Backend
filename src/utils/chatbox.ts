import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "./db";
import { ObjectId } from "mongodb";

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
    console.log("Connecting to database...");
    const client = await clientPromise;
    console.log("Connected to database");

    const db = client.db("city_new");
    const chatboxCollection = db.collection("Chatbox");

    console.log("Adding Chatbox message...");
    const newChatbox = {
      userId,
      message,
      adminId: "",
      adminReply: "",
    };

    console.log("Inserting new Chatbox message...");
    await chatboxCollection.insertOne(newChatbox);
    console.log("New Chatbox message inserted");

    res.status(201).json(newChatbox );
  } catch (error) {
    console.error("Error adding message:", error);
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
    console.log("Connecting to database...");
    const client = await clientPromise;
    console.log("Connected to database");

    const db = client.db("city_new");
    const chatboxCollection = db.collection("Chatbox");

    console.log("Adding Chatbox message...");
    const newChatbox = {
      userId,
      message:"",
      adminId,
      adminReply,
    };

    console.log("Inserting new Chatbox message...");
    await chatboxCollection.insertOne(newChatbox);
    console.log("New Chatbox message inserted");

    res.status(201).json(newChatbox );
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get all Chatbox messages
export const getChatboxes = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    console.log("Connecting to database...");
    const client = await clientPromise;
    console.log("Connected to database");

    const db = client.db("city_new");
    const chatboxCollection = db.collection("Chatbox");

    console.log("Fetching all Chatbox messages...");
    const chatboxes = await chatboxCollection.find({}).toArray();

    res.status(200).json(chatboxes);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get a single Chatbox message by ID
export const getChatboxById = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  console.log("request is",userId);
  // const { userId  } = req.query;

  if (!userId ) {
    res.status(400).json({ message: "Chatbox message ID is required" });
    return;
  }

  try {
    console.log("Connecting to database...");
    const client = await clientPromise;
    console.log("Connected to database");

    const db = client.db("city_new");
    const chatboxCollection = db.collection("Chatbox");

    console.log("Fetching Chatbox message by ID...");
    const query = { userId: String(userId) }; 

    // const chatboxes = await chatboxCollection.find(query).toArray();
    const chatboxes = await chatboxCollection.find({}).toArray();
    

    res.status(200).json(chatboxes);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
