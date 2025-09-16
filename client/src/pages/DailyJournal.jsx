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
    if (!form.taskId) return alert("Create a task first.");
    await api.post("/journals", { ...form, timeMin: Number(form.timeMin||0) });
    setForm(f=>({ ...f, taskNote:"", learnings:"", timeMin:"" }));
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Upload Daily Journal</h2>
      {tasks.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded">No tasks yet. Create one in Tasks, then come back.</div>
      ) : (
        <form onSubmit={submit} className="grid gap-2 bg-white p-3 rounded-xl border mb-4">
          <div className="grid md:grid-cols-2 gap-2">
            <input className="border rounded p-2" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/>
            <select className="border rounded p-2" value={form.taskId} onChange={e=>setForm({...form, taskId:e.target.value})}>
              {tasks.map(t=><option key={t.taskId} value={t.taskId}>{t.name} ({t.taskId})</option>)}
            </select>
          </div>
          <input className="border rounded p-2" placeholder="Task done today (links allowed)" value={form.taskNote} onChange={e=>setForm({...form, taskNote:e.target.value})}/>
          <textarea className="border rounded p-2" placeholder="Learnings" value={form.learnings} onChange={e=>setForm({...form, learnings:e.target.value})}/>
          <div className="grid md:grid-cols-2 gap-2">
            <select className="border rounded p-2" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
              <option>Ongoing</option><option>Completed</option>
            </select>
            <input className="border rounded p-2" placeholder="Time taken (minutes)" value={form.timeMin} onChange={e=>setForm({...form, timeMin:e.target.value})}/>
          </div>
          <button className="bg-indigo-600 text-white rounded p-2">Submit DJ</button>
        </form>
      )}

      <div className="overflow-x-auto bg-white rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500"><tr>
            <th className="p-2">Date</th><th className="p-2">Task</th><th className="p-2">Note</th><th className="p-2">Learnings</th><th className="p-2">Status</th><th className="p-2">Time</th>
          </tr></thead>
          <tbody>
            {items.map(j=>(
              <tr key={j._id} className="border-t">
                <td className="p-2">{new Date(j.date).toISOString().slice(0,10)}</td>
                <td className="p-2">{j.taskId}</td>
                <td className="p-2">{j.taskNote}</td>
                <td className="p-2">{j.learnings}</td>
                <td className="p-2">{j.status}</td>
                <td className="p-2">{j.timeMin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
