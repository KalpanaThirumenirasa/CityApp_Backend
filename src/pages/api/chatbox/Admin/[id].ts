import type { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../../middleware/cors';
import { getChatboxById } from '@/src/utils/chatbox';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res, async () => {
    if (req.method === 'GET') {
      const { id } = req.query; // Use 'id' instead of 'userId'
      if (id) {
        const singleId = Array.isArray(id) ? id[0] : id;
        return getChatboxById(req, res, singleId);
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
};

export default handler;
