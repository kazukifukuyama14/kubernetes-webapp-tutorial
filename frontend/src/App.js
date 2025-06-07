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
      // 相対パスでプロキシ経由アクセス
      const apiUrl = "/api/users";
      console.log("Fetching from:", apiUrl);

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Success! Data:", data);
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
