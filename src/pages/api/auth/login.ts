// src/pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { loginUser } from '../../../utils/auth';
import corsMiddleware from '../../../middleware/cors';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, () => {});

  if (req.method === 'POST') {
    return loginUser(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
