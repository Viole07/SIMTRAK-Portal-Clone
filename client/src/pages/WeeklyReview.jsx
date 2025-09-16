import { useEffect, useState } from "react";
import { api } from "@/lib/api";

function weekBounds(d=new Date()) {
  const day = d.getDay();              // Sun=0
  const monday = new Date(d); monday.setDate(d.getDate() - ((day+6)%7));
  const sunday = new Date(monday); sunday.setDate(monday.getDate()+6);
  const toISO = x => x.toISOString().slice(0,10);
  return { start: toISO(monday), end: toISO(sunday) };
}

export default function WeeklyReview(){
  const [items,setItems] = useState([]);
  const [form,setForm] = useState({ weekStart: weekBounds().start, weekEnd: weekBounds().end, summary:"" });
  const load = async()=> setItems((await api.get("/weekly")).data.items);
  useEffect(()=>{ load(); },[]);

  const submit = async(e)=>{ e.preventDefault(); await api.post("/weekly", form); setForm({ ...form, summary:"" }); load(); };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Weekly Review</h2>
      <form onSubmit={submit} className="grid gap-2 bg-white p-3 rounded-xl border mb-4">
        <div className="grid md:grid-cols-2 gap-2">
          <input className="border rounded p-2" type="date" value={form.weekStart} onChange={e=>setForm({...form, weekStart:e.target.value})}/>
          <input className="border rounded p-2" type="date" value={form.weekEnd} onChange={e=>setForm({...form, weekEnd:e.target.value})}/>
        </div>
        <textarea className="border rounded p-2" rows={5} placeholder="Highlights, blockers, next week plan" value={form.summary} onChange={e=>setForm({...form, summary:e.target.value})}/>
        <button className="bg-indigo-600 text-white rounded p-2">Submit Weekly Review</button>
      </form>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {items.map(w=>(
          <div key={w._id} className="bg-white rounded-xl border p-3">
            <div className="text-sm font-semibold">{w.stamp}</div>
            <div className="text-xs text-slate-500 mb-2">{new Date(w.weekStart).toISOString().slice(0,10)} – {new Date(w.weekEnd).toISOString().slice(0,10)}</div>
            <div className="text-sm">{w.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
