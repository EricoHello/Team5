import React, { useEffect, useState } from 'react';
import './style.css';

const Account = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // TODO: Fetch user data from backend API
        fetch("https://your-backend.com/api/user", { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error("Error fetching user data:", err));
    }, []);

    if (!user) return <p>Loading...</p>;

    return (
        <div className="account-container">
            <h2>Welcome, {user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Member since: {new Date(user.created_at).toLocaleDateString()}</p>
            <button onClick={() => alert("Logout function pending")}>Logout</button>
        </div>
    );
};

export default Account;