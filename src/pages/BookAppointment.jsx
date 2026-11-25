import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    patientName: user?.name || "",
    email: user?.email || "",
    phone: "",
    date: "",
    time: "",
    reason: ""
  });

  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  useEffect(() => {
    async function loadDoctor() {
      try {
        const response = await api.get(`/doctors/${id}`);
        setDoctor(response.data);
      } catch {
        setError("Unable to load doctor.");
      }
    }

    loadDoctor();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!doctor?.availability) {
      setError("This doctor is currently unavailable.");
      return;
    }

    if (form.date < localToday) {
      setError("Please select a valid future date.");
      return;
    }

    setSaving(true);

    try {
      const response = await api.get("/appointments", {
        params: {
          doctorId: String(doctor.id),
          date: form.date,
          time: form.time
        }
      });

      const occupied = response.data.some(
        (appointment) =>
          appointment.status !== "Cancelled" &&
          appointment.status !== "Rejected"
      );

      if (occupied) {
        setError("This time slot is already booked.");
        return;
      }

      await api.post("/appointments", {
        ...form,
        patientId: String(user.id),
        doctorId: String(doctor.id),
        doctorName: doctor.name,
        status: "Pending",
        createdAt: new Date().toISOString()
      });

      toast.success("Appointment booked successfully.");
      navigate("/my-appointments");
    } catch {
      setError("Booking failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (error && !doctor) {
    return <p className="error-text">{error}</p>;
  }

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <h1>Book Appointment</h1>
      <p>
        Doctor: <strong>{doctor.name}</strong>
      </p>
      <p>Consultation Fee: ₹{doctor.fee}</p>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="booking-patient-name">Patient Name</label>
        <input
          id="booking-patient-name"
          name="patientName"
          value={form.patientName}
          onChange={handleChange}
          required
        />

        <label htmlFor="booking-email">Email</label>
        <input
          id="booking-email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="booking-phone">Phone Number</label>
        <input
          id="booking-phone"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="booking-date">Appointment Date</label>
        <input
          id="booking-date"
          type="date"
          name="date"
          min={localToday}
          value={form.date}
          onChange={handleChange}
          required
        />

        <label htmlFor="booking-time">Appointment Time</label>
        <input
          id="booking-time"
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
        />

        <label htmlFor="booking-reason">Reason for Visit</label>
        <textarea
          id="booking-reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Briefly describe your concern"
        />

        <button
          type="submit"
          className="submit-btn"
          disabled={saving || !doctor.availability}
        >
          {saving ? "Booking..." : "Confirm Appointment"}
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;