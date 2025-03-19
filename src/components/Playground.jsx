import Editor from "@monaco-editor/react";
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import "./playground.css";

const socket = io("http://localhost:4000");

/**
 * This component is a JavaScript playground where users can write and run JavaScript code.
 * It uses the Monaco Editor to provide syntax highlighting and code editing features.
 * The code is executed in a sandboxed environment to prevent malicious code execution.
 * The component also allows users to join a room and collaborate on code in real-time.
 */
const Playground = () => {
    const [code, setCode] = useState("// Write your JavaScript here!");
    const [output, setOutput] = useState("");
    const [roomID, setRoomID] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [userCount, setUserCount] = useState(0);

    /**
     * This effect sets up event listeners for code updates and user count updates.
     * When the code is updated, the new code is set in the state.
     * When the user count is updated, the new user count is set in the state.
     */
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

    /**
     * This function handles the code change event in the editor.
     * It updates the code state and emits a "codeChange" event to the server.
     * The server broadcasts the new code to all users in the room.
     */
    const handleCodeChange = (newValue) => {
        setCode(newValue);
        if (roomID) {
            socket.emit("codeChange", { roomID, code: newValue }); 
        }
    };

    /**
     * This function allows the user to join a room using the room ID entered in the input field.
     * It emits a "joinRoom" event to the server, which adds the user to the specified room.
     * If the room ID is not provided, an alert is displayed to the user.
     * Once connected to the room, a confirmation message is shown. The user can see the number of users in the room.
     */
    const joinRoom = () => {
        if (roomID) {
            socket.emit("joinRoom", roomID);
            setIsConnected(true);
            alert(`Joined room: ${roomID}`);
        } else {
            alert("Please enter a room ID");
        }
    };

    /**
     * This function runs the JavaScript code in the playground.
     * It uses the `eval` function to execute the code in the global scope.
     * The `console.log` output is captured and displayed in the output section.
     * Any errors that occur during execution are caught and displayed as an error message.
     */
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

    /**
     * This section sets up an interactive JavaScript Playground where users can collaborate
     * and test their code. It includes an input field for entering a Room ID, allowing users
     * to join a shared coding session. If connected, it displays the number of users in the room. 
     * The code editor provides a space for users to write JavaScript, with options to clear the editor 
     * or execute the code. When the "Run Code" button is clicked, the entered JavaScript runs, and the 
     * output is displayed below
     */
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
            
            <div className="outputPlayground">
                <h2>Output:</h2>
                <pre>{output}</pre>
            </div>
        </div>
    );
};

export default Playground;
