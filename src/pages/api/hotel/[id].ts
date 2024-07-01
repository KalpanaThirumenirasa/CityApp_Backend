import type { NextApiRequest, NextApiResponse } from 'next';
import { getHotelById, updateHotel, deleteHotel } from '@/src/utils/hotel';
import corsMiddleware from '../../../middleware/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, () => {});

  switch (req.method) {
    case 'GET':
      return getHotelById(req, res);
    case 'PUT':
      return updateHotel(req, res);
    case 'DELETE':
      return deleteHotel(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
