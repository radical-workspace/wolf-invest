import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { userId, amount } = req.body
  if (!userId || !amount) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: Number(userId),
        amount: Number(amount),
        status: 'pending',
        createdAt: new Date(),
      },
    })
    return res.status(200).json({ withdrawal })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create withdrawal' })
  }
}
