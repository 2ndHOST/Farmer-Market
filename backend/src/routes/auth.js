import { Router } from 'express'
import jwt from 'jsonwebtoken'
import twilio from 'twilio'
import { prisma } from '../util/prisma.js'

const router = Router()

const {
	TWILIO_ACCOUNT_SID,
	TWILIO_AUTH_TOKEN,
	TWILIO_VERIFY_SERVICE_SID,
	TWILIO_MESSAGING_FROM,
	TWILIO_MESSAGING_SERVICE_SID,
	JWT_SECRET = 'dev_secret_change_me',
} = process.env

const twilioClient = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN
	? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
	: null

function createJwtToken(payload) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

router.post('/send-otp', async (req, res, next) => {
	try {
		const { phone } = req.body
		if (!phone) return res.status(400).json({ error: 'phone is required' })

		// Prefer Messaging (custom) if configured, else use Verify
		if (twilioClient && (TWILIO_MESSAGING_FROM || TWILIO_MESSAGING_SERVICE_SID)) {
			const code = String(Math.floor(100000 + Math.random() * 900000))
			const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
			await prisma.otpCode.create({ data: { phone, code, expiresAt } })

			await twilioClient.messages.create({
				to: phone,
				from: TWILIO_MESSAGING_FROM,
				messagingServiceSid: TWILIO_MESSAGING_SERVICE_SID || undefined,
				body: `Your verification code is ${code}`,
			})

			return res.json({ ok: true, mode: 'custom' })
		}

		if (twilioClient && TWILIO_VERIFY_SERVICE_SID) {
			await twilioClient.verify.v2.services(TWILIO_VERIFY_SERVICE_SID)
				.verifications.create({ to: phone, channel: 'sms' })
			return res.json({ ok: true, mode: 'verify' })
		}

		return res.status(500).json({ error: 'Twilio not configured' })
	} catch (e) { next(e) }
})

router.post('/verify-otp', async (req, res, next) => {
	try {
		const { phone, code, name } = req.body
		if (!phone || !code) return res.status(400).json({ error: 'phone and code are required' })

		let approved = false
		// Prefer custom verification if Messaging configured
		if (twilioClient && (TWILIO_MESSAGING_FROM || TWILIO_MESSAGING_SERVICE_SID)) {
			const now = new Date()
			const otp = await prisma.otpCode.findFirst({
				where: { phone, code, expiresAt: { gt: now }, consumedAt: null },
				orderBy: { createdAt: 'desc' },
			})
			approved = !!otp
			if (otp) {
				await prisma.otpCode.update({ where: { id: otp.id }, data: { consumedAt: now } })
			}
		} else if (twilioClient && TWILIO_VERIFY_SERVICE_SID) {
			const result = await twilioClient.verify.v2.services(TWILIO_VERIFY_SERVICE_SID)
				.verificationChecks.create({ to: phone, code })
			approved = result.status === 'approved'
		}

		if (!approved) return res.status(400).json({ error: 'Invalid code' })

		let user = await prisma.user.findUnique({ where: { phone } })
		if (!user) {
			user = await prisma.user.create({ data: { phone, name: name || null } })
		} else if (name && !user.name) {
			user = await prisma.user.update({ where: { id: user.id }, data: { name } })
		}

		const token = createJwtToken({ sub: user.id, phone: user.phone, role: user.role })
		res.json({ token, user: { id: user.id, phone: user.phone, name: user.name, role: user.role } })
	} catch (e) { next(e) }
})

export default router


