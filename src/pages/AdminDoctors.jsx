import { useEffect, useState } from "react";
import apiRequest from "../services/api";

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    doctorId: "",
    name: "",
    specialization: "",
    phone: "",
    email: "",
    available: true
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/doctors");
      setDoctors(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await apiRequest("/doctors", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          available: true
        })
      });

      setForm({
        doctorId: "",
        name: "",
        specialization: "",
        phone: "",
        email: "",
        available: true
      });

      fetchDoctors();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="admin-doctors-page">

      <div className="admin-page-header">
        <h1>👨‍⚕️ Manage Doctors</h1>
        <p>Add new doctors and view registered doctors.</p>
      </div>

      <div className="admin-doctors-container">

        <div className="admin-doctor-form-card">
          <h2>Add New Doctor</h2>

          <form onSubmit={handleSubmit} className="admin-doctor-form">

            <input
              type="text"
              name="doctorId"
              placeholder="Doctor ID"
              value={form.doctorId}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="name"
              placeholder="Doctor Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={form.specialization}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <button type="submit">
              ➕ Add Doctor
            </button>

          </form>
        </div>

        <div className="admin-doctors-list-card">
          <h2>Registered Doctors</h2>

          {loading && <p>Loading doctors...</p>}

          {error && (
            <p className="admin-error">
              ⚠️ {error}
            </p>
          )}

          {!loading && !error && doctors.length === 0 && (
            <p className="admin-empty">
              No doctors registered yet.
            </p>
          )}

          {!loading && doctors.length > 0 && (
            <div className="admin-doctors-list">

              {doctors.map((doctor) => (
                <div className="admin-doctor-card" key={doctor._id}>

                  <div>
                    <h3>👨‍⚕️ {doctor.name}</h3>

                    <p>
                      <strong>Doctor ID:</strong> {doctor.doctorId}
                    </p>

                    <p>
                      <strong>Specialization:</strong>{" "}
                      {doctor.specialization}
                    </p>

                    <p>
                      <strong>Phone:</strong> {doctor.phone}
                    </p>

                    <p>
                      <strong>Email:</strong> {doctor.email}
                    </p>
                  </div>

                  <span
                    className={
                      doctor.available
                        ? "doctor-available"
                        : "doctor-unavailable"
                    }
                  >
                    {doctor.available ? "Available" : "Unavailable"}
                  </span>

                </div>
              ))}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminDoctors;