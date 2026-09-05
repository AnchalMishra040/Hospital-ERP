import { useState } from "react";
import "./App.css";
import PatientAppointments from "./pages/PatientAppointments";
import PatientDoctors from "./pages/PatientDoctors";
import PatientMedicalHistory from "./pages/PatientMedicalHistory";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorAvailability from "./pages/DoctorAvailability";
import DoctorPatientHistory from "./pages/DoctorPatientHistory";
import AdminDoctors from "./pages/AdminDoctors";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetails from "./pages/AdminUserDetails";

function App() {
  const [userId, setUserId] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!userId || !password) {
      setError("Please enter User ID and Password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      // Save login information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
    } catch (error) {
      setError("Unable to connect to server. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setUserId("");
    setPassword("");
  };
  // Patient Medical History page
if (user && currentPage === "medical-history") {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">Hospital ERP</div>

        <button
          className="logout-btn"
          onClick={() => setCurrentPage("dashboard")}
        >
          Back to Dashboard
        </button>
      </nav>

      <PatientMedicalHistory />
    </div>
  );
}
  // Patient Appointments page
if (user && currentPage === "appointments") {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">Hospital ERP</div>

        <button
          className="logout-btn"
          onClick={() => setCurrentPage("dashboard")}
        >
          Back to Dashboard
        </button>
      </nav>

      <PatientAppointments />
    </div>
  );
}
// Doctor Appointments page
if (user && currentPage === "doctor-appointments") {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">Hospital ERP</div>

        <button
          className="logout-btn"
          onClick={() => setCurrentPage("dashboard")}
        >
          Back to Dashboard
        </button>
      </nav>

      <DoctorAppointments />
    </div>
  );
}
if (user && currentPage === "doctors") {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">Hospital ERP</div>

        <button
          className="logout-btn"
          onClick={() => setCurrentPage("dashboard")}
        >
          Back to Dashboard
        </button>
      </nav>

      <PatientDoctors />
    </div>
  );
}
if (user && currentPage === "doctor-availability") {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">Hospital ERP</div>
        <button
          className="logout-btn"
          onClick={() => setCurrentPage("dashboard")}
        >
          Back to Dashboard
        </button>
      </nav>

      <DoctorAvailability />
    </div>
  );
}
if (user && currentPage === "doctor-patient-history") {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">Hospital ERP</div>
        <button
          className="logout-btn"
          onClick={() => setCurrentPage("dashboard")}
        >
          Back to Dashboard
        </button>
      </nav>

      <DoctorPatientHistory />
    </div>
  );
}
 if (user && currentPage === "admin-doctors") {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">Hospital ERP</div>

        <button
          className="logout-btn"
          onClick={() => setCurrentPage("dashboard")}
        >
          Back to Dashboard
        </button>
      </nav>

      <AdminDoctors />
    </div>
  );
}
if (user && currentPage === "admin-user-details") {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">Hospital ERP</div>
      </nav>

      <AdminUserDetails
        userId={selectedUserId}
        onBack={() => setCurrentPage("admin-users")}
      />
    </div>
  );
}
if (user && currentPage === "admin-users") {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">Hospital ERP</div>

        <button
          className="logout-btn"
          onClick={() => setCurrentPage("dashboard")}
        >
          Back to Dashboard
        </button>
      </nav>

      <AdminUsers 
      setCurrentPage={setCurrentPage}
  setSelectedUserId={setSelectedUserId} />
    </div>
  );
}
  // Dashboard after login
  if (user) {
    return (
      <div className="dashboard-page">
        <nav className="navbar">
          <div className="logo">Hospital ERP</div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>

        <main className="dashboard-content">
          <div className="welcome-card">
            <h1>Welcome, {user.name} 👋</h1>

            <p className="role-text">
              Logged in as <strong>{user.role}</strong>
            </p>

            <div className="user-info">
              <div>
                <span>User ID</span>
                <strong>{user.userId}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>

              <div>
                <span>Role</span>
                <strong>{user.role}</strong>
              </div>
            </div>
          </div>

          <div className="feature-grid">
            {user.role === "patient" && (
              <>
                <div className="feature-card"
                onClick={() => setCurrentPage("appointments")}
                style={{ cursor: "pointer" }}
                >
                  <h3>📅 Appointments</h3>
                  <p>Book and manage your doctor appointments.</p>
                </div>

                <div
                      className="feature-card"
                      onClick={() => setCurrentPage("medical-history")}
                      style={{ cursor: "pointer" }}
                   >
                 <h3>🩺 Medical History</h3>
                <p>View your previous medical records.</p>
               </div>
                <div
  className="feature-card"
  onClick={() => setCurrentPage("doctors")}
  style={{ cursor: "pointer" }}
>
  <h3>👨‍⚕️ Doctors</h3>
  <p>Check doctors and their availability.</p>
</div>
              </>
            )}

            {user.role === "doctor" && (
              <>
                <div className="feature-card"
                onClick={() => setCurrentPage("doctor-appointments")}
                style={{ cursor: "pointer" }}>

                  <h3>📅 Appointments</h3>
                  <p>View your upcoming patient appointments.</p>
                </div>

                <div className="feature-card"
                 onClick={() => setCurrentPage("doctor-patient-history")}
                  style={{ cursor: "pointer" }}>

                  <h3>🩺 Patient History</h3>
                  <p>View medical history of your patients.</p>
                </div>

                <div className="feature-card" 
                   onClick={() => setCurrentPage("doctor-availability")}
                   style={{ cursor: "pointer" }}>
                  <h3>⏰ Availability</h3>
                  <p>Manage your available days and timings.</p>
                </div>
              </>
            )}

            {user.role === "admin" && (
              <>
                <div className="feature-card"
                  onClick={() => setCurrentPage("admin-users")}
                 style={{ cursor: "pointer" }}>
                  <h3>👥 Users</h3>
                  <p>Manage patients, doctors and system users.</p>
                </div>

                <div className="feature-card" 
                onClick={() => setCurrentPage("admin-doctors")}
                 style={{ cursor: "pointer" }}>
                  <h3>👨‍⚕️ Doctors</h3>
                  <p>Manage doctor information.</p>
                </div>

                <div className="feature-card">
                  <h3>📊 System</h3>
                  <p>Monitor and manage the Hospital ERP system.</p>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Login page
  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-left">
          <div className="hospital-icon">🏥</div>

          <h1>Hospital ERP</h1>

          <p>
            A smart platform for managing patients, doctors,
            appointments and medical records.
          </p>

          <div className="login-features">
            <span>✓ Secure Login</span>
            <span>✓ Appointment Management</span>
            <span>✓ Medical Records</span>
          </div>
        </div>

        <div className="login-card">
          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Login to access your Hospital ERP account
          </p>

          <form onSubmit={handleLogin}>

            <label>User ID</label>

            <input
              type="text"
              placeholder="Enter your User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="login-note">
            Login using your Hospital ERP User ID and password.
          </p>
        </div>

      </div>
    </div>
  );
}

export default App;