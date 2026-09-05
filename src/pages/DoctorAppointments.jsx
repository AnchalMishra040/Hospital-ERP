import { useEffect, useState } from "react";
import apiRequest from "../services/api";

function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await apiRequest("/appointments/doctor");

            setAppointments(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f8fc",
                padding: "45px 7%"
            }}
        >

            {/* Page Header */}
            <div style={{ marginBottom: "35px" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px"
                    }}
                >
                    <span style={{ fontSize: "45px" }}>📅</span>

                    <div>
                        <h1
                            style={{
                                margin: 0,
                                color: "#174a78",
                                fontSize: "38px"
                            }}
                        >
                            My Appointments
                        </h1>

                        <p
                            style={{
                                marginTop: "8px",
                                color: "#5d7894",
                                fontSize: "18px"
                            }}
                        >
                            View and manage appointments booked by your patients.
                        </p>
                    </div>
                </div>
            </div>


            {/* Loading */}
            {loading && (
                <div
                    style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "16px",
                        textAlign: "center",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.06)"
                    }}
                >
                    <p style={{ color: "#54718e", fontSize: "17px" }}>
                        Loading appointments...
                    </p>
                </div>
            )}


            {/* Error */}
            {!loading && error && (
                <div
                    style={{
                        background: "#fff1f1",
                        border: "1px solid #ffcaca",
                        padding: "18px 22px",
                        borderRadius: "10px",
                        color: "#d93025"
                    }}
                >
                    ⚠️ {error}
                </div>
            )}


            {/* No appointments */}
            {!loading &&
                !error &&
                appointments.length === 0 && (
                    <div
                        style={{
                            background: "white",
                            padding: "45px",
                            borderRadius: "16px",
                            textAlign: "center",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.06)"
                        }}
                    >
                        <div style={{ fontSize: "50px" }}>📅</div>

                        <h2 style={{ color: "#174a78" }}>
                            No Appointments
                        </h2>

                        <p style={{ color: "#6c8298" }}>
                            You currently have no appointments booked by patients.
                        </p>
                    </div>
                )}


            {/* Appointment Cards */}
            {!loading &&
                !error &&
                appointments.length > 0 && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(320px, 1fr))",
                            gap: "22px"
                        }}
                    >
                        {appointments.map((appointment) => (
                            <div
                                key={appointment._id}
                                style={{
                                    background: "white",
                                    borderRadius: "16px",
                                    padding: "25px",
                                    boxShadow:
                                        "0 8px 25px rgba(0,0,0,0.07)",
                                    border:
                                        "1px solid #e4edf5"
                                }}
                            >

                                {/* Appointment Header */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "20px"
                                    }}
                                >
                                    <h2
                                        style={{
                                            margin: 0,
                                            color: "#174a78",
                                            fontSize: "21px"
                                        }}
                                    >
                                        📋 Appointment
                                    </h2>

                                    <span
                                        style={{
                                            background:
                                                appointment.status === "Booked"
                                                    ? "#e7f6ec"
                                                    : "#f1f3f5",
                                            color:
                                                appointment.status === "Booked"
                                                    ? "#218838"
                                                    : "#555",
                                            padding: "6px 12px",
                                            borderRadius: "20px",
                                            fontSize: "13px",
                                            fontWeight: "600"
                                        }}
                                    >
                                        {appointment.status}
                                    </span>
                                </div>


                                {/* Details */}
                                <div
                                    style={{
                                        borderTop:
                                            "1px solid #e7edf3",
                                        paddingTop: "15px"
                                    }}
                                >

                                    <p>
                                        <strong>Appointment ID:</strong>{" "}
                                        {appointment.appointmentId}
                                    </p>

                                    <p>
                                        <strong>Patient ID:</strong>{" "}
                                        {appointment.patientId}
                                    </p>

                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {appointment.appointmentDate}
                                    </p>

                                    <p>
                                        <strong>Time:</strong>{" "}
                                        {appointment.appointmentTime}
                                    </p>

                                    <p>
                                        <strong>Reason:</strong>{" "}
                                        {appointment.reason || "Not specified"}
                                    </p>

                                </div>

                            </div>
                        ))}
                    </div>
                )}

        </div>
    );
}

export default DoctorAppointments;