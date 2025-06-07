import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Kubernetes環境用のAPI URL（MinikubeのNodePort経由）
      const apiUrl = `http://${window.location.hostname}:30001/api/users`;
      console.log("Fetching from:", apiUrl); // デバッグ用

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kubernetes Demo App</h1>
        <div className="users-container">
          <h2>Users ({users.length})</h2>
          <ul className="users-list">
            {users.map((user) => (
              <li key={user.id} className="user-item">
                <strong>{user.name}</strong> - {user.email}
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
