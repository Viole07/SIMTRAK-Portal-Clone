import { Router } from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import cloudinary from '../lib/cloudinary.js'
import User from '../models/User.js'

const r = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})

const auth = (req, res, next) => {
  const header = req.headers.authorization?.split(' ')[1]
  const token = header || req.cookies?.token
  if (!token) return res.status(401).json({ error: 'no token' })
  try { req.uid = jwt.verify(token, process.env.JWT_SECRET).uid; next() }
  catch { return res.status(401).json({ error: 'bad token' }) }
}

// POST /api/upload/photo  (multipart/form-data with field: "file")
r.post('/photo', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'no file' })
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: process.env.CLOUDINARY_FOLDER || 'simtrak',
      overwrite: true,
      invalidate: true
    })
    await User.findByIdAndUpdate(req.uid, { 'profile.photoUrl': result.secure_url })
    return res.json({ url: result.secure_url })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'upload_failed' })
  }
})

export default r
