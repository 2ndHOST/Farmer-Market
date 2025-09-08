import { Router } from 'express'
import { prisma } from '../util/prisma.js'

const router = Router()

router.post('/:listingId', async (req, res, next) => {
	try {
		const { listingId } = req.params
		const { amount, buyerName } = req.body
		const bid = await prisma.bid.create({
			data: { listingId, amount: Number(amount), buyerName },
		})
		res.status(201).json(bid)
	} catch (e) { next(e) }
})

router.get('/:listingId', async (req, res, next) => {
	try {
		const { listingId } = req.params
		const bids = await prisma.bid.findMany({
			where: { listingId },
			orderBy: { amount: 'desc' },
		})
		res.json(bids)
	} catch (e) { next(e) }
})

export default router


