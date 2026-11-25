
import { Routes, Route, Navigate, Link } from "react-router-dom";

import Home from "../pages/Home";
import Doctors from "../pages/Doctors";
import DoctorDetails from "../pages/DoctorDetails";
import AddDoctor from "../pages/AddDoctor";
import EditDoctor from "../pages/EditDoctor";
import BookAppointment from "../pages/BookAppointment";

import Login from "../pages/Login";
import Register from "../pages/Register";

import PatientDashboard from "../pages/PatientDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import AdminDashboard from "../pages/AdminDashboard";

import Favorites from "../pages/Favorites";
import MyAppointments from "../pages/MyAppointments";

import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

function DashboardRouter() {
  const { user } = useAuth();

  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "doctor") return <DoctorDashboard />;
  if (user.role === "patient") return <PatientDashboard />;

  return <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/:id" element={<DoctorDetails />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctors/add"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AddDoctor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctors/edit/:id"
        element={
          <ProtectedRoute roles={["admin", "doctor"]}>
            <EditDoctor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments/book/:id"
        element={
          <ProtectedRoute roles={["patient"]}>
            <BookAppointment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-appointments"
        element={
          <ProtectedRoute roles={["patient"]}>
            <MyAppointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/favorites"
        element={
          <ProtectedRoute roles={["patient"]}>
            <Favorites />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <div className="empty-state">
            <h1>404 - Page Not Found</h1>
            <p>The requested page does not exist.</p>
            <Link className="primary-btn" to="/">
              Back to Home
            </Link>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
