import { useEffect, useState } from "react";
import apiRequest from "../services/api";

function AdminUsers({ setCurrentPage, setSelectedUserId }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await apiRequest("/users");
            setUsers(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="admin-users-page">

            <div className="admin-page-header">
                <h1>👥 Manage Users</h1>
                <p>View all registered users in the Hospital ERP system.</p>
            </div>

            {loading && (
                <div className="admin-users-card">
                    <p>Loading users...</p>
                </div>
            )}

            {!loading && error && (
                <div className="admin-error">
                    ⚠️ {error}
                </div>
            )}

            {!loading && !error && users.length === 0 && (
                <div className="admin-users-card admin-empty">
                    <div style={{ fontSize: "45px" }}>👥</div>
                    <h2>No Users Found</h2>
                    <p>There are currently no registered users.</p>
                </div>
            )}

            {!loading && !error && users.length > 0 && (
                <div className="admin-users-list">

                    {users.map((user) => (
                        <div className="admin-user-card" key={user._id}
                           onClick={() => {
                            setSelectedUserId(user.userId);
                            setCurrentPage("admin-user-details");
                               }}
    style={{ cursor: "pointer" }} >

                            <div className="admin-user-info">
                                <h2>👤 {user.name}</h2>

                                <p>
                                    <strong>User ID:</strong> {user.userId}
                                </p>

                                <p>
                                    <strong>Email:</strong> {user.email}
                                </p>

                                <p>
                                    <strong>Role:</strong> {user.role}
                                </p>
                            </div>

                            <span
                                className={
                                    user.role === "admin"
                                        ? "user-role admin-role"
                                        : user.role === "doctor"
                                        ? "user-role doctor-role"
                                        : "user-role patient-role"
                                }
                            >
                                {user.role}
                            </span>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default AdminUsers;