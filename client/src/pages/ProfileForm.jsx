import { useState } from 'react'
import { api } from '@/lib/api'
import { useNavigate } from 'react-router-dom'

// AIN & NIN removed from inputs
const FIELDS = [
  ['fullName','Full Name'],
  ['gradDetails','Graduation Details (College, City, Course, Year)'],
  ['postGradDetails','Post Graduation Details (College, City, Course, Year)'],
  ['collegeTimings','College timings'],
  ['workingTimings','Working timings'],
  ['hometown','City you belong from'],
  ['hobbies','Hobbies'],
  ['skills','Special skills/activities'],
  ['careerPlan','Career plan'],
  ['objective','Objective behind joining'],
  ['hasLaptop','Do you have a Laptop (yes/no)'],
  ['domain','Domain'],
  ['joiningDate','Joining date (YYYY-MM-DD)'],
  ['team','Team'],
  ['onboardedBy','Onboarded by'],
  ['academicRequirement','Is Internship part of Academic Requirement (Yes/No)'],
  ['internshipType','Type of Internship (Intense Learning / Mediocre Learning)'],
  ['emailId','Email id'],
  ['expectations','Expectations from this internship'],
  ['languagesKnown','Languages known'],
  ['pastInternship','Past internship details'],
  ['schoolName','Name of School'],
  ['comfortableTeaching','Comfortable conducting sessions for children'],
  ['weakness','Weakness'],
  ['jobStartWhen','When do you want to start applying for Jobs'],
  ['connectors','Which can you connect (College/School/Friends/Senior Professionals)'],
]

export default function ProfileForm(){
  const [form,setForm] = useState(Object.fromEntries(FIELDS.map(([k])=>[k,''])))
  const nav = useNavigate()
  const submit = async (e)=>{
    e.preventDefault()
    await api.post('/profile/upsert', { profile: form })
    nav('/photo')
  }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Complete your Profile</h1>
      <form onSubmit={submit} className="grid gap-3">
        {FIELDS.map(([k,label])=>(
          <div key={k} className="grid gap-1">
            <label className="text-sm font-medium">{label}</label>
            <input
              className="border rounded p-2"
              value={form[k]}
              onChange={e=>setForm(s=>({ ...s, [k]: e.target.value }))}
              required
              type={k==='joiningDate' ? 'date' : 'text'}
            />
          </div>
        ))}
        <button className="mt-2 bg-indigo-600 text-white rounded p-2">Save & Continue</button>
      </form>
    </div>
  )
}
