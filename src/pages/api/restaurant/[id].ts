import type { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../middleware/cors';
import { deleteRestaurant, getRestaurantById, updateRestaurant } from '@/src/utils/restaurant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, () => {});

  switch (req.method) {
    case 'GET':
      return getRestaurantById(req, res);
    case 'PUT':
      return updateRestaurant(req, res);
    case 'DELETE':
      return deleteRestaurant(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
