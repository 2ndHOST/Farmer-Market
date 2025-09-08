import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import listingsRouter from './routes/listings.js'
import bidsRouter from './routes/bids.js'
import authRouter from './routes/auth.js'

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

app.use((err, _req, res, _next) => {
	console.error(err)
	res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, () => {
	console.log(`API listening on http://localhost:${PORT}`)
})


