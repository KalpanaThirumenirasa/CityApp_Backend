import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './db';
import { ObjectId } from 'mongodb';

// Add a new Chatbox message
export const addChatbox = async (req: NextApiRequest, res: NextApiResponse) => {
  const { msdId, userId, message, adminId, adminReply } = req.body;

  if (!msdId || !userId || !message || !adminId || !adminReply) {
    res.status(400).json({ message: 'msdId, userId, message, adminId, and adminReply are required' });
    return;
  }

  try {
    console.log('Connecting to database...');
    const client = await clientPromise;
    console.log('Connected to database');

    const db = client.db('city_new');
    const chatboxCollection = db.collection('Chatbox');

    console.log('Adding Chatbox message...');
    const newChatbox = { msdId, userId, message, adminId, adminReply };

    console.log('Inserting new Chatbox message...');
    await chatboxCollection.insertOne(newChatbox);
    console.log('New Chatbox message inserted');

    res.status(201).json({ message: 'Chatbox message added successfully' });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get all Chatbox messages
export const getChatboxes = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('Connecting to database...');
    const client = await clientPromise;
    console.log('Connected to database');

    const db = client.db('city_new');
    const chatboxCollection = db.collection('Chatbox');

    console.log('Fetching all Chatbox messages...');
    const chatboxes = await chatboxCollection.find({}).toArray();

    res.status(200).json(chatboxes);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get a single Chatbox message by ID
export const getChatboxById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ message: 'Chatbox message ID is required' });
    return;
  }

  try {
    console.log('Connecting to database...');
    const client = await clientPromise;
    console.log('Connected to database');

    const db = client.db('city_new');
    const chatboxCollection = db.collection('Chatbox');

    console.log('Fetching Chatbox message by ID...');
    const chatbox = await chatboxCollection.findOne({ _id: new ObjectId(id as string) });

    if (!chatbox) {
      res.status(404).json({ message: 'Chatbox message not found' });
      return;
    }

    res.status(200).json(chatbox);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
