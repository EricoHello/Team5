import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './testme.css';

const TestMe = () => {
    const [language, setLanguage] = useState("");
    const [quizData, setQuizData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [correctCount, setCorrectCount] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [wrongQuestions, setWrongQuestions] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [timeSpent, setTimeSpent] = useState(0);

    useEffect(() => {
        let timer;
        if (!showResults && language) {
            timer = setInterval(() => {
                setTimeSpent(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showResults, language]);

    useEffect(() => {
        if (!language) return;
        setLoading(true);
        setTimeSpent(0);
        fetch(`http://localhost:1234/api/quiz/language/${language}`)
            .then((res) => res.json())
            .then((data) => {
                setQuizData(data);
                setCurrentQuestion(0);
                setSelectedAnswers({});
                setCorrectCount(0);
                setWrongAnswers([]);
                setWrongQuestions([]);
                setCorrectAnswers([]);
                setShowResults(false);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [language]);

    const handleSelection = (choice) => {
        setSelectedAnswers(prev => ({ ...prev, [currentQuestion]: choice }));
    };

    const handleNextQuestion = () => {
        const currentQ = quizData[currentQuestion];
        const userAnswer = selectedAnswers[currentQuestion];
        
        if (userAnswer) {
            if (currentQ[`Choice${currentQ.CorrectAnswer}`] === userAnswer) {
                setCorrectCount(prev => prev + 1);
            } else {
                setWrongQuestions(prev => [...prev, currentQ.QuestionText]);
                setWrongAnswers(prev => [...prev, userAnswer]);
                setCorrectAnswers(prev => [...prev, currentQ[`Choice${currentQ.CorrectAnswer}`]]);
            }
        }
        
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setShowResults(true);
        }
    };

    if (loading) return <p>Loading questions...</p>;

    if (showResults) {
        const correctPercentage = (correctCount / quizData.length) * 100;
        const wrongPercentage = 100 - correctPercentage;
        const data = [
            { name: "Correct", value: correctPercentage, color: "#00FA9A" },
            { name: "Wrong", value: wrongPercentage, color: "#FF6347" }
        ];
        return (
            <div id="scorecard">
                <h1>Quiz Completed!</h1>
                <p>Correct Answers: {correctCount} / {quizData.length}</p>
                <p>Score: {correctPercentage.toFixed(2)}%</p>
                <p>Time Spent: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s</p>
                <PieChart width={400} height={300}>
                    <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={120} innerRadius={70} label>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
                {wrongQuestions.length > 0 && (
                    <div id="incorrectAnswers">
                        <h2>Incorrect Answers:</h2>
                        <ol>
                            {wrongQuestions.map((question, index) => (
                                <li key={index}>
                                    <strong>Question:</strong> {question} <br />
                                    <strong>Your Answer:</strong> {wrongAnswers[index]}   <br />
                                    <strong>Correct Answer:</strong> {correctAnswers[index]}  <br />
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
                {wrongQuestions.length === 0 && <h2>Congratulations! You got all the answers correct!</h2>}
            </div>
        );
    }

    if (language && quizData.length > 0) {
        const currentQ = quizData[currentQuestion];
        const choices = [currentQ.ChoiceA, currentQ.ChoiceB, currentQ.ChoiceC, currentQ.ChoiceD];
        return (
            <div>
                <h1>Quiz</h1>
                <div id="flashcard">
                    <h3>{currentQ.QuestionText}</h3>
                    {choices.map((choice, i) => (
                        <div key={i} id="choices">
                            <input
                                type="radio"
                                id={`choice${i}`}
                                name="question"
                                value={choice}
                                checked={selectedAnswers[currentQuestion] === choice}
                                onChange={() => handleSelection(choice)}
                            />
                            <label htmlFor={`choice${i}`}>{choice}</label>
                        </div>
                    ))}
                    <button
                        onClick={() => setCurrentQuestion(prev => Math.max(prev - 1, 0))}
                        disabled={currentQuestion === 0}
                    >
                        Back
                    </button>
                    <button
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswers[currentQuestion]}
                    >
                        {currentQuestion < quizData.length - 1 ? "Next" : "Submit"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
           <h1>Choose a Language & Challenge Your Skills!</h1>
            <div id="languageChoices">
                <button onClick={() => setLanguage("HTML_CSS")}><img src="src/images/HTML.png" alt="HTML" /><h2>HTML & CSS Questions</h2></button>
                <button onClick={() => setLanguage("JavaScript")}><img src="src/images/js.png" alt="JavaScript" /><h2>JavaScript Questions</h2></button>
                <button onClick={() => setLanguage("Python")}><img src="src/images/python.jpg" alt="Python" /><h2>Python Questions</h2></button>
                <button onClick={() => setLanguage("SQL")}><img src="src/images/sql.jpg" alt="SQL" /><h2>SQL Questions</h2></button>
                <button onClick={() => setLanguage("general")}><img src="src/images/general.jpg" alt="General" /><h2>General Questions</h2></button>
            </div>
        </div>
    );
};

export default TestMe;
