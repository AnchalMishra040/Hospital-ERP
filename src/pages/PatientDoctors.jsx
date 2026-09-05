import { useEffect, useState } from "react";
import apiRequest from "../services/api";

function PatientDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);

            const data = await apiRequest("/doctors");

            setDoctors(data);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "30px" }}>

            <h1>Available Doctors</h1>

            {loading && <p>Loading doctors...</p>}

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {!loading && doctors.length === 0 && (
                <p>No doctors found.</p>
            )}

            <div
                style={{
                    display: "grid",
                    gap: "20px",
                    marginTop: "20px"
                }}
            >
                {doctors.map((doctor) => (
                    <div
                        key={doctor._id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "20px",
                            borderRadius: "10px"
                        }}
                    >
                        <h3>👨‍⚕️ {doctor.name}</h3>

                        <p>
                            <strong>Doctor ID:</strong> {doctor.doctorId}
                        </p>

                        <p>
                            <strong>Specialization:</strong>{" "}
                            {doctor.specialization}
                        </p>

                        <p>
                            <strong>Email:</strong> {doctor.email}
                        </p>

                        <p>
                            <strong>Phone:</strong> {doctor.phone}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {doctor.available
                                ? "Available"
                                : "Not Available"}
                        </p>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default PatientDoctors;