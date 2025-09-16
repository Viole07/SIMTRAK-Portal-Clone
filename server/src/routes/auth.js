import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

const r = Router()
const sign = (uid) => jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: '7d' })
const setCookie = (res, token) =>
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7*24*3600*1000 })

// helper: generate unique 5-digit NIN
async function generateUniqueNIN() {
  while (true) {
    const nin = String(Math.floor(10000 + Math.random() * 90000))
    const exists = await User.exists({ ninNo: nin })
    if (!exists) return nin
  }
}

r.post('/register', async (req,res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email & password required' })
  const exists = await User.findOne({ email })
  if (exists) return res.status(409).json({ error: 'email already registered' })

  const passwordHash = await bcrypt.hash(password, 10)
  const ninNo = await generateUniqueNIN()
  const user = await User.create({ email, passwordHash, ninNo }) // status stays pending_approval

  const token = sign(user._id)
  setCookie(res, token)
  res.json({ token, status: user.status, ninNo: user.ninNo })
})

r.post('/login', async (req,res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ error: 'invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash || '')
  if (!ok) return res.status(401).json({ error: 'invalid credentials' })
  const token = sign(user._id)
  setCookie(res, token)
  res.json({ token, status: user.status, ninNo: user.ninNo })
})

r.post('/logout', (req,res) => { res.clearCookie('token'); res.json({ ok: true }) })

r.get('/me', async (req,res) => {
  const header = req.headers.authorization?.split(' ')[1]
  const token = header || req.cookies?.token
  if (!token) return res.status(401).json({ error: 'no token' })
  const { uid } = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(uid)
  res.json({ user })
})

export default r
