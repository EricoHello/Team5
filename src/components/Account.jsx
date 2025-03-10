import React, { useState } from 'react';
import './style.css';

const Account = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(null);
    const [error, setError] = useState("");

    const fetchPassword = async () => {
        setError("");
        setPassword(null);

        try {
            const response = await fetch("http://localhost:1234/get-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setPassword(data.password);
            } else {
                setError(data.error || "Error fetching password");
            }
        } catch (err) {
            setError("Failed to fetch");
        }
    };

    return (
        <div className="account-container">
            <h1>Enter Your Email</h1>
            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={fetchPassword}>Get Password</button>

            {password && <p>Your password: {password}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Account;