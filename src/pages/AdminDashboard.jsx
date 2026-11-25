
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  const [newDoctorAccount, setNewDoctorAccount] = useState({
    name: "",
    email: "",
    password: "",
    doctorId: ""
  });

  async function loadData() {
    try {
      const [doctorResponse, userResponse, appointmentResponse] =
        await Promise.all([
          api.get("/doctors"),
          api.get("/users"),
          api.get("/appointments")
        ]);

      setDoctors(doctorResponse.data);
      setUsers(userResponse.data);
      setAppointments(appointmentResponse.data);
      setError("");
    } catch {
      setError("Unable to load admin data.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function deleteUser(id) {
    if (String(id) === String(user.id)) {
      alert("You cannot delete your own admin account.");
      return;
    }

    if (!window.confirm("Delete this user account?")) return;

    try {
      await api.delete(`/users/${id}`);
      await loadData();
      alert("User deleted successfully!");
    } catch {
      alert("Unable to delete user.");
    }
  }

  async function updateAppointment(id, status) {
    try {
      await api.patch(`/appointments/${id}`, { status });
      await loadData();
    } catch {
      alert("Unable to update appointment.");
    }
  }

  async function createDoctorAccount(e) {
    e.preventDefault();

    if (!newDoctorAccount.doctorId) {
      alert("Select a doctor.");
      return;
    }

    const email = newDoctorAccount.email.trim().toLowerCase();

    if (users.some((item) => item.email === email)) {
      alert("Email already registered.");
      return;
    }

    if (
      users.some(
        (item) =>
          item.role === "doctor" &&
          String(item.doctorId) === String(newDoctorAccount.doctorId)
      )
    ) {
      alert("This doctor already has a login account.");
      return;
    }

    try {
      await api.post("/users", {
        name: newDoctorAccount.name.trim(),
        email,
        password: newDoctorAccount.password,
        role: "doctor",
        doctorId: String(newDoctorAccount.doctorId)
      });

      setNewDoctorAccount({
        name: "",
        email: "",
        password: "",
        doctorId: ""
      });

      await loadData();
      alert("Doctor login account created!");
    } catch {
      alert("Unable to create doctor account.");
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <span className="eyebrow">ADMIN PORTAL</span>
        <h1>Admin Dashboard</h1>
        <p>Manage doctors, users, and appointments.</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="stats-grid">
        <div className="stat-card">
          <span>Doctors</span>
          <strong>{doctors.length}</strong>
        </div>
        <div className="stat-card">
          <span>Patients</span>
          <strong>
            {users.filter((item) => item.role === "patient").length}
          </strong>
        </div>
        <div className="stat-card">
          <span>Appointments</span>
          <strong>{appointments.length}</strong>
        </div>
        <div className="stat-card">
          <span>Pending</span>
          <strong>
            {appointments.filter((item) => item.status === "Pending").length}
          </strong>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Doctor Management</h2>
          <Link className="primary-btn" to="/doctors/add">
            + Add Doctor
          </Link>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.location}</td>
                  <td>
                    <Link to={`/doctors/edit/${doctor.id}`}>
                      Edit Doctor
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Create Doctor Login</h2>

        <form className="inline-form" onSubmit={createDoctorAccount}>
          <input
            placeholder="Doctor Name"
            value={newDoctorAccount.name}
            onChange={(e) =>
              setNewDoctorAccount({
                ...newDoctorAccount,
                name: e.target.value
              })
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={newDoctorAccount.email}
            onChange={(e) =>
              setNewDoctorAccount({
                ...newDoctorAccount,
                email: e.target.value
              })
            }
            required
          />

          <input
            type="password"
            placeholder="Password (minimum 6 characters)"
            minLength={6}
            value={newDoctorAccount.password}
            onChange={(e) =>
              setNewDoctorAccount({
                ...newDoctorAccount,
                password: e.target.value
              })
            }
            required
          />

          <select
            value={newDoctorAccount.doctorId}
            onChange={(e) =>
              setNewDoctorAccount({
                ...newDoctorAccount,
                doctorId: e.target.value
              })
            }
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>

          <button className="submit-btn">
            Create Doctor Account
          </button>
        </form>
      </section>

      <section className="dashboard-section">
        <h2>User Management</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>
                    {String(item.id) !== String(user.id) && (
                      <button
                        className="delete-btn"
                        onClick={() => deleteUser(item.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>All Appointments</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item.id}>
                  <td>{item.patientName}</td>
                  <td>{item.doctorName}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>{item.status}</td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateAppointment(item.id, e.target.value)
                      }
                    >
                      {[
                        "Pending",
                        "Confirmed",
                        "Completed",
                        "Rejected",
                        "Cancelled"
                      ].map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
