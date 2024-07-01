import type { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../middleware/cors';
import { deleteTouristplace, getTouristplaceById, updateTouristplace } from '@/src/utils/touristplace';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, () => {});

  switch (req.method) {
    case 'GET':
      return getTouristplaceById(req, res);
    case 'PUT':
      return updateTouristplace(req, res);
    case 'DELETE':
      return deleteTouristplace(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
