import React, { useState } from 'react';
import './style.css';

const Home = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logging in with", email, password);
        // TODO: Connect to backend for authentication
    };

    return (
        <div className="home-container">
            <h1 className="mission">Practice Coding with Learn2Code</h1>
            <p className="description">Learn2Code offers interactive quizzes and exercises to improve your coding skills efficiently.</p>

            <form className="login-box" onSubmit={handleLogin}>
                <input
                    type="email" placeholder="Email" value={email}
                    onChange={(e) => setEmail(e.target.value)} required
                />
                <input
                    type="password" placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)} required
                />
                <br />
                <input type="checkbox" id="remember-me" />
                <label htmlFor="remember-me">Remember me</label>
                <br />
                <button type="submit">Login</button>
            </form>

            <div className="auth-links">
                <button className="signup-btn">Sign Up</button>
                <button className="forgot-password-btn">Forgot Password?</button>
            </div>
        </div>
    );
};

export default Home;