import React, { useState } from 'react';
import './account.css';

const Account = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState("");
    const [isSignup, setIsSignup] = useState(false);

    const validateInput = () => {
        if (!email.includes("@")) {
            setError("Invalid email format");
            return false;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        setError("");
        setUserId(null);

        if (!validateInput()) return;

        const endpoint = isSignup ? "signup" : "login";

        try {
            const response = await fetch(`http://localhost:1234/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setUserId(data.id);
            } else {
                setError(data.error || "Request failed");
            }
        } catch (err) {
            setError("Failed to fetch");
        }
    };

    return (
        <div className="account-container">
            <h1>{isSignup ? "Sign Up" : "Login"}</h1>
            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>{isSignup ? "Sign Up" : "Login"}</button>

            {userId && <p>Your User ID: {userId}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <p onClick={() => setIsSignup(!isSignup)} style={{ cursor: "pointer", color: "blue" }}>
                {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
            </p>
        </div>
    );
};

export default Account;