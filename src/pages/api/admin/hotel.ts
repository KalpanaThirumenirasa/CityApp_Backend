import { NextApiRequest, NextApiResponse } from 'next';
import { addHotel } from '@/src/utils/auth';
import corsMiddleware from '../../../middleware/cors';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, () => {});

  if (req.method === 'POST') {
    return addHotel(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
