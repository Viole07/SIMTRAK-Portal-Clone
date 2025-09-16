import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, setToken } from "@/lib/api";
import { NotebookPen, CalendarRange, CheckSquare, Plane, User2, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NAV = [
  { to: "/app/dj", label: "Daily", Icon: NotebookPen },
  { to: "/app/weekly", label: "Weekly", Icon: CalendarRange },
  { to: "/app/tasks", label: "Tasks", Icon: CheckSquare },
  { to: "/app/leave", label: "Leave", Icon: Plane },
  { to: "/app/account", label: "Profile", Icon: User2 },
];

export default function Portal() {
  const [me, setMe] = useState(null);
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.get("/auth/me").then(r => setMe(r.data.user)).catch(() => nav("/auth"));
  }, []);

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    setToken(""); // clear auth header
    nav("/auth", { replace: true });
  };

  if (!me) return <div className="grid h-screen place-items-center">Loading…</div>;

  const today = new Date().toLocaleDateString("en-GB");

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r bg-white sticky top-0 h-screen flex flex-col">
        <div className="px-4 py-5 border-b">
          <div className="text-lg font-semibold">SIMTRAK Portal</div>
          <div className="text-xs text-slate-500">Hello, {me.profile?.fullName || me.email}</div>
        </div>

        <nav className="p-3 grid gap-1">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition
                 ${isActive ? "bg-indigo-600 text-white" : "hover:bg-slate-100"}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout at the bottom */}
        <div className="mt-auto p-3 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm bg-red-600 text-white hover:opacity-90 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        {/* Header cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card title="Welcome" value={me.profile?.fullName || me.email} />
          <Card title="Powered By" value="SIMTRAK — Inspiring Growth" />
          <Card title="Today is" value={today} />
        </div>

        {/* Routed content with animation */}
        <div className="mt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl border">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
