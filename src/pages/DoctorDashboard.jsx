
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [doctorResponse, appointmentsResponse] =
          await Promise.all([
            api.get(`/doctors/${user.doctorId}`),
            api.get("/appointments")
          ]);

        setDoctor(doctorResponse.data);

        setAppointments(
          appointmentsResponse.data.filter(
            (item) =>
              String(item.doctorId) === String(user.doctorId)
          )
        );
      } catch {
        setError("Unable to load dashboard.");
      }
    }

    loadData();
  }, [user.doctorId]);

  async function updateStatus(id, status) {
    try {
      await api.patch(`/appointments/${id}`, { status });

      setAppointments((previous) =>
        previous.map((item) =>
          String(item.id) === String(id)
            ? { ...item, status }
            : item
        )
      );

      alert(`Appointment ${status.toLowerCase()}!`);
    } catch {
      alert("Unable to update appointment.");
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <span className="eyebrow">DOCTOR PORTAL</span>
        <h1>Welcome, {user.name}</h1>
        <p>Manage your appointments and availability.</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      {doctor && (
        <div className="dashboard-summary">
          <h2>{doctor.specialization}</h2>
          <p>{doctor.hospital} — {doctor.location}</p>
          <p>
            Availability:{" "}
            <strong>
              {doctor.availability ? "Available" : "Unavailable"}
            </strong>
          </p>

          <Link
            className="primary-btn"
            to={`/doctors/edit/${user.doctorId}`}
          >
            Edit My Profile
          </Link>
        </div>
      )}

      <h2>My Patient Appointments</h2>

      <div className="appointment-grid">
        {appointments.map((item) => (
          <div className="appointment-card" key={item.id}>
            <h3>{item.patientName}</h3>
            <p>📧 {item.email}</p>
            <p>📞 {item.phone}</p>
            <p>📅 {item.date}</p>
            <p>🕒 {item.time}</p>
            <p>Reason: {item.reason || "General consultation"}</p>
            <span className="status">{item.status}</span>

            {item.status === "Pending" && (
              <div className="action-row">
                <button
                  className="edit-btn"
                  onClick={() => updateStatus(item.id, "Confirmed")}
                >
                  Confirm
                </button>
                <button
                  className="delete-btn"
                  onClick={() => updateStatus(item.id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            )}

            {item.status === "Confirmed" && (
              <button
                className="view-btn"
                onClick={() => updateStatus(item.id, "Completed")}
              >
                Mark Completed
              </button>
            )}
          </div>
        ))}
      </div>

      {!error && appointments.length === 0 && (
        <p>No appointments assigned yet.</p>
      )}
    </div>
  );
}

export default DoctorDashboard;
