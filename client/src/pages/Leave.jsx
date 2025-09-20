import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Leave(){
  const [items,setItems]=useState([]);
  const [form,setForm]=useState({ from:"", joining:"", reason:"", handover:"" });
  const load=async()=> setItems((await api.get("/leaves")).data.items);
  useEffect(()=>{ load(); },[]);
  const submit=async(e)=>{ e.preventDefault(); await api.post("/leaves", form); setForm({ from:"", joining:"", reason:"", handover:"" }); load(); };

  return (
    <div className="space-y-4">
      <div className="card card-pad">
        <h2 className="text-xl font-semibold mb-4">Leave Application</h2>
        <form onSubmit={submit} className="grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <input type="date" className="input" value={form.from} onChange={e=>setForm({...form,from:e.target.value})}/>
            <input type="date" className="input" value={form.joining} onChange={e=>setForm({...form,joining:e.target.value})}/>
          </div>
          <textarea className="textarea" placeholder="Reason for leave" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}/>
          <textarea className="textarea" placeholder="Responsibilities Passed To" value={form.handover} onChange={e=>setForm({...form,handover:e.target.value})}/>
          <button className="btn btn-primary h-8 rounded">Submit</button>
        </form>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>From</th><th>Joining</th><th>Reason</th><th>Handover</th></tr></thead>
            <tbody>
              {items.map(l=>(
                <tr key={l._id}>
                  <td>{new Date(l.from).toISOString().slice(0,10)}</td>
                  <td>{new Date(l.joining).toISOString().slice(0,10)}</td>
                  <td>{l.reason}</td>
                  <td>{l.handover}</td>
                </tr>
              ))}
              {items.length===0 && <tr><td colSpan={4} className="p-4 text-slate-500">No leaves yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
