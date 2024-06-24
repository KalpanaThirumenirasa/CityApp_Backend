// src/pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { registerUser } from '../../../utils/auth';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return registerUser(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
