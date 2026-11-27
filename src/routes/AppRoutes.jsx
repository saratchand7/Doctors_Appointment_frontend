
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

function HomeRouter() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Home />;
}

function LoginRouter() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
}

function DashboardRouter() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;

    case "doctor":
      return <DoctorDashboard />;

    case "patient":
      return <PatientDashboard />;

    default:
      return <div>Invalid user role.</div>;
  }
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRouter />} />

      <Route path="/home" element={<HomeRouter />} />

      <Route path="/login" element={<LoginRouter />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/doctors"
        element={
          <ProtectedRoute>
            <Doctors />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctors/:id"
        element={
          <ProtectedRoute>
            <DoctorDetails />
          </ProtectedRoute>
        }
      />

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
