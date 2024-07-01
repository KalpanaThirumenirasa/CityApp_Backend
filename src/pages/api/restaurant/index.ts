import { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../middleware/cors';
import { addRestaurant, getRestaurants } from '@/src/utils/restaurant';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res, () => {});

  if (req.method === 'GET') {
    return getRestaurants(req, res);
  } else if (req.method === 'POST') {
    return addRestaurant(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
