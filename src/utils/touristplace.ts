import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './db';
import { ObjectId } from 'mongodb';
import { getLogger } from "../lib/logger";

const logger= getLogger();

// Add a new Touristplace
export const addTouristplace = async (req: NextApiRequest, res: NextApiResponse) => {
  const { touristplaceName, desc, address, image } = req.body;

  if (!touristplaceName || !desc || !address || !image) {
    res.status(400).json({ message: 'touristplaceName, description, address and image are required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const touristplacesCollection = db.collection('touristplaces');

    logger.info('Adding Touristplace data');
    const newTouristplace = { touristplaceName, desc, address, image };

    logger.info('Inserting new Touristplace data...');
    await touristplacesCollection.insertOne(newTouristplace);
    logger.info('NewTtouristplace data inserted');

    res.status(201).json({ message: 'Touristplace data added successfully' });
  } catch (error) {
    logger.error('Error adding data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get all Touristplaces
export const getTouristplaces = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const touristplacesCollection = db.collection('touristplaces');

    logger.info('Fetching all Touristplaces...');
    const touristplaces = await touristplacesCollection.find({}).toArray();

    res.status(200).json(touristplaces);
  } catch (error) {
    logger.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get a single Touristplace by ID
export const getTouristplaceById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ message: 'Touristplace ID is required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const touristplacesCollection = db.collection('touristplaces');

    logger.info('Fetching Touristplace by ID...');
    const touristplace = await touristplacesCollection.findOne({ _id: new ObjectId(id as string) });

    if (!touristplace) {
      res.status(404).json({ message: 'Touristplace not found' });
      return;
    }

    res.status(200).json(touristplace);
  } catch (error) {
    logger.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Update a Touristplace by ID
export const updateTouristplace = async (req: NextApiRequest, res: NextApiResponse) => {

  const { id } = req.query;
  const { touristplaceName, desc, address, image } = req.body;
  if (!id) {

    res.status(400).json({ message: 'Touristplace ID is required' });
    return;
  }

  if (!touristplaceName || !desc || !address || !image) {
    res.status(400).json({ message: 'touristplaceName, description, address and image are required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const touristplacesCollection = db.collection('touristplaces');

    logger.info('Updating Touristplace...');
    const updatedTouristplace = { touristplaceName, desc, address, image };
    const result = await touristplacesCollection.updateOne({ _id: new ObjectId(id as string) }, { $set: updateTouristplace });

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Touristplace not found' });
      return;
    }

    res.status(200).json({ message: 'Touristplace updated successfully' });
  } catch (error) {
    logger.error('Error updating data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Delete a Touristplace by ID
export const deleteTouristplace = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ message: 'Touristplace ID is required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const touristplacesCollection = db.collection('touristplaces');

    logger.info('Deleting Touristplace...');
    const result = await touristplacesCollection.deleteOne({ _id: new ObjectId(id as string) });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Touristplace not found' });
      return;
    }

    res.status(200).json({ message: 'Touristplace deleted successfully' });
  } catch (error) {
    logger.error('Error deleting data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
