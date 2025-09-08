import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import listingsRouter from './routes/listings.js'
import bidsRouter from './routes/bids.js'
import authRouter from './routes/auth.js'
import { prisma } from './util/prisma.js'

const app = express()
const PORT = process.env.PORT || 3000
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: ORIGIN, credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/auth', authRouter)
app.use('/listings', listingsRouter)
app.use('/bids', bidsRouter)

// Lightweight endpoint for farmer selling flow
app.post('/api/bids', async (req, res, next) => {
  try {
    const { name, minPrice, quantity, description } = req.body || {}
    if (!name || minPrice == null || quantity == null) {
      return res.status(400).json({ error: 'name, minPrice and quantity are required' })
    }
    const numericMinPrice = Number(minPrice)
    const numericQuantity = Number(quantity)
    if (!Number.isFinite(numericMinPrice) || !Number.isFinite(numericQuantity)) {
      return res.status(400).json({ error: 'minPrice and quantity must be numbers' })
    }

    const listing = await prisma.listing.create({
      data: {
        crop: name,
        unit: 'kg',
        quantity: numericQuantity,
        minPrice: numericMinPrice,
        farmerName: 'Unknown',
        description: description || null,
      },
    })
    res.status(201).json(listing)
  } catch (err) {
    next(err)
  }
})

app.use((err, _req, res, _next) => {
	console.error(err)
	res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, () => {
	console.log(`API listening on http://localhost:${PORT}`)
})


