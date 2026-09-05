import { useState } from "react";
import apiRequest from "../services/api";

function DoctorPatientHistory() {
  const [patientId, setPatientId] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!patientId.trim()) {
      setError("Please enter a Patient ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setHistory([]);

      const data = await apiRequest(
        `/medical-history/patient/${patientId.trim()}`
      );

      setHistory(data);
    } catch (error) {
      setError(error.message || "Unable to fetch patient history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-history-page">
      <div className="page-header">
        <h1>Patient Medical History</h1>
        <p>Search and view medical records of your patients.</p>
      </div>

      <div className="medical-history-card">
        <form onSubmit={handleSearch} className="history-search-form">
          <div>
            <label>Patient ID</label>
            <input
              type="text"
              placeholder="Enter Patient ID e.g. P10002"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
          </div>

          <button type="submit">
            🔍 Search Patient
          </button>
        </form>

        {loading && <p>Loading medical history...</p>}

        {error && <p className="availability-error">{error}</p>}

        {!loading && !error && history.length === 0 && patientId && (
          <p className="empty-message">
            No medical records found for this patient.
          </p>
        )}

        {history.length > 0 && (
          <div className="history-list">
            <h2>Medical Records</h2>

            {history.map((record) => (
              <div className="history-record" key={record._id}>
                <p>
                  <strong>Disease:</strong> {record.disease}
                </p>

                <p>
                  <strong>Allergies:</strong> {record.allergies}
                </p>

                <p>
                  <strong>Medications:</strong> {record.medications}
                </p>

                <p>
                  <strong>Previous Surgeries:</strong>{" "}
                  {record.previousSurgeries}
                </p>

                <p>
                  <strong>Notes:</strong> {record.notes || "None"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorPatientHistory;