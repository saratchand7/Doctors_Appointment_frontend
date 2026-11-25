
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const canEdit =
    user?.role === "admin" ||
    (user?.role === "doctor" &&
      String(user.doctorId) === String(id));

  useEffect(() => {
    if (!canEdit) return;

    async function loadDoctor() {
      try {
        const response = await api.get(`/doctors/${id}`);
        setForm(response.data);
      } catch {
        setError("Unable to load doctor details.");
      }
    }

    loadDoctor();
  }, [id, canEdit]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const changes = user.role === "doctor"
        ? {
            availability: form.availability,
            image: form.image,
            description: form.description
          }
        : {
            name: form.name,
            specialization: form.specialization,
            experience: Number(form.experience),
            hospital: form.hospital,
            location: form.location,
            fee: Number(form.fee),
            image: form.image,
            description: form.description,
            availability: form.availability
          };

      await api.patch(`/doctors/${id}`, changes);

      alert("Doctor updated successfully!");
      navigate("/dashboard");
    } catch {
      setError("Unable to update doctor.");
    } finally {
      setSaving(false);
    }
  }

  if (!canEdit) {
    return <p className="error-text">Access denied.</p>;
  }

  if (error && !form) {
    return <p className="error-text">{error}</p>;
  }

  if (!form) return <p>Loading doctor details...</p>;

  const fields = user.role === "admin"
    ? [
        "name",
        "specialization",
        "experience",
        "hospital",
        "location",
        "fee",
        "image"
      ]
    : ["image"];

  return (
    <div className="form-container">
      <h1>Edit Doctor Profile</h1>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        {fields.map((name) => (
          <div className="form-group" key={name}>
            <label>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </label>

            <input
              name={name}
              type={
                ["experience", "fee"].includes(name)
                  ? "number"
                  : "text"
              }
              min={
                ["experience", "fee"].includes(name)
                  ? 0
                  : undefined
              }
              value={form[name] ?? ""}
              onChange={handleChange}
              required={name !== "image"}
            />
          </div>
        ))}

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
          />
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="availability"
            checked={Boolean(form.availability)}
            onChange={handleChange}
          />
          Available for appointments
        </label>

        <button className="submit-btn" disabled={saving}>
          {saving ? "Updating..." : "Update Doctor"}
        </button>
      </form>
    </div>
  );
}

export default EditDoctor;
