import React, { useState, useEffect } from "react";
import './Discussion.css';

const Discussion = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState("");

    // Fetch messages from backend
    useEffect(() => {
        fetch("http://localhost:1234/api/discord/messages")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch messages");
                }
                return response.json();
            })
            .then(data => {
                console.log("Received data:", data);
                if (Array.isArray(data)) {
                    setMessages(data);
                } else {
                    setError("Received data is not in expected format.");
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Handle message submission
    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await fetch("http://localhost:1234/api/discord/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage }),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            const data = await response.json();
            console.log("Message sent:", data);

          
            setMessages(prevMessages => [
                { author: { username: "You" }, content: newMessage },
                ...prevMessages,
            ]);

            setNewMessage(""); 
        } catch (error) {
            console.error("Error sending message:", error);
            setError(error.message);
        }
    };

    return (
        <div className="discussion">
            <h2>Discord Messages</h2>

            {loading ? (
                <p>Loading messages...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div id="discussionBoard">
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <p key={index} id="message">
                                <strong>{message.author.username}</strong>: {message.content}
                            </p>
                        ))
                    ) : (
                        <p>No messages available.</p>
                    )}
                </div>
            )}

            {/* Message input area */}
            <div className="message-input">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                ></textarea>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Discussion;
