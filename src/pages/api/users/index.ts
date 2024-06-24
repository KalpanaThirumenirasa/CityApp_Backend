import type { NextApiRequest, NextApiResponse } from 'next'

type User = {
  id: number
  name: string
}

let users: User[] = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' },
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(users)
  } else if (req.method === 'POST') {
    const newUser: User = req.body
    newUser.id = users.length + 1
    users.push(newUser)
    res.status(201).json(newUser)
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
