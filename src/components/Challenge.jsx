import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import './challenge.css';

const Challenge = () => {
    const [code, setCode] = useState("// Write your code here...");
    const [output, setOutput] = useState("");
    const [challenge, setChallenge] = useState({});
    
    // Fetch daily challenge
    useEffect(() => {
        fetch("http://localhost:1234/api/daily-challenge") 
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => setChallenge(data))
            .catch((err) => console.error("Error fetching challenge:", err));
    }, []);

    const runCode = async () => {
        console.log("Running code...");
    
        try {
            const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language: "javascript",
                    version: "18.15.0", // Correct version
                    runtime: "node", // Ensure we use Node.js
                    files: [{ content: code }],
                }),
            });
    
            console.log("API Response Status:", response.status);
            const data = await response.json();
            console.log("Full API Response:", data);
    
            if (!data || !data.run) {
                throw new Error("Invalid API response");
            }
    
            setOutput(data.run.stdout || "No output received");
        } catch (error) {
            console.error("Error executing code:", error);
            setOutput(`Error: ${error.message}`);
        }
    };

    const saveSubmission = async () => {
        await fetch("/api/save-submission", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, userId: 123 }),
        });
        alert("Submission Saved!");
    };

    return (
        <>
        <h2>Challenge of the Day</h2>
        <div className="root">
            
            <div className="question">
                <strong>{challenge.question}</strong>           
                <p className="solution">Example Solution:</p>
                <pre className="solution"><br/>{challenge.example_code}</pre>
            </div>

            {/* Code Editor */}
            <div className="codingBox">
                <CodeMirror
                    value={code}
                    extensions={[javascript()]}
                    width="100%"
                    height="400px"
                    theme={oneDark}
                    onChange={(value) => setCode(value)}
                />

                <button onClick={runCode}>Run Code</button>
                <button onClick={saveSubmission}>Submit</button>

                <div className="output">
                    <h3>Output:</h3>
                    <pre>{output}</pre>
                </div>
            </div>
        </div>
        </>
    );
};

export default Challenge;