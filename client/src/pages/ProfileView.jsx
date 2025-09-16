import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { CheckSquare, NotebookPen, CalendarRange, Plane } from "lucide-react";

const fmtDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d)) return v;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export default function ProfileView() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [journals, setJournals] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    (async () => {
      const [me, t, j, w, l] = await Promise.all([
        api.get("/auth/me"),
        api.get("/tasks"),
        api.get("/journals"),
        api.get("/weekly"),
        api.get("/leaves"),
      ]);
      setUser(me.data.user);
      setTasks(t.data.items || []);
      setJournals(j.data.items || []);
      setWeekly(w.data.items || []);
      setLeaves(l.data.items || []);
    })();
  }, []);

  if (!user) return <div className="grid h-[60vh] place-items-center">Loading…</div>;

  const p = user.profile || {};
  const taskDone = tasks.filter((t) => t.status === "Done").length;
  const taskOngoing = tasks.length - taskDone;

  return (
    <div className="max-w-6xl mx-auto p-0 md:p-2">
      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{p.fullName || user.email}</h1>
          <p className="text-sm text-slate-500 mt-1">
            NIN: <b>{user.ninNo || "—"}</b> · Status: <b>{user.status}</b>
          </p>
        </div>
        <aside className="w-56">
          <div className="bg-white p-4 rounded-xl shadow border">
            <img
              src={p.photoUrl || "https://via.placeholder.com/400x400?text=No+Photo"}
              alt=""
              className="w-full aspect-square object-cover rounded-lg"
            />
          </div>
          <div className="mt-3 grid gap-2">
            <Link to="/profile" className="block text-center bg-slate-200 rounded p-2">Edit Profile</Link>
            <Link to="/photo" className="block text-center bg-slate-200 rounded p-2">Update Photo</Link>
          </div>
        </aside>
      </div>

      {/* Summary stats */}
      <div className="grid md:grid-cols-4 gap-3 mt-5">
        <StatCard
          title="Tasks"
          value={`${tasks.length}`}
          sub={`${taskOngoing} ongoing · ${taskDone} done`}
          Icon={CheckSquare}
          to="/app/tasks"
        />
        <StatCard
          title="Daily Journals"
          value={`${journals.length}`}
          sub="Last 5 shown"
          Icon={NotebookPen}
          to="/app/dj"
        />
        <StatCard
          title="Weekly Reviews"
          value={`${weekly.length}`}
          sub="Last 5 shown"
          Icon={CalendarRange}
          to="/app/weekly"
        />
        <StatCard
          title="Leaves"
          value={`${leaves.length}`}
          sub="History"
          Icon={Plane}
          to="/app/leave"
        />
      </div>

      {/* Profile details */}
      <div className="grid md:grid-cols-2 gap-4 mt-5 bg-white p-6 rounded-xl shadow border">
        {[
          ["Email", p.emailId],
          ["Graduation Details", p.gradDetails],
          ["Post Graduation Details", p.postGradDetails],
          ["College timings", p.collegeTimings],
          ["Working timings", p.workingTimings],
          ["Hometown", p.hometown],
          ["Hobbies", p.hobbies],
          ["Special skills/activities", p.skills],
          ["Career plan", p.careerPlan],
          ["Objective behind joining", p.objective],
          ["Has Laptop", p.hasLaptop],
          ["Domain", p.domain],
          ["Joining date", fmtDate(p.joiningDate)],
          ["Team", p.team],
          ["Onboarded by", p.onboardedBy],
          ["Academic Requirement", p.academicRequirement],
          ["Internship Type", p.internshipType],
          ["Expectations", p.expectations],
          ["Languages known", p.languagesKnown],
          ["Past internship", p.pastInternship],
          ["School", p.schoolName],
          ["Comfortable teaching", p.comfortableTeaching],
          ["Weakness", p.weakness],
          ["Job start (when)", p.jobStartWhen],
          ["Connectors", p.connectors],
        ].map(([label, val]) => (
          <div key={label}>
            <div className="text-xs uppercase text-slate-500">{label}</div>
            <div className="font-medium">{val || "—"}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid xl:grid-cols-2 gap-4 mt-5">
        <MiniTable
          title="Recent Tasks"
          to="/app/tasks"
          columns={["Date", "Task", "Status", "Deadline"]}
          rows={tasks.slice(0, 5).map((t) => [
            fmtDate(t.createdAt || t.date),
            `${t.name} (${t.taskId})`,
            t.status,
            t.deadline ? fmtDate(t.deadline) : "—",
          ])}
        />
        <MiniTable
          title="Recent Daily Journals"
          to="/app/dj"
          columns={["Date", "Task", "Status", "Time (min)"]}
          rows={journals.slice(0, 5).map((j) => [
            fmtDate(j.date),
            j.taskId,
            j.status,
            String(j.timeMin ?? ""),
          ])}
        />
        <MiniTable
          title="Recent Weekly Reviews"
          to="/app/weekly"
          columns={["Range", "Status"]}
          rows={weekly.slice(0, 5).map((w) => [
            `${fmtDate(w.weekStart)} – ${fmtDate(w.weekEnd)}`,
            w.status,
          ])}
        />
        <MiniTable
          title="Recent Leaves"
          to="/app/leave"
          columns={["From", "Joining", "Reason"]}
          rows={leaves.slice(0, 5).map((l) => [
            fmtDate(l.from),
            fmtDate(l.joining),
            l.reason?.slice(0, 40) + (l.reason?.length > 40 ? "…" : ""),
          ])}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, Icon, to }) {
  return (
    <Link to={to} className="bg-white p-4 rounded-xl shadow border hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-100">
          <Icon size={18} />
        </div>
        <div>
          <div className="text-xs uppercase text-slate-500">{title}</div>
          <div className="text-lg font-semibold">{value}</div>
          <div className="text-xs text-slate-500">{sub}</div>
        </div>
      </div>
    </Link>
  );
}

function MiniTable({ title, to, columns, rows }) {
  return (
    <div className="bg-white rounded-xl shadow border">
      <div className="flex items-center justify-between p-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Link to={to} className="text-xs text-indigo-600">Open</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>{columns.map((c) => <th key={c} className="p-2">{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td className="p-3 text-slate-400" colSpan={columns.length}>No data</td></tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i} className="border-t">
                  {r.map((cell, j) => <td key={j} className="p-2">{cell}</td>)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
