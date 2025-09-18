import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@/components/ui/LoadingButton";

const YESNO = ["Yes", "No"];
const INTENSITY = ["Intense Learning", "Mediocre Learning"];

const SECTIONS = [
  {
    title: "Basics",
    fields: [
      ["fullName", "Full Name", "text"],
      ["emailId", "Email", "email", { disabled: true }],
      ["hometown", "City you belong from", "text"],
      ["domain", "Domain", "text"],
      ["team", "Team", "text"],
      ["joiningDate", "Joining date", "date"],
    ],
  },
  {
    title: "Education & Schedule",
    fields: [
      ["gradDetails", "Graduation Details (College, City, Course, Year)", "text"],
      ["postGradDetails", "Post Graduation Details (College, City, Course, Year)", "text"],
      ["collegeTimings", "College timings", "text"],
      ["workingTimings", "Working timings", "text"],
      ["academicRequirement", "Internship part of Academic Requirement", "select", { options: YESNO }],
      ["internshipType", "Type of Internship", "select", { options: INTENSITY }],
      ["onboardedBy", "Onboarded by", "text"],
    ],
  },
  {
    title: "Interests & Skills",
    fields: [
      ["hobbies", "Hobbies", "text"],
      ["skills", "Special skills/activities", "text"],
      ["languagesKnown", "Languages known", "text"],
      ["pastInternship", "Past internship details", "text"],
      ["comfortableTeaching", "Comfortable teaching children", "select", { options: YESNO }],
      ["weakness", "Weakness", "text"],
    ],
  },
  {
    title: "Goals & Misc",
    fields: [
      ["careerPlan", "Career plan", "text"],
      ["objective", "Objective behind joining", "text"],
      ["expectations", "Expectations from this internship", "text"],
      ["hasLaptop", "Do you have a Laptop", "select", { options: YESNO }],
      ["jobStartWhen", "When do you want to start applying for Jobs", "text"],
      ["connectors", "Which can you connect (College/School/Friends/Senior Professionals)", "text"],
    ],
  },
];

export default function ProfileForm() {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(
    Object.fromEntries(
      SECTIONS.flatMap((s) => s.fields.map(([k]) => [k, ""]))
    )
  );

  // prefill from /auth/me (email + any profile already saved)
  useEffect(() => {
    (async () => {
      try {
        const me = (await api.get("/auth/me")).data.user;
        const p = me?.profile || {};
        setForm((s) => ({
          ...s,
          emailId: me?.email || s.emailId,
          ...p,
          // normalize select values capitalized
          hasLaptop: p.hasLaptop || "",
          academicRequirement: p.academicRequirement || "",
          comfortableTeaching: p.comfortableTeaching || "",
          internshipType: p.internshipType || "",
        }));
      } catch {
        // ignore
      }
    })();
  }, []);

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/profile/upsert", { profile: form });
      nav("/photo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-5">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold">Complete your Profile</h1>
        <p className="text-slate-600">All fields are required.</p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        {SECTIONS.map((sec) => (
          <div key={sec.title} className="card card-pad">
            <h2 className="text-lg font-semibold mb-3">{sec.title}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {sec.fields.map(([k, label, type, extra]) => (
                <div key={k} className="space-y-1">
                  <label className="text-sm font-medium">{label}</label>

                  {type === "select" ? (
                    <select
                      className="select"
                      value={form[k] || ""}
                      onChange={(e) => update(k, e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select…
                      </option>
                      {extra?.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="input"
                      type={type === "date" ? "date" : type || "text"}
                      value={form[k] ?? ""}
                      onChange={(e) => update(k, e.target.value)}
                      required
                      disabled={extra?.disabled}
                      placeholder={type === "date" ? "" : ""}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <LoadingButton type="submit" loading={busy}>
            Save &amp; Continue
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
