import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Leave(){
  const [items,setItems] = useState([]);
  const [form,setForm] = useState({ from:"", joining:"", reason:"", handover:"" });
  const load = async()=> setItems((await api.get("/leaves")).data.items);
  useEffect(()=>{ load(); },[]);

  const submit = async(e)=>{ e.preventDefault(); await api.post("/leaves", form); setForm({ from:"", joining:"", reason:"", handover:"" }); load(); };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Leave Application</h2>
      <form onSubmit={submit} className="grid gap-2 bg-white p-3 rounded-xl border mb-4">
        <input className="border rounded p-2" type="date" value={form.from} onChange={e=>setForm({...form, from:e.target.value})}/>
        <input className="border rounded p-2" type="date" value={form.joining} onChange={e=>setForm({...form, joining:e.target.value})}/>
        <textarea className="border rounded p-2" placeholder="Reason for leave" value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})}/>
        <textarea className="border rounded p-2" placeholder="Responsibilities Passed To" value={form.handover} onChange={e=>setForm({...form, handover:e.target.value})}/>
        <button className="bg-indigo-600 text-white rounded p-2">Submit</button>
      </form>

      <div className="overflow-x-auto bg-white rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500"><tr>
            <th className="p-2">From</th><th className="p-2">Joining</th><th className="p-2">Reason</th><th className="p-2">Handover</th>
          </tr></thead>
          <tbody>
            {items.map(l=>(
              <tr key={l._id} className="border-t">
                <td className="p-2">{new Date(l.from).toISOString().slice(0,10)}</td>
                <td className="p-2">{new Date(l.joining).toISOString().slice(0,10)}</td>
                <td className="p-2">{l.reason}</td>
                <td className="p-2">{l.handover}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
