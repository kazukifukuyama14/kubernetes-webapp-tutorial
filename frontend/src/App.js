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
      const response = await fetch("http://localhost:3001/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kubernetes Demo App</h1>

        {loading && <p>Loading users...</p>}

        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {!loading && !error && (
          <div>
            <h2>Users ({users.length})</h2>
            {users.length > 0 ? (
              <ul style={{ textAlign: "left" }}>
                {users.map((user) => (
                  <li key={user.id}>
                    <strong>{user.name}</strong> - {user.email}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found</p>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
