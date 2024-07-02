import type { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../middleware/cors';
import { addChatbox, getChatboxes } from '@/src/utils/chatbox';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res, async () => {
    if (req.method === 'GET') {
      return getChatboxes(req, res);
    } else if (req.method === 'POST') {
      return addChatbox(req, res);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
};

export default handler;