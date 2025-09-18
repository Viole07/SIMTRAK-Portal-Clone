import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import LoadingButton from "@/components/ui/LoadingButton";

export default function PhotoUpload() {
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [drag, setDrag] = useState(false);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = (await api.get("/auth/me")).data.user;
        setCurrent(me?.profile?.photoUrl || "");
      } catch {}
    })();
  }, []);

  const doUpload = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is larger than 5MB.");
      return;
    }
    setBusy(true);
    setProgress(0);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload/photo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      setPreview(data.url);
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) doUpload(file);
  };

  const saveAndContinue = async () => {
    if (!preview) return;
    setBusy(true);
    try {
      await api.post("/profile/upsert", { profile: { photoUrl: preview } });
      window.location.href = "/app/account";
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <div className="card card-pad w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4 text-center">Upload Profile Photo</h1>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition ${
            drag ? "border-indigo-400 bg-indigo-50" : "border-slate-300"
          }`}
        >
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            id="file"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && doUpload(e.target.files[0])}
          />
          <label htmlFor="file" className="cursor-pointer text-indigo-600 hover:underline">
            Click to choose an image
          </label>
          <div className="text-xs text-slate-500 mt-1">or drag &amp; drop here · Max 5MB (jpg/png/webp)</div>
        </div>

        {/* Progress */}
        {busy && (
          <div className="mt-4">
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-slate-600 mt-1 text-center">{progress}%</div>
          </div>
        )}

        {/* Preview */}
        <div className="mt-5 grid place-items-center">
          {(preview || current) && (
            <img
              src={preview || current}
              alt="preview"
              className="w-40 h-40 object-cover rounded-full shadow"
            />
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <a href="/app/account" className="btn btn-ghost text-center">
            Skip for now
          </a>
          <LoadingButton
            type="button"
            loading={busy}
            onClick={saveAndContinue}
            disabled={!preview}
          >
            Use this photo
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
