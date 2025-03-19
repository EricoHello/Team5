import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import './challenge.css';

/**
 * This component displays the daily coding challenge and allows users to write and run code.
 * The component fetches the daily challenge from the server and displays it to the user.
 * Users can write code in the editor, run the code, and see the output.
 * Users can also save their code submissions to the server.
 */
const Challenge = () => {
    const [code, setCode] = useState("// Write your code here...");
    const [output, setOutput] = useState("");
    const [challenge, setChallenge] = useState({});
    
    /**
     * This effect fetches the daily challenge from the server when the component mounts.It sets the challenge 
     * state with the fetched data. If there is an error fetching the challenge, an error message is logged
     * to the console.
     */
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

    /**
     * This function sends the user's code to the server for execution using the EMKC API.
     * It sends a POST request to the API with the code, language, version, and runtime information.
     * The API response is then processed, and the output is set in the state.
     * If there is an error during execution, an error message is displayed in the output area.
     */
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
                    version: "18.15.0", 
                    runtime: "node", 
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

    /**
     * This function saves the user's code submission to the server.
     * It sends a POST request to the server with the code and the user ID.
     * If the submission is saved successfully, an alert is displayed to the user.
     */ 
    const saveSubmission = async () => {
        await fetch("/api/save-submission", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, userId: 123 }),
        });
        alert("Submission Saved!");
    };

    /**
     * This component renders a coding challenge interface where the user can view a challenge question 
     * and an example solution. It includes an interactive code editor powered by CodeMirror, allowing 
     * the user to write and modify JavaScript code. The "Run Code" button triggers the execution of the 
     * code, displaying the result in an output section. Additionally, the "Submit" button allows the user 
     * to submit their code. The component maintains state for the code editor's value and dynamically updates 
     * the output as the user interacts with the editor.
     */
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