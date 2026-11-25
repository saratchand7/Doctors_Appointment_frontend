
import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function MyAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAppointments() {
      try {
        const response = await api.get("/appointments");
        setAppointments(
          response.data.filter(
            (item) => String(item.patientId) === String(user.id)
          )
        );
      } catch {
        setError("Unable to load appointments.");
      }
    }

    loadAppointments();
  }, [user.id]);

  async function cancelAppointment(id) {
    if (!window.confirm("Cancel this appointment?")) return;

    try {
      await api.patch(`/appointments/${id}`, {
        status: "Cancelled"
      });

      setAppointments((previous) =>
        previous.map((item) =>
          String(item.id) === String(id)
            ? { ...item, status: "Cancelled" }
            : item
        )
      );
      alert("Appointment cancelled!");
    } catch {
      alert("Unable to cancel appointment.");
    }
  }

  return (
    <div>
      <h1>My Appointments</h1>
      {error && <p className="error-text">{error}</p>}

      {appointments.length === 0 && !error && (
        <div className="empty-state">
          <h3>No appointments yet</h3>
          <p>Book an appointment from the Doctors page.</p>
        </div>
      )}

      <div className="appointment-grid">
        {appointments.map((item) => (
          <div className="appointment-card" key={item.id}>
            <h3>{item.doctorName}</h3>
            <p>📅 {item.date}</p>
            <p>🕒 {item.time}</p>
            <p>Reason: {item.reason || "General consultation"}</p>
            <span className="status">{item.status}</span>

            {["Pending", "Confirmed"].includes(item.status) && (
              <button
                className="delete-btn"
                onClick={() => cancelAppointment(item.id)}
              >
                Cancel Appointment
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointments;
