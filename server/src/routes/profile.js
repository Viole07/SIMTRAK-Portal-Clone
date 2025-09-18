import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { z } from 'zod'

const r = Router()
const auth = (req,res,next)=>{
  const header = req.headers.authorization?.split(' ')[1]
  const token = header || req.cookies?.token
  if (!token) return res.status(401).json({ error: 'no token' })
  try { req.uid = jwt.verify(token, process.env.JWT_SECRET).uid; next() }
  catch { return res.status(401).json({ error: 'bad token' }) }
}

// ainNo & ninNo removed from schema (not user inputs)
const ProfileZ = z.object({
  fullName: z.string().min(1),
  gradDetails: z.string().min(1),
  postGradDetails: z.string().min(1),
  collegeTimings: z.string().min(1),
  workingTimings: z.string().min(1),
  hometown: z.string().min(1),
  hobbies: z.string().min(1),
  skills: z.string().min(1),
  careerPlan: z.string().min(1),
  objective: z.string().min(1),
  hasLaptop: z.string().min(1),
  domain: z.string().min(1),
  joiningDate: z.string().min(1),
  team: z.string().min(1),
  onboardedBy: z.string().min(1),
  academicRequirement: z.string().min(1),
  internshipType: z.string().min(1),
  emailId: z.string().email(),
  expectations: z.string().min(1),
  languagesKnown: z.string().min(1),
  pastInternship: z.string().min(1),
  schoolName: z.string().min(1),
  comfortableTeaching: z.string().min(1),
  weakness: z.string().min(1),
  jobStartWhen: z.string().min(1),
  connectors: z.string().min(1),
  photoUrl: z.string().url().optional()
})

r.post('/upsert', auth, async (req, res) => {
  try {
    const incoming = req.body?.profile ?? req.body; // accept either shape
    const profile = ProfileZ.parse(incoming);       // throws ZodError if any field invalid

    const user = await User.findByIdAndUpdate(
      req.uid,
      { $set: { profile } },
      { new: true }
    );

    return res.json({ user });
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Send a compact list of offending fields back to the client
      return res.status(400).json({
        error: 'validation_failed',
        issues: err.issues.map(i => ({
          path: i.path.join('.'),
          message: i.message
        }))
      });
    }
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
});

export default r
