import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "@/pages/Auth.jsx";
import ProfileForm from "@/pages/ProfileForm.jsx";
import PhotoUpload from "@/pages/PhotoUpload.jsx";
import ProfileView from "@/pages/ProfileView.jsx";
import Portal from "@/pages/Portal.jsx";
import Tasks from "@/pages/Tasks.jsx";
import DailyJournal from "@/pages/DailyJournal.jsx";
import WeeklyReview from "@/pages/WeeklyReview.jsx";
import Leave from "@/pages/Leave.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<ProfileForm />} />
      <Route path="/photo" element={<PhotoUpload />} />

      {/* Everything inside the portal layout */}
      <Route path="/app" element={<Portal />}>
        <Route index element={<Navigate to="dj" />} />
        <Route path="dj" element={<DailyJournal />} />
        <Route path="weekly" element={<WeeklyReview />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="leave" element={<Leave />} />
        <Route path="account" element={<ProfileView />} />
      </Route>

      {/* Back-compat: /account -> /app/account */}
      <Route path="/account" element={<Navigate to="/app/account" replace />} />
    </Routes>
  );
}
