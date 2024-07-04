import type { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../../middleware/cors';
import { UserAddChatbox } from '@/src/utils/chatbox';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res, async () => {
    if (req.method === 'POST') {
      return UserAddChatbox(req, res);
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
};

export default handler;