import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function DailyJournal(){
  const [tasks,setTasks] = useState([]);
  const [items,setItems] = useState([]);
  const [form,setForm] = useState({ date:"", taskId:"", taskNote:"", learnings:"", status:"Ongoing", timeMin:"" });

  const load = async()=>{
    const ts = (await api.get("/tasks")).data.items;
    setTasks(ts);
    setForm(s=>({ ...s, date: new Date().toISOString().slice(0,10), taskId: ts[0]?.taskId || "" }));
    setItems((await api.get("/journals")).data.items);
  };
  useEffect(()=>{ load(); },[]);

  const submit = async(e)=>{
    e.preventDefault();
    if(!form.taskId) return alert("Create a task first.");
    await api.post("/journals", { ...form, timeMin: Number(form.timeMin||0) });
    setForm(f=>({ ...f, taskNote:"", learnings:"", timeMin:"" })); load();
  };

  return (
    <div className="space-y-4">
      <div className="card card-pad">
        <h2 className="text-xl font-semibold mb-4">Upload Daily Journal</h2>
        {tasks.length===0 ? (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">No tasks yet. Create one in Tasks, then come back.</div>
        ):(
          <form onSubmit={submit} className="grid gap-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input type="date" className="input" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
              <select className="select" value={form.taskId} onChange={e=>setForm({...form,taskId:e.target.value})}>
                {tasks.map(t=><option key={t.taskId} value={t.taskId}>{t.name} ({t.taskId})</option>)}
              </select>
            </div>
            <input className="input" placeholder="Task done today (links allowed)" value={form.taskNote} onChange={e=>setForm({...form,taskNote:e.target.value})}/>
            <textarea className="textarea" placeholder="Learnings" value={form.learnings} onChange={e=>setForm({...form,learnings:e.target.value})}/>
            <div className="grid md:grid-cols-2 gap-3">
              <select className="select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                <option>Ongoing</option><option>Completed</option>
              </select>
              <input className="input" placeholder="Time taken (minutes)" value={form.timeMin} onChange={e=>setForm({...form,timeMin:e.target.value})}/>
            </div>
            <button className="btn-primary">Submit DJ</button>
          </form>
        )}
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr>
              <th>Date</th><th>Task</th><th>Note</th><th>Learnings</th><th>Status</th><th>Time</th>
            </tr></thead>
            <tbody>
              {items.map(j=>(
                <tr key={j._id}>
                  <td>{new Date(j.date).toISOString().slice(0,10)}</td>
                  <td>{j.taskId}</td>
                  <td>{j.taskNote}</td>
                  <td>{j.learnings}</td>
                  <td>{j.status==="Completed" ? <span className="badge-ok">Completed</span> : <span className="badge-mute">Ongoing</span>}</td>
                  <td>{j.timeMin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
