
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function DoctorDetails() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDoctor() {
      try {
        const response = await api.get(`/doctors/${id}`);
        setDoctor(response.data);
      } catch {
        setError("Doctor not found.");
      }
    }

    loadDoctor();
  }, [id]);

  if (error) return <p className="error-text">{error}</p>;
  if (!doctor) return <p>Loading doctor details...</p>;

  return (
    <div className="doctor-details">
      <img
        src={doctor.image || "/images/doctor1.jpg"}
        alt={doctor.name}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://placehold.co/600x400?text=Doctor";
        }}
      />

      <div className="details-content">
        <span className="specialty">
          {doctor.specialization}
        </span>

        <h1>{doctor.name}</h1>
        <p><strong>Hospital:</strong> {doctor.hospital}</p>
        <p><strong>Location:</strong> {doctor.location}</p>
        <p><strong>Experience:</strong> {doctor.experience} Years</p>
        <p><strong>Consultation Fee:</strong> ₹{doctor.fee}</p>
        <p>
          <strong>Availability:</strong>{" "}
          {doctor.availability ? "Available" : "Unavailable"}
        </p>

        <p>
          {doctor.description ||
            "Experienced healthcare professional committed to patient care."}
        </p>

        {doctor.availability && (
          <Link
            className="primary-btn"
            to={`/appointments/book/${doctor.id}`}
          >
            Book Appointment
          </Link>
        )}

        <Link className="secondary-btn" to="/doctors">
          Back to Doctors
        </Link>
      </div>
    </div>
  );
}

export default DoctorDetails;
