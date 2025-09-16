import { useState } from 'react'
import { api, setToken } from '@/lib/api'

const REQUIRED_KEYS = [
  'fullName','gradDetails','postGradDetails','collegeTimings','workingTimings',
  'hometown','hobbies','skills','careerPlan','objective','hasLaptop','domain',
  'joiningDate','team','onboardedBy','academicRequirement','internshipType',
  'emailId','expectations','languagesKnown','pastInternship','schoolName',
  'comfortableTeaching','weakness','jobStartWhen','connectors'
];

function isProfileComplete(profile) {
  if (!profile) return false;
  return REQUIRED_KEYS.every(
    k => profile[k] !== undefined && String(profile[k]).trim() !== ''
  );
}

export default function Auth(){
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await api.post(`/auth/${mode}`, { email, password });
      setToken(data.token);

      // fetch current user to decide where to go
      const me = (await api.get('/auth/me')).data.user;
      const prof = me?.profile;

      if (!isProfileComplete(prof)) {
        window.location.href = '/profile';
      } else if (!prof?.photoUrl) {
        window.location.href = '/photo';
      } else {
        window.location.href = '/app/account';
      }
    } catch (e) {
      setErr(e?.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-6 rounded-2xl shadow">
        <h1 className="text-xl font-semibold mb-4">{mode === 'login' ? 'Login' : 'Register'}</h1>

        {err && <div className="mb-3 text-sm text-red-600">{err}</div>}

        <input className="w-full border rounded p-2 mb-2"
               placeholder="Email"
               value={email}
               onChange={e=>setEmail(e.target.value)} />

        <input className="w-full border rounded p-2 mb-4"
               type="password"
               placeholder="Password"
               value={password}
               onChange={e=>setPassword(e.target.value)} />

        <button className="w-full bg-indigo-600 text-white rounded p-2">
          Continue
        </button>

        <p className="text-sm text-center mt-3">
          {mode==='login'
            ? <>No account? <button type="button" className="text-indigo-600" onClick={()=>setMode('register')}>Register</button></>
            : <>Have an account? <button type="button" className="text-indigo-600" onClick={()=>setMode('login')}>Login</button></>}
        </p>
      </form>
    </div>
  );
}
