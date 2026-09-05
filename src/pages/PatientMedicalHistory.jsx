import { useEffect, useState } from "react";

function PatientMedicalHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/medical-history/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to fetch medical history.");
          return;
        }

        setHistory(data);
      } catch (error) {
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalHistory();
  }, []);

  if (loading) {
    return (
      <div className="medical-history-page">
        <h1>🩺 My Medical History</h1>
        <div className="loading-message">Loading medical history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="medical-history-page">
        <h1>🩺 My Medical History</h1>
        <div className="error-card">{error}</div>
      </div>
    );
  }

  return (
    <div className="medical-history-page">
      <div className="page-header">
        <h1>🩺 My Medical History</h1>
        <p>View your previous medical records and health information.</p>
      </div>

      {history.length === 0 ? (
        <div className="empty-history">
          <div className="empty-icon">📋</div>
          <h2>No Medical Records Found</h2>
          <p>You currently don't have any medical history records.</p>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((record) => (
            <div className="history-card" key={record._id}>
              
              <div className="history-card-header">
                <div>
                  <span className="record-label">Medical Condition</span>
                  <h2>{record.disease}</h2>
                </div>

                <span className="record-date">
                  {new Date(record.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="history-details">

                <div className="history-item">
                  <span>🤧 Allergies</span>
                  <strong>{record.allergies || "None"}</strong>
                </div>

                <div className="history-item">
                  <span>💊 Medications</span>
                  <strong>{record.medications || "None"}</strong>
                </div>

                <div className="history-item">
                  <span>🏥 Previous Surgeries</span>
                  <strong>{record.previousSurgeries || "None"}</strong>
                </div>

                <div className="history-item notes">
                  <span>📝 Doctor's Notes</span>
                  <p>{record.notes || "No notes available."}</p>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientMedicalHistory;