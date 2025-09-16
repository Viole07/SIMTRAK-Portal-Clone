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

export default function Portal(){
  const [me,setMe] = useState(null);
  const nav = useNavigate();
  const location = useLocation();

  useEffect(()=>{ api.get("/auth/me").then(r=>setMe(r.data.user)).catch(()=>nav("/auth")); },[]);

  const logout = async ()=>{
    await api.post("/auth/logout").catch(()=>{});
    setToken(""); nav("/auth",{replace:true});
  };

  if(!me) return <div className="grid h-screen place-items-center">Loading…</div>;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r bg-white sticky top-0 h-screen flex flex-col">
        <div className="brand-gradient text-white px-5 py-6">
          <div className="text-lg font-semibold tracking-wide">SIMTRAK Portal</div>
          <div className="text-xs/5 opacity-90 mt-1">Hello, {me.profile?.fullName || me.email}</div>
        </div>
        <nav className="p-4 space-y-1">
          {NAV.map(({to,label,Icon})=>(
            <NavLink key={to} to={to}
              className={({isActive})=>`sidebar-link ${isActive?"active":""}`}>
              <Icon size={18}/><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <button onClick={logout} className="btn-danger w-full"><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8">
        {/* Hero ribbon */}
        <div className="brand-gradient rounded-2xl text-white shadow mb-6">
          <div className="grid md:grid-cols-3 gap-4 card-pad">
            <HeroItem title="Welcome" value={me.profile?.fullName || me.email}/>
            <HeroItem title="Powered By" value="SIMTRAK — Inspiring Growth"/>
            <HeroItem title="Today" value={new Date().toLocaleDateString("en-GB")}/>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{opacity:0, y:8}}
            animate={{opacity:1, y:0}}
            exit={{opacity:0, y:8}}
            transition={{duration:0.18}}
          >
            <Outlet/>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function HeroItem({title,value}){
  return (
    <div className="bg-white/10 rounded-xl p-4">
      <div className="text-xs/4 opacity-80">{title}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
