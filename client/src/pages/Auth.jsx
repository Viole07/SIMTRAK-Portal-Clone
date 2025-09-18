import { useState } from "react";
import { api, setToken } from "@/lib/api";
import LoadingButton from "@/components/ui/LoadingButton";
import { Eye, EyeOff } from "lucide-react";

const REQUIRED_KEYS = [
  "fullName","gradDetails","postGradDetails","collegeTimings","workingTimings",
  "hometown","hobbies","skills","careerPlan","objective","hasLaptop","domain",
  "joiningDate","team","onboardedBy","academicRequirement","internshipType",
  "emailId","expectations","languagesKnown","pastInternship","schoolName",
  "comfortableTeaching","weakness","jobStartWhen","connectors",
];

function isProfileComplete(profile) {
  if (!profile) return false;
  return REQUIRED_KEYS.every(
    (k) => profile[k] !== undefined && String(profile[k]).trim() !== ""
  );
}

const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v);

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = emailOk(email) && password.length >= 6 && !loading;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.post(`/auth/${mode}`, { email, password });
      if (data?.token) setToken(data.token);

      const me = (await api.get("/auth/me")).data.user;
      const prof = me?.profile;

      if (!isProfileComplete(prof)) {
        window.location.href = "/profile";
      } else if (!prof?.photoUrl) {
        window.location.href = "/photo";
      } else {
        window.location.href = "/app/account";
      }
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <form
        onSubmit={submit}
        className="w-full max-w-sm card card-pad space-y-4"
      >
        {/* mode switch */}
        <div className="flex bg-slate-100 rounded-xl p-1">
          {["login", "register"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => !loading && setMode(m)}
              className={`flex-1 py-2 rounded-lg transition pressable ${
                mode === m ? "bg-white shadow text-slate-900" : "text-slate-600"
              }`}
              disabled={loading}
            >
              {m === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        {err && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
            {err}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            className="input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!emailOk(email) && email.length > 0}
            disabled={loading}
          />
          {!emailOk(email) && email.length > 0 && (
            <p className="text-xs text-amber-600">Enter a valid email</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <input
              className="input pr-10"
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              aria-label={showPwd ? "Hide password" : "Show password"}
              disabled={loading}
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {password.length > 0 && password.length < 6 && (
            <p className="text-xs text-amber-600">Min 6 characters</p>
          )}
        </div>

        <LoadingButton type="submit" loading={loading} disabled={!canSubmit}>
          {mode === "login" ? "Continue" : "Create account"}
        </LoadingButton>

        <p className="text-sm text-center text-slate-600">
          {mode === "login" ? (
            <>
              No account?{" "}
              <button
                type="button"
                className="text-indigo-600 hover:underline disabled:opacity-60"
                onClick={() => setMode("register")}
                disabled={loading}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Have an account?{" "}
              <button
                type="button"
                className="text-indigo-600 hover:underline disabled:opacity-60"
                onClick={() => setMode("login")}
                disabled={loading}
              >
                Login
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
