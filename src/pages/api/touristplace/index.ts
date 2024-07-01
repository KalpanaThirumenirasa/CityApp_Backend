import { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../middleware/cors';
import { addTouristplace, getTouristplaces } from '@/src/utils/touristplace';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res, () => {});

  if (req.method === 'GET') {
    return getTouristplaces(req, res);
  } else if (req.method === 'POST') {
    return addTouristplace(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
