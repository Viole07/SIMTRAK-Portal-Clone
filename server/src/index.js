import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import profileRoutes from './routes/profile.js'
import uploadRoutes from './routes/upload.js'
import tasksRoutes from './routes/tasks.js'
import journalsRoutes from './routes/journals.js'
import weeklyRoutes from './routes/weekly.js'
import leavesRoutes from './routes/leaves.js'

const app = express()
const origins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({ origin: origins.length ? origins : true, credentials: true }));
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/journals', journalsRoutes)
app.use('/api/weekly', weeklyRoutes)
app.use('/api/leaves', leavesRoutes)

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT || 4000, () => console.log('API on', process.env.PORT || 4000))
})
