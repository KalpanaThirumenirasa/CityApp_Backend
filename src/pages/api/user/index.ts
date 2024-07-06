import { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../middleware/cors';
import { addUser, getUsers } from '@/src/utils/user';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res, () => {});

  if (req.method === 'GET') {
    return getUsers(req, res);
  } else if (req.method === 'POST') {
    return addUser(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;