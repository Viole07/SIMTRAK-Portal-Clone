import { useEffect, useState } from "react";
import { api } from "@/lib/api";

function weekBounds(d=new Date()){
  const day=d.getDay(), mon=new Date(d); mon.setDate(d.getDate()-((day+6)%7));
  const sun=new Date(mon); sun.setDate(mon.getDate()+6);
  const toISO=x=>x.toISOString().slice(0,10);
  return { start: toISO(mon), end: toISO(sun) };
}

export default function WeeklyReview(){
  const [items,setItems]=useState([]);
  const [form,setForm]=useState({ weekStart: weekBounds().start, weekEnd: weekBounds().end, summary:"" });
  const load=async()=> setItems((await api.get("/weekly")).data.items);
  useEffect(()=>{ load(); },[]);
  const submit=async(e)=>{ e.preventDefault(); await api.post("/weekly", form); setForm(s=>({ ...s, summary:"" })); load(); };

  return (
    <div className="space-y-4">
      <div className="card card-pad">
        <h2 className="text-xl font-semibold mb-4">Weekly Review</h2>
        <form onSubmit={submit} className="grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <input type="date" className="input" value={form.weekStart} onChange={e=>setForm({...form,weekStart:e.target.value})}/>
            <input type="date" className="input" value={form.weekEnd} onChange={e=>setForm({...form,weekEnd:e.target.value})}/>
          </div>
          <textarea className="textarea" rows={6} placeholder="Highlights, blockers, next week plan"
            value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})}/>
          <button className="btn-primary h-8 rounded">Submit Weekly Review</button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(w=>(
          <div key={w._id} className="card card-pad">
            <div className="text-xs text-slate-500">{new Date(w.weekStart).toISOString().slice(0,10)} – {new Date(w.weekEnd).toISOString().slice(0,10)}</div>
            <div className="mt-1">{w.summary}</div>
            <div className="mt-2">{w.status==="Submitted" ? <span className="badge-mute">Submitted</span> : <span className="badge-ok">{w.status}</span>}</div>
          </div>
        ))}
        {items.length===0 && <div className="text-slate-500">No reviews yet.</div>}
      </div>
    </div>
  );
}
