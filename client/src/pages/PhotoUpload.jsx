import { useState } from 'react'
import { api } from '@/lib/api'

export default function PhotoUpload(){
  const [preview,setPreview] = useState('')
  const [busy,setBusy] = useState(false)

  const upload = async (file) => {
    try {
      setBusy(true)
      const fd = new FormData()
      fd.append('file', file)
      const { data } = await api.post('/upload/photo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setPreview(data.url)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid place-items-center h-screen">
      <div className="bg-white p-6 rounded-2xl shadow w-full max-w-md text-center">
        <h1 className="text-xl font-semibold mb-3">Upload Profile Photo</h1>
        <input
          type="file"
          accept="image/*"
          onChange={e=> e.target.files?.[0] && upload(e.target.files[0])}
          className="block w-full border rounded p-2"
        />
        <p className="text-xs text-slate-500 mt-2">Max 5MB, jpg/png/webp.</p>
        {busy && <p className="mt-3">Uploading...</p>}
        {preview && <img src={preview} alt="" className="mt-4 w-40 h-40 object-cover rounded-full mx-auto" />}
      </div>
    </div>
  )
}
