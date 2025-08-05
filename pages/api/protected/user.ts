import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Parse cookies from request
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const session = cookies.session;

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Find user by session (userId)
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(session) } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid session' });
    }
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch user' });
  }
}
