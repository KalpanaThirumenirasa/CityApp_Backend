import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './db';
import { ObjectId } from 'mongodb';
import { getLogger } from "../lib/logger";

const logger= getLogger();

// Add a new hotel
export const addHotel = async (req: NextApiRequest, res: NextApiResponse) => {
  const { hotelName, desc, address, image } = req.body;

  if (!hotelName || !desc || !address || !image) {
    res.status(400).json({ message: 'hotelName, description, address and image are required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const hotelsCollection = db.collection('hotels');

    logger.info('Adding hotel data');
    const newHotel = { hotelName, desc, address, image };

    logger.info('Inserting new hotel data...');
    await hotelsCollection.insertOne(newHotel);
    logger.info('New hotel data inserted');

    res.status(201).json({ message: 'Hotel data added successfully' });
  } catch (error) {
    logger.error('Error adding data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get all hotels
export const getHotels = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const hotelsCollection = db.collection('hotels');

    logger.info('Fetching all hotels...');
    const hotels = await hotelsCollection.find({}).toArray();

    res.status(200).json(hotels);
  } catch (error) {
    logger.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get a single hotel by ID
export const getHotelById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ message: 'Hotel ID is required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const hotelsCollection = db.collection('hotels');

    logger.info('Fetching hotel by ID...');
    const hotel = await hotelsCollection.findOne({ _id: new ObjectId(id as string) });

    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }

    res.status(200).json(hotel);
  } catch (error) {
    logger.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Update a hotel by ID
export const updateHotel = async (req: NextApiRequest, res: NextApiResponse) => {

  const { id } = req.query;
  const { hotelName, desc, address, image } = req.body;
  if (!id) {

    res.status(400).json({ message: 'Hotel ID is required' });
    return;
  }

  if (!hotelName || !desc || !address || !image) {
    res.status(400).json({ message: 'hotelName, description, address and image are required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const hotelsCollection = db.collection('hotels');

    logger.info('Updating hotel...');
    const updatedHotel = { hotelName, desc, address, image };
    const result = await hotelsCollection.updateOne({ _id: new ObjectId(id as string) }, { $set: updatedHotel });

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }

    res.status(200).json({ message: 'Hotel updated successfully' });
  } catch (error) {
    logger.error('Error updating data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Delete a hotel by ID
export const deleteHotel = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ message: 'Hotel ID is required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const hotelsCollection = db.collection('hotels');

    logger.info('Deleting hotel...');
    const result = await hotelsCollection.deleteOne({ _id: new ObjectId(id as string) });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }

    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    logger.error('Error deleting data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
