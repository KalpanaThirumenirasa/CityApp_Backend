import type { NextApiRequest, NextApiResponse } from 'next';

type User = {
  id: number
  name: string
}

let users: User[] = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' },
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req

  const userId = parseInt(id as string)

  const user = users.find(user => user.id === userId)

  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  switch (method) {
    case 'GET':
      res.status(200).json(user)
      break
    case 'PUT':
      const updatedUser = req.body
      users = users.map(user => user.id === userId ? updatedUser : user)
      res.status(200).json(updatedUser)
      break
    case 'DELETE':
      users = users.filter(user => user.id !== userId)
      res.status(204).end()
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}


