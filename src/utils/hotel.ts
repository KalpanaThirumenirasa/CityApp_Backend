import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './db';
import { ObjectId } from 'mongodb';

// Add a new hotel
export const addHotel = async (req: NextApiRequest, res: NextApiResponse) => {
  const { hotelName, desc, address, image } = req.body;

  if (!hotelName || !desc || !address || !image) {
    res.status(400).json({ message: 'hotelName, description, address and image are required' });
    return;
  }

  try {
    console.log('Connecting to database...');
    const client = await clientPromise;
    console.log('Connected to database');

    const db = client.db('city_new');
    const hotelsCollection = db.collection('hotels');

    console.log('Adding hotel data');
    const newHotel = { hotelName, desc, address, image };

    console.log('Inserting new hotel data...');
    await hotelsCollection.insertOne(newHotel);
    console.log('New hotel data inserted');

    res.status(201).json({ message: 'Hotel data added successfully' });
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get all hotels
export const getHotels = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('Connecting to database...');
    const client = await clientPromise;
    console.log('Connected to database');

    const db = client.db('city_new');
    const hotelsCollection = db.collection('hotels');

    console.log('Fetching all hotels...');
    const hotels = await hotelsCollection.find({}).toArray();

    res.status(200).json(hotels);
  } catch (error) {
    console.error('Error fetching data:', error);
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
    console.log('Connecting to database...');
    const client = await clientPromise;
    console.log('Connected to database');

    const db = client.db('city_new');
    const hotelsCollection = db.collection('hotels');

    console.log('Fetching hotel by ID...');
    const hotel = await hotelsCollection.findOne({ _id: new ObjectId(id as string) });

    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }

    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error fetching data:', error);
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
    console.log('Connecting to database...');
    const client = await clientPromise;
    console.log('Connected to database');

    const db = client.db('city_new');
    const hotelsCollection = db.collection('hotels');

    console.log('Updating hotel...');
    const updatedHotel = { hotelName, desc, address, image };
    const result = await hotelsCollection.updateOne({ _id: new ObjectId(id as string) }, { $set: updatedHotel });

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }

    res.status(200).json({ message: 'Hotel updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
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
    console.log('Connecting to database...');
    const client = await clientPromise;
    console.log('Connected to database');

    const db = client.db('city_new');
    const hotelsCollection = db.collection('hotels');

    console.log('Deleting hotel...');
    const result = await hotelsCollection.deleteOne({ _id: new ObjectId(id as string) });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }

    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
