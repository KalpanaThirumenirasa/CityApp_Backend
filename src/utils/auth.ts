// src/utils/auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import clientPromise from './db';
import { User, UserRole } from './authTypes';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please add a JWT_SECRET to your .env.local file.');
}

export const registerUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { firstname, username, password } = req.body;

  if (!username || !password || !firstname) {
    res.status(400).json({ message: 'Firstname, username, and password are required' });
    return;
  }

  try {
    console.log('Connecting to database...');
    const client = await clientPromise;
    console.log('Connected to database');
    
    const db = client.db('city_new');
    const usersCollection = db.collection<User>('users');

    console.log('Checking for existing user...');
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      console.log('User already exists');
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');

    const newUser: User = { 
      firstname, 
      username, 
      password: hashedPassword, 
      role: UserRole.USER 
    };

    console.log('Inserting new user...');
    await usersCollection.insertOne(newUser);
    console.log('New user inserted');

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error', error: error });
  }
};


export const loginUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  try {
    const client = await clientPromise;
    const db = client.db('city_new');
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ username });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
