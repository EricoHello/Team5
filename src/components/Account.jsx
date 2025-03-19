import React, { useState } from 'react';
import './account.css';

/**
 * 
 * This component allows users to sign up or log in to their account.
 * Users can enter their email and password to create an account or log in.
 * If the user is logged in, they can view their account details.
 */
const Account = () => {
    /**
     * The following useState are used to store relevant information for the user.
     */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [isSignup, setIsSignup] = useState(false);

    /**
     * This function validates the user input for email and password.
     * It checks if the email contains an "@" symbol and if the password is at least 8 characters long.
     * @returns {boolean} Returns true if the input is valid, false otherwise.
     */
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

    /**
     * 
     * This function handles the form submission for signing up or logging in.
     * It makes a POST request to the server with the user's email and password.
     * If the request is successful, the user is logged in and their details are displayed.
     * If there is an error, the error message is displayed to the user.
     */
    const handleSubmit = async () => {
        setError("");
        setUser(null);

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
                setUser({ id: data.id, username: data.username || "User" });
            } else {
                setError(data.error || "Request failed");
            }
        } catch (err) {
            setError("Failed to fetch");
        }
    };

    /**
     * This function handles the logout action. It clears the user details and reloads the
     * page to simulate a logout. This function is called when the user clicks the "Logout" button.
     */
    const handleLogout = () => {
        setUser(null);
        setEmail("");
        setPassword("");
        window.location.reload(); // Refresh the page to simulate logout
    };

    /**
     * This component returns different views based on whether the user is logged in or not.
     * If the user is logged in, it displays the user's account details and settings.
     */
    if (user) {
        return (
            <div className="account-container">
                <h1>Welcome, {user.username}!</h1>
                <p>Your email: {email}</p>

                <div className="streak-box">
                    <p>🔥 Your Streak: 1 Day</p>
                    <p>Complete the **Challenge of the Day** to extend your streak!</p>
                </div>

                <h2>Account Settings</h2>
                <button>Change Password</button>
                <button>Update Email</button>
                <button>Set Username</button>

                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        );
    }

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

            {error && <p style={{ color: "red" }}>{error}</p>}

            <p onClick={() => setIsSignup(!isSignup)} style={{ cursor: "pointer", color: "blue" }}>
                {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
            </p>
        </div>
    );
};

export default Account;