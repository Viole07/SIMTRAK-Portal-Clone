import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Tasks(){
  const [items,setItems] = useState([]);
  const [form,setForm] = useState({ name:"", deadline:"", assignedBy:"Self" });
  const load = async()=> setItems((await api.get("/tasks")).data.items);
  useEffect(()=>{ load(); },[]);

  const add = async(e)=>{ e.preventDefault(); await api.post("/tasks", form); setForm({ name:"", deadline:"", assignedBy:"Self" }); load(); };
  const done = async(id)=>{ await api.patch(`/tasks/${id}`, { status:"Done" }); load(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">My Tasks</h2>
      </div>
      <form onSubmit={add} className="grid md:grid-cols-3 gap-2 bg-white p-3 rounded-xl border mb-4">
        <input className="border rounded p-2" placeholder="Task name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
        <input className="border rounded p-2" type="date" value={form.deadline} onChange={e=>setForm({...form, deadline:e.target.value})}/>
        <button className="bg-indigo-600 text-white rounded p-2">Add Task</button>
      </form>
      <div className="overflow-x-auto bg-white rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr><th className="p-2">Task ID</th><th className="p-2">Name</th><th className="p-2">Status</th><th className="p-2">Deadline</th><th className="p-2">Actions</th></tr>
          </thead>
          <tbody>
            {items.map(t=>(
              <tr key={t._id} className="border-t">
                <td className="p-2">{t.taskId}</td>
                <td className="p-2">{t.name}</td>
                <td className="p-2">{t.status}</td>
                <td className="p-2">{t.deadline ? new Date(t.deadline).toISOString().slice(0,10) : "—"}</td>
                <td className="p-2"><button onClick={()=>done(t._id)} className="px-2 py-1 bg-slate-200 rounded">Mark Done</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
