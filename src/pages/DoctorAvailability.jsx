import { useEffect, useState } from "react";
import apiRequest from "../services/api";

function DoctorAvailability() {
    const [availability, setAvailability] = useState([]);

    const [day, setDay] = useState("Monday");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);
    const [leaveReason, setLeaveReason] = useState("");

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch doctor's availability
    const fetchAvailability = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await apiRequest("/doctor-availability/my");

            setAvailability(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailability();
    }, []);

    // Save availability
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!startTime || !endTime) {
            setError("Please enter start time and end time.");
            return;
        }

        if (startTime >= endTime) {
            setError("End time must be later than start time.");
            return;
        }

        try {
            await apiRequest("/doctor-availability", {
                method: "POST",
                body: JSON.stringify({
                    day,
                    startTime,
                    endTime,
                    isAvailable,
                    leaveReason: isAvailable ? "" : leaveReason
                })
            });

            setMessage("Availability saved successfully! 🎉");

            setStartTime("");
            setEndTime("");
            setIsAvailable(true);
            setLeaveReason("");

            fetchAvailability();

        } catch (error) {
            setError(error.message);
        }
    };

    // Update existing availability
    const handleUpdate = async (id, current) => {
        try {
            setError("");
            setMessage("");

            await apiRequest(`/doctor-availability/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    startTime: current.startTime,
                    endTime: current.endTime,
                    isAvailable: !current.isAvailable,
                    leaveReason: current.isAvailable
                        ? "Doctor is on leave"
                        : ""
                })
            });

            setMessage("Availability updated successfully! ✅");

            fetchAvailability();

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="availability-page">

            {/* Page Header */}
            <div className="availability-header">
                <div>
                    <h1>⏰ My Availability</h1>
                    <p>
                        Manage your available days, timings and leave.
                    </p>
                </div>
            </div>

            {/* Add Availability */}
            <div className="availability-card">

                <div className="card-header">
                    <div>
                        <h2>Set Doctor Availability</h2>
                        <p>
                            Choose your working day and consultation timings.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="availability-form-grid">

                        {/* Day */}
                        <div className="form-group">
                            <label>Day *</label>

                            <select
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                            >
                                <option>Monday</option>
                                <option>Tuesday</option>
                                <option>Wednesday</option>
                                <option>Thursday</option>
                                <option>Friday</option>
                                <option>Saturday</option>
                                <option>Sunday</option>
                            </select>
                        </div>

                        {/* Start Time */}
                        <div className="form-group">
                            <label>Start Time *</label>

                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) =>
                                    setStartTime(e.target.value)
                                }
                            />
                        </div>

                        {/* End Time */}
                        <div className="form-group">
                            <label>End Time *</label>

                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) =>
                                    setEndTime(e.target.value)
                                }
                            />
                        </div>

                    </div>

                    {/* Availability Status */}
                    <div className="availability-status">

                        <label className="checkbox-label">

                            <input
                                type="checkbox"
                                checked={isAvailable}
                                onChange={(e) =>
                                    setIsAvailable(e.target.checked)
                                }
                            />

                            <span>Doctor is available on this day</span>

                        </label>

                    </div>

                    {/* Leave Reason */}
                    {!isAvailable && (
                        <div className="form-group leave-group">

                            <label>Leave Reason</label>

                            <input
                                type="text"
                                placeholder="Example: Personal leave"
                                value={leaveReason}
                                onChange={(e) =>
                                    setLeaveReason(e.target.value)
                                }
                            />

                        </div>
                    )}

                    {error && (
                        <div className="availability-error">
                            ⚠️ {error}
                        </div>
                    )}

                    {message && (
                        <div className="availability-success">
                            ✅ {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="save-availability-btn"
                    >
                        ⏰ Save Availability
                    </button>

                </form>
            </div>

            {/* Existing Availability */}
            <div className="existing-availability">

                <div className="section-heading">
                    <h2>My Weekly Availability</h2>
                    <p>
                        View and manage your current availability.
                    </p>
                </div>

                {loading && (
                    <p className="loading-text">
                        Loading availability...
                    </p>
                )}

                {!loading && availability.length === 0 && (
                    <div className="empty-availability">
                        <div className="empty-icon">📅</div>

                        <h3>No Availability Added</h3>

                        <p>
                            Set your working days and timings above.
                        </p>
                    </div>
                )}

                {!loading && availability.length > 0 && (
                    <div className="availability-list">

                        {availability.map((item) => (
                            <div
                                className="availability-item"
                                key={item._id}
                            >

                                <div className="availability-info">

                                    <h3>📅 {item.day}</h3>

                                    <p>
                                        <strong>Time:</strong>{" "}
                                        {item.startTime} - {item.endTime}
                                    </p>

                                    <p>
                                        <strong>Status:</strong>{" "}
                                        {item.isAvailable
                                            ? "Available"
                                            : "On Leave"}
                                    </p>

                                    {!item.isAvailable &&
                                        item.leaveReason && (
                                            <p>
                                                <strong>Reason:</strong>{" "}
                                                {item.leaveReason}
                                            </p>
                                        )}

                                </div>

                                <button
                                    className={
                                        item.isAvailable
                                            ? "leave-btn"
                                            : "available-btn"
                                    }
                                    onClick={() =>
                                        handleUpdate(item._id, item)
                                    }
                                >
                                    {item.isAvailable
                                        ? "Mark Leave"
                                        : "Mark Available"}
                                </button>

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default DoctorAvailability;