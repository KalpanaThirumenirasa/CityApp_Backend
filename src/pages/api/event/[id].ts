import type { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../middleware/cors';
import { deleteEvent, getEventById, updateEvent } from '@/src/utils/event';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, () => {});

  switch (req.method) {
    case 'GET':
      return getEventById(req, res);
    case 'PUT':
      return updateEvent(req, res);
    case 'DELETE':
      return deleteEvent(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
