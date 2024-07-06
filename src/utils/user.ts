import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './db';
import { ObjectId } from 'mongodb';
import { getLogger } from "../lib/logger";

const logger= getLogger();

// Add a new _User
export const addUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { firstname, email, password, role } = req.body;

  if (!firstname || !email || !password || !role) {
    res.status(400).json({ message: 'all field are required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const usersCollection = db.collection('users');

    logger.info('Adding User data');
    const newUser = { firstname, email, password, role };

    logger.info('Inserting new User data...');
    await usersCollection.insertOne(newUser);
    logger.info('New User data inserted');

    res.status(201).json({ message: 'User data added successfully' });
  } catch (error) {
    logger.error('Error adding data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get all Users
export const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const usersCollection = db.collection('users');

    logger.info('Fetching all Users...');
    const Users = await usersCollection.find({}).toArray();

    res.status(200).json(Users);
  } catch (error) {
    logger.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get a single User by ID
export const getUserById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const usersCollection = db.collection('users');

    logger.info('Fetching User by ID...');
    const user = await usersCollection.findOne({ _id: new ObjectId(id as string) });

    if (!user) {
      res.status(404).json({ message: 'user not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Update a user by ID
export const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {

  const { id } = req.query;
  const { firstname, email, password, role } = req.body;
  if (!id) {

    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  if (!firstname || !email || !password || !role) {
    res.status(400).json({ message: 'all data required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const usersCollection = db.collection('users');

    logger.info('Updating User...');
    const updatedUser = { firstname, email, password, role };
    const result = await usersCollection.updateOne({ _id: new ObjectId(id as string) }, { $set: updatedUser });

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    logger.error('Error updating data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Delete a User by ID
export const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const usersCollection = db.collection('users');

    logger.info('Deleting User...');
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id as string) });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Error deleting data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
