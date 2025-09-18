import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { CheckSquare, NotebookPen, CalendarRange, Plane } from "lucide-react";

const fmt = v =>
  v ? new Date(v).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—";

export default function ProfileView(){
  const [user,setUser]=useState(null);
  const [tasks,setTasks]=useState([]); const [journals,setJournals]=useState([]);
  const [weekly,setWeekly]=useState([]); const [leaves,setLeaves]=useState([]);

  useEffect(()=>{ (async()=>{
    const [me,t,j,w,l]=await Promise.all([
      api.get("/auth/me"),
      api.get("/tasks"),
      api.get("/journals"),
      api.get("/weekly"),
      api.get("/leaves")
    ]);
    setUser(me.data.user);
    setTasks(t.data.items||[]);
    setJournals(j.data.items||[]);
    setWeekly(w.data.items||[]);
    setLeaves(l.data.items||[]);
  })() },[]);

  if(!user) return <div className="grid h-[40vh] place-items-center">Loading…</div>;

  const p=user.profile||{};
  const done=tasks.filter(x=>x.status==="Done").length;
  const ongoing=tasks.length-done;

  return (
    <div className="space-y-5">
      {/* Top block with photo */}
      <div className="card card-pad card-hover">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <div className="text-2xl font-semibold">{p.fullName || user.email}</div>
            <div className="text-sm text-slate-500 mt-1">
              NIN: <b>{user.ninNo||"—"}</b> · Status: <b>{user.status}</b>
            </div>

            <div className="grid md:grid-cols-4 gap-3 mt-5">
              <Stat title="Tasks" value={String(tasks.length)} sub={`${ongoing} ongoing · ${done} done`} Icon={CheckSquare} to="/app/tasks"/>
              <Stat title="Daily Journals" value={String(journals.length)} sub="Last 5 shown" Icon={NotebookPen} to="/app/dj"/>
              <Stat title="Weekly Reviews" value={String(weekly.length)} sub="Last 5 shown" Icon={CalendarRange} to="/app/weekly"/>
              <Stat title="Leaves" value={String(leaves.length)} sub="History" Icon={Plane} to="/app/leave"/>
            </div>
          </div>

          {/* Photo panel with hover zoom */}
          <aside className="w-56">
            <div className="group rounded-2xl overflow-hidden border shadow-sm card-hover">
              <img
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                src={p.photoUrl || "https://via.placeholder.com/400x400?text=No+Photo"}
                alt="Profile"
              />
            </div>
            <div className="mt-3 grid gap-2">
              <Link to="/profile" className="btn-ghost text-center pressable">Edit Profile</Link>
              <Link to="/photo" className="btn-ghost text-center pressable">Update Photo</Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Details */}
      <div className="card card-pad card-hover">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ["Email", p.emailId], ["Graduation Details", p.gradDetails], ["Post Graduation Details", p.postGradDetails],
            ["College timings", p.collegeTimings], ["Working timings", p.workingTimings], ["Hometown", p.hometown],
            ["Hobbies", p.hobbies], ["Special skills/activities", p.skills], ["Career plan", p.careerPlan],
            ["Objective behind joining", p.objective], ["Has Laptop", p.hasLaptop], ["Domain", p.domain],
            ["Joining date", fmt(p.joiningDate)], ["Team", p.team], ["Onboarded by", p.onboardedBy],
            ["Academic Requirement", p.academicRequirement], ["Internship Type", p.internshipType],
            ["Expectations", p.expectations], ["Languages known", p.languagesKnown], ["Past internship", p.pastInternship],
            ["School", p.schoolName], ["Comfortable teaching", p.comfortableTeaching], ["Weakness", p.weakness],
            ["Job start (when)", p.jobStartWhen], ["Connectors", p.connectors],
          ].map(([k,v])=>(
            <div key={k}>
              <div className="text-xs uppercase text-slate-500">{k}</div>
              <div className="font-medium">{v || "—"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recents */}
      <div className="grid xl:grid-cols-2 gap-4">
        <Mini
          title="Recent Tasks" to="/app/tasks"
          cols={["Date","Task","Status","Deadline"]}
          rows={tasks.slice(0,5).map(t=>[fmt(t.createdAt||t.date), `${t.name} (${t.taskId})`, t.status, t.deadline?fmt(t.deadline):"—"])}
        />
        <Mini
          title="Recent Daily Journals" to="/app/dj"
          cols={["Date","Task","Status","Time (min)"]}
          rows={journals.slice(0,5).map(j=>[fmt(j.date), j.taskId, j.status, String(j.timeMin??"")])}
        />
        <Mini
          title="Recent Weekly Reviews" to="/app/weekly"
          cols={["Range","Status"]}
          rows={weekly.slice(0,5).map(w=>[`${fmt(w.weekStart)} – ${fmt(w.weekEnd)}`, w.status])}
        />
        <Mini
          title="Recent Leaves" to="/app/leave"
          cols={["From","Joining","Reason"]}
          rows={leaves.slice(0,5).map(l=>[fmt(l.from), fmt(l.joining), (l.reason||"").slice(0,40)+(l.reason?.length>40?"…":"")])}
        />
      </div>
    </div>
  );
}

function Stat({title,value,sub,Icon,to}){
  return (
    <Link to={to} className="group card card-pad card-hover pressable block">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
          <Icon size={18}/>
        </div>
        <div>
          <div className="text-xs uppercase text-slate-500">{title}</div>
          <div className="text-lg font-semibold transition-transform duration-200 group-hover:translate-x-0.5">
            {value}
          </div>
          <div className="text-xs text-slate-500">{sub}</div>
        </div>
      </div>
    </Link>
  );
}

function Mini({title,to,cols,rows}){
  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between p-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Link to={to} className="text-xs text-indigo-600 pressable">Open</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead><tr>{cols.map(c=><th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.length ? (
              rows.map((r,i)=>(
                <tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>
              ))
            ) : (
              <tr><td className="p-4 text-slate-500" colSpan={cols.length}>No data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
