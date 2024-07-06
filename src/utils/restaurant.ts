import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './db';
import { ObjectId } from 'mongodb';
import { getLogger } from "../lib/logger";

const logger= getLogger();

// Add a new Restaurant
export const addRestaurant = async (req: NextApiRequest, res: NextApiResponse) => {
  const { restaurantName, desc, address, image } = req.body;

  if (!restaurantName || !desc || !address || !image) {
    res.status(400).json({ message: 'restaurantName, description, address and image are required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const RestaurantsCollection = db.collection('restaurants');

    logger.info('Adding Restaurant data');
    const newRestaurant = { restaurantName, desc, address, image };

    logger.info('Inserting new Restaurant data...');
    await RestaurantsCollection.insertOne(newRestaurant);
    logger.info('New Restaurants data inserted');

    res.status(201).json({ message: 'Restaurant data added successfully' });
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get all Restaurants
export const getRestaurants = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const RestaurantsCollection = db.collection('restaurants');

    logger.info('Fetching all Restaurants...');
    const Restaurants = await RestaurantsCollection.find({}).toArray();

    res.status(200).json(Restaurants);
  } catch (error) {
    logger.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get a single Restaurant by ID
export const getRestaurantById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ message: 'Restaurant ID is required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const restaurantsCollection = db.collection('restaurants');

    logger.info('Fetching Restaurant by ID...');
    const restaurant = await restaurantsCollection.findOne({ _id: new ObjectId(id as string) });

    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }

    res.status(200).json(restaurant);
  } catch (error) {
    logger.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Update a restaurant by ID
export const updateRestaurant = async (req: NextApiRequest, res: NextApiResponse) => {

  const { id } = req.query;
  const { restaurantName, desc, address, image } = req.body;
  if (!id) {

    res.status(400).json({ message: 'Restaurant ID is required' });
    return;
  }

  if (!restaurantName || !desc || !address || !image) {
    res.status(400).json({ message: 'restaurantName, description, address and image are required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const restaurantsCollection = db.collection('restaurants');

    logger.info('Updating Restaurant...');
    const updatedRestaurant = { restaurantName, desc, address, image };
    const result = await restaurantsCollection.updateOne({ _id: new ObjectId(id as string) }, { $set: updatedRestaurant });

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }

    res.status(200).json({ message: 'Restaurant updated successfully' });
  } catch (error) {
    logger.error('Error updating data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Delete a restaurant by ID
export const deleteRestaurant = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ message: 'Restaurant ID is required' });
    return;
  }

  try {
    logger.info('Connecting to database...');
    const client = await clientPromise;
    logger.info('Connected to database');

    const db = client.db('city_new');
    const restaurantsCollection = db.collection('restaurants');

    logger.info('Deleting Restaurant...');
    const result = await restaurantsCollection.deleteOne({ _id: new ObjectId(id as string) });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }

    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    logger.error('Error deleting data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
