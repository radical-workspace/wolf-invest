import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { userId, amount, planType, dailyROI } = req.body
  if (!userId || !amount || !planType || !dailyROI) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    const investment = await prisma.investment.create({
      data: {
        userId: Number(userId),
        amount: Number(amount),
        planType: planType,
        dailyROI: Number(dailyROI),
        status: 'active',
        endDate: new Date(), // You can update this logic for real end date
        totalEarnings: 0,
        daysRemaining: 7,
        nextPayoutDate: new Date(),
      },
    })
    return res.status(200).json({ investment })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create investment' })
  }
}
