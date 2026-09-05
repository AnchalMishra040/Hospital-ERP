import { useEffect, useState } from "react";
import apiRequest from "../services/api";

function AdminUserDetails({ userId, onBack }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError("");

                const users = await apiRequest("/users");

                const selectedUser = users.find(
                    (item) => item.userId === userId
                );

                if (!selectedUser) {
                    throw new Error("User not found");
                }

                setUser(selectedUser);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) {
        return (
            <div className="admin-user-details-page">
                <div className="admin-users-card">
                    <p>Loading user details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-user-details-page">
                <div className="admin-error">
                    ⚠️ {error}
                </div>

                <button className="user-back-btn" onClick={onBack}>
                    ← Back to Users
                </button>
            </div>
        );
    }

    return (
        <div className="admin-user-details-page">

            <div className="admin-user-details-header">
                <button className="user-back-btn" onClick={onBack}>
                    ← Back to Users
                </button>

                <h1>👤 User Details</h1>
                <p>View complete information about this user.</p>
            </div>

            <div className="admin-user-details-card">

                <div className="user-details-avatar">
                    👤
                </div>

                <div className="user-details-content">

                    <h2>{user.name}</h2>

                    <div className="user-detail-row">
                        <span>🆔 User ID</span>
                        <strong>{user.userId}</strong>
                    </div>

                    <div className="user-detail-row">
                        <span>📧 Email</span>
                        <strong>{user.email}</strong>
                    </div>

                    <div className="user-detail-row">
                        <span>🏷️ Role</span>
                        <strong className={`user-role ${user.role}-role`}>
                            {user.role}
                        </strong>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminUserDetails;