// src/pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { loginUser } from '../../../utils/auth';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return loginUser(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
