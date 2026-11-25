
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const initialForm = {
  name: "",
  specialization: "",
  experience: "",
  hospital: "",
  location: "",
  fee: "",
  image: "",
  description: "",
  availability: true
};

function AddDoctor() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await api.post("/doctors", {
        ...form,
        name: form.name.trim(),
        specialization: form.specialization.trim(),
        experience: Number(form.experience),
        fee: Number(form.fee)
      });

      alert("Doctor added successfully!");
      navigate("/doctors");
    } catch {
      setError("Unable to add doctor.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-container">
      <h1>Add New Doctor</h1>
      <p>Enter the doctor's professional details.</p>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        {[
          ["name", "Doctor Name", "text"],
          ["specialization", "Specialization", "text"],
          ["experience", "Experience (Years)", "number"],
          ["hospital", "Hospital", "text"],
          ["location", "Location", "text"],
          ["fee", "Consultation Fee", "number"],
          ["image", "Image URL", "text"]
        ].map(([name, label, type]) => (
          <div className="form-group" key={name}>
            <label>{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              min={type === "number" ? 0 : undefined}
              required={name !== "image"}
            />
          </div>
        ))}

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="availability"
            checked={form.availability}
            onChange={handleChange}
          />
          Available for appointments
        </label>

        <button className="submit-btn" disabled={saving}>
          {saving ? "Saving..." : "Add Doctor"}
        </button>
      </form>
    </div>
  );
}

export default AddDoctor;
