import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './db';
import { ObjectId } from 'mongodb';

// Add a new Event
export const addEvent = async (req: NextApiRequest, res: NextApiResponse) => {
  const { eventName, desc, address, image } = req.body;

  if (!eventName || !desc || !address || !image) {
    res.status(400).json({ message: 'eventName, description, address and image are required' });
    return;
  }

  try {
    console.log('Connecting to database...');
    const client = await clientPromise;
    console.log('Connected to database');

    const db = client.db('city_new');
    const eventsCollection = db.collection('events');

    console.log('Adding Event data');
    const newEvent = { eventName, desc, address, image };

    console.log('Inserting new Event data...');
    await eventsCollection.insertOne(newEvent);
    console.log('New Event data inserted');

    res.status(201).json({ message: 'Event data added successfully' });
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get all Events
export const getEvents = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('Connecting to database...');
    const client = await clientPromise;
    console.log('Connected to database');

    const db = client.db('city_new');
    const eventsCollection = db.collection('events');

    console.log('Fetching all Events...');
    const Events = await eventsCollection.find({}).toArray();

    res.status(200).json(Events);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get a single Event by ID
export const getEventById = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ message: 'Event ID is required' });
    return;
  }

  try {
    console.log('Connecting to database...');
    const client = await clientPromise;
    console.log('Connected to database');

    const db = client.db('city_new');
    const eventsCollection = db.collection('events');

    console.log('Fetching Event by ID...');
    const event = await eventsCollection.findOne({ _id: new ObjectId(id as string) });

    if (!event) {
      res.status(404).json({ message: 'event not found' });
      return;
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Update a event by ID
export const updateEvent = async (req: NextApiRequest, res: NextApiResponse) => {

  const { id } = req.query;
  const { eventName, desc, address, image } = req.body;
  if (!id) {

    res.status(400).json({ message: 'Event ID is required' });
    return;
  }

  if (!eventName || !desc || !address || !image) {
    res.status(400).json({ message: 'eventName, description, address and image are required' });
    return;
  }

  try {
    console.log('Connecting to database...');
    const client = await clientPromise;
    console.log('Connected to database');

    const db = client.db('city_new');
    const eventsCollection = db.collection('events');

    console.log('Updating Event...');
    const updatedEvent = { eventName, desc, address, image };
    const result = await eventsCollection.updateOne({ _id: new ObjectId(id as string) }, { $set: updatedEvent });

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Delete a Event by ID
export const deleteEvent = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ message: 'Event ID is required' });
    return;
  }

  try {
    console.log('Connecting to database...');
    const client = await clientPromise;
    console.log('Connected to database');

    const db = client.db('city_new');
    const eventsCollection = db.collection('events');

    console.log('Deleting Event...');
    const result = await eventsCollection.deleteOne({ _id: new ObjectId(id as string) });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
