import { NextApiRequest, NextApiResponse } from 'next';
import { addHotel, getHotels } from  '../../../utils/hotel';
import corsMiddleware from '../../../middleware/cors';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res, () => {});

  if (req.method === 'GET') {
    return getHotels(req, res);
  } else if (req.method === 'POST') {
    return addHotel(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
