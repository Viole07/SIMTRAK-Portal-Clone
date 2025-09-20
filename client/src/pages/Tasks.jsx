import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Tasks(){
  const [items,setItems] = useState([]);
  const [form,setForm] = useState({ name:"", deadline:"" });
  const load = async()=> setItems((await api.get("/tasks")).data.items);
  useEffect(()=>{ load(); },[]);
  const add = async(e)=>{ e.preventDefault(); await api.post("/tasks", { ...form }); setForm({ name:"", deadline:"" }); load(); };
  const done = async(id)=>{ await api.patch(`/tasks/${id}`, { status:"Done" }); load(); };

  return (
    <div className="space-y-4">
      <div className="card card-pad">
        <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
        <form onSubmit={add} className="grid md:grid-cols-[1fr,220px,140px] gap-3">
          <input className="input" placeholder="Task name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
          <input className="input" type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} required/>
          <button className="btn btn-primary h-8 rounded">Add Task</button>
        </form>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>Task ID</th><th>Name</th><th>Status</th><th>Deadline</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(t=>(
                <tr key={t._id}>
                  <td>{t.taskId}</td>
                  <td>{t.name}</td>
                  <td>
  {t.status === "Done"
    ? <span className="badge-ok">Done</span>
    : <span className="badge-warn">Ongoing</span>}
</td>
                  <td>{t.deadline ? new Date(t.deadline).toISOString().slice(0,10) : "—"}</td>
                  <td>
  <button onClick={() => done(t._id)} className="btn-chip">
    Mark Done
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
