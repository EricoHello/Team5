import Editor from "@monaco-editor/react";
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import "./style.css";

const socket = io("http://localhost:4000");

const Playground = () => {
    const [code, setCode] = useState("// Write your JavaScript here!");
    const [output, setOutput] = useState("");
    const [roomID, setRoomID] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        socket.on("codeUpdate", (newCode) => {
            setCode(newCode);
        });

        socket.on("updateUserCount", (count) => {
            setUserCount(count);
        });

        return () => {
            socket.off("codeUpdate");
            socket.off("updateUserCount");
        };
    }, []);

    const handleCodeChange = (newValue) => {
        setCode(newValue);
        if (roomID) {
            socket.emit("codeChange", { roomID, code: newValue }); 
        }
    };

    
    const joinRoom = () => {
        if (roomID) {
            socket.emit("joinRoom", roomID);
            setIsConnected(true);
            alert(`Joined room: ${roomID}`);
        } else {
            alert("Please enter a room ID");
        }
    };

    const runCode = () => {
        try {
            let log = [];
            const originalConsoleLog = console.log;
            console.log = (...args) => log.push(args.join(" "));

            eval(code);

            console.log = originalConsoleLog;
            setOutput(log.join("\n") || "No output");
        } catch (error) {
            setOutput("Error: " + error.message);
        }
    };

    return (
        <div className="playground-container">
            <h1>JavaScript Playground</h1>

            {/* room input */}
            <input
                type="text"
                placeholder="Enter Room ID"
                value={roomID}
                onChange={(e) => setRoomID(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>

            {/* show number of users in the room */}
            {isConnected && <p>Users in Room: <strong>{userCount}</strong></p>}

            <Editor
                height="300px"
                language="javascript"
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
            />
            
            <button onClick={runCode}>Run Code</button>
            <button onClick={() => setCode("// Write your JavaScript here!")}>Clear</button>
            
            <div className="output">
                <h2>Output:</h2>
                <pre>{output}</pre>
            </div>
        </div>
    );
};

export default Playground;
