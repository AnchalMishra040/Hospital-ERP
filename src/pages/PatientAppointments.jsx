import { useEffect, useState } from "react";
import apiRequest from "../services/api";
import "./PatientAppointments.css";

function PatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [doctorId, setDoctorId] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [reason, setReason] = useState("");

    const [message, setMessage] = useState("");

    // Fetch patient's appointments
    const fetchAppointments = async () => {
        try {
            setLoading(true);

            const data = await apiRequest("/appointments/my");

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

    // Book appointment
    const handleBookAppointment = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!doctorId || !appointmentDate || !appointmentTime) {
            setError("Please fill all required fields.");
            return;
        }

        try {
            const appointmentId =
                "A" + Math.floor(100000 + Math.random() * 900000);

            await apiRequest("/appointments", {
                method: "POST",
                body: JSON.stringify({
                    appointmentId,
                    doctorId,
                    appointmentDate,
                    appointmentTime,
                    reason
                })
            });

            setMessage("Appointment booked successfully! 🎉");

            setDoctorId("");
            setAppointmentDate("");
            setAppointmentTime("");
            setReason("");

            fetchAppointments();

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="appointments-page">

            {/* Page Header */}
            <div className="appointments-header">
                <div>
                    <h1>📅 My Appointments</h1>
                    <p>
                        Book a new appointment and manage your upcoming
                        doctor visits.
                    </p>
                </div>
            </div>

            {/* Book Appointment Card */}
            <div className="appointment-book-card">

                <div className="card-heading">
                    <div className="card-icon">📅</div>

                    <div>
                        <h2>Book New Appointment</h2>
                        <p>
                            Schedule an appointment with your preferred doctor.
                        </p>
                    </div>
                </div>

                <form
                    className="appointment-form"
                    onSubmit={handleBookAppointment}
                >

                    <div className="form-row">

                        <div className="form-group">
                            <label>
                                Doctor ID <span>*</span>
                            </label>

                            <input
                                type="text"
                                placeholder="Example: D10002"
                                value={doctorId}
                                onChange={(e) =>
                                    setDoctorId(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Appointment Date <span>*</span>
                            </label>

                            <input
                                type="date"
                                value={appointmentDate}
                                onChange={(e) =>
                                    setAppointmentDate(e.target.value)
                                }
                            />
                        </div>

                    </div>

                    <div className="form-row">

                        <div className="form-group">
                            <label>
                                Appointment Time <span>*</span>
                            </label>

                            <input
                                type="time"
                                value={appointmentTime}
                                onChange={(e) =>
                                    setAppointmentTime(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Reason for Visit</label>

                            <input
                                type="text"
                                placeholder="Example: Regular checkup"
                                value={reason}
                                onChange={(e) =>
                                    setReason(e.target.value)
                                }
                            />
                        </div>

                    </div>

                    {error && (
                        <div className="appointment-error">
                            ⚠️ {error}
                        </div>
                    )}

                    {message && (
                        <div className="appointment-success">
                            ✓ {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="book-appointment-btn"
                    >
                        📅 Book Appointment
                    </button>

                </form>
            </div>

            {/* Previous Appointments */}
            <div className="previous-appointments">

                <div className="section-title">
                    <h2>My Previous Appointments</h2>
                    <p>View your booked and completed appointments.</p>
                </div>

                {loading && (
                    <div className="loading-message">
                        Loading appointments...
                    </div>
                )}

                {!loading && appointments.length === 0 && (
                    <div className="empty-appointments">
                        <div className="empty-icon">📅</div>
                        <h3>No appointments found</h3>
                        <p>
                            You don't have any appointments yet.
                        </p>
                    </div>
                )}

                {!loading && appointments.length > 0 && (
                    <div className="appointments-list">

                        {appointments.map((appointment) => (

                            <div
                                className="appointment-card"
                                key={appointment._id}
                            >

                                <div className="appointment-card-header">

                                    <div>
                                        <span className="appointment-label">
                                            APPOINTMENT ID
                                        </span>

                                        <h3>
                                            {appointment.appointmentId}
                                        </h3>
                                    </div>

                                    <span
                                        className={`status-badge ${
                                            appointment.status
                                                ?.toLowerCase()
                                                .replace(/\s+/g, "-")
                                        }`}
                                    >
                                        {appointment.status}
                                    </span>

                                </div>

                                <div className="appointment-details">

                                    <div className="detail-item">
                                        <span>👨‍⚕️ Doctor</span>
                                        <strong>
                                            {appointment.doctorId}
                                        </strong>
                                    </div>

                                    <div className="detail-item">
                                        <span>📅 Date</span>
                                        <strong>
                                            {appointment.appointmentDate}
                                        </strong>
                                    </div>

                                    <div className="detail-item">
                                        <span>⏰ Time</span>
                                        <strong>
                                            {appointment.appointmentTime}
                                        </strong>
                                    </div>

                                    <div className="detail-item">
                                        <span>📝 Reason</span>
                                        <strong>
                                            {appointment.reason || "Not specified"}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default PatientAppointments;