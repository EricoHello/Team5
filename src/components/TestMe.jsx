import React, { useState, useEffect } from 'react';
// The recharts library is used for creating pie chart to make the quiz results more visual
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'; 
import './testme.css';

const TestMe = () => {
    /** 
     * These useState variables are used to store different data related to the TestMe feature, from tracking the selected
     * language and quiz data to managing user progress, answers, and final results. They also 
     * keep track of quiz timing, loading status, and incorrect responses, updates values as things change.
    */
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

    /**
     * This useEffect tracks how long the user spends on the quiz. If a language is selected and
     * the results aren’t shown yet, it starts a setTinterval timer that updates timeSpent every second. When
     * the component re-renders or the quiz ends, it clears the timer to prevent memory leaks.
     * */
    useEffect(() => {
        let timer;
        if (!showResults && language) {
            timer = setInterval(() => {
                setTimeSpent(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showResults, language]);

    /**
     * This useEffect fetches quiz questions when the user selects a language. It first ensures
     * a language is chosen, then sets loading to true and resets the timer. It fetches data from
     * the API, updates the quiz state with new questions, resets progress, and hides results. 
     * If the request fails, it stops loading to prevent a frozen state.
     */
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

    // This is a helper function that updates the selected answer for the current question.
    const handleSelection = (choice) => {
        setSelectedAnswers(prev => ({ ...prev, [currentQuestion]: choice }));
    };

    /**
     * This function checks the user's answer and updates their score. If the answer is correct, 
     * it increases the correct count. If it's wrong, it saves the question, the user's incorrect answer, 
     * and the correct one. Then, it moves to the next question or ends the quiz by showing the results if 
     * there are no more questions left.
     */
    const handleNextQuestion = () => {
        const currentQ = quizData[currentQuestion];
        const userAnswer = selectedAnswers[currentQuestion];
        
        if (userAnswer) {
            if (currentQ[`Choice${currentQ.CorrectAnswer}`] === userAnswer) {
                setCorrectCount(prev => prev + 1);
            } else {
                // If the answer is wrong, store the details
                setWrongQuestions(prev => [...prev, currentQ.QuestionText]);
                setWrongAnswers(prev => [...prev, userAnswer]);
                setCorrectAnswers(prev => [...prev, currentQ[`Choice${currentQ.CorrectAnswer}`]]);
            }
        }
        
        // If more questions remain, move forward; otherwise, show results
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setShowResults(true);
        }
    };

    // This is just an informative message to show while the quiz questions are being fetched.
    if (loading) return <p>Loading questions...</p>;

    /**
     * This section displays the final quiz results. It calculates the percentage of correct and incorrect answers
     * and display them using a pie chart. It also shows the user's total score, time spent on the quiz, and
     * a list of incorrectly answered questions along with the correct answers. If all answers are correct, it shows
     * a congratulatory message instead.
     */
    if (showResults) {
        const correctPercentage = (correctCount / quizData.length) * 100;// Calculate the percentage of correct answers
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

    /**
     * This section displays the quiz questions and choices. It maps over the choices for the current question
     * and displays them as radio buttons. It also shows navigation buttons to move between questions and a submit  
     * button that becomes active only when the user selects an answer. The user can go back to the previous question
     * or move to the next one. If the user is on the last question, the button text changes to "Submit".
     */
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

    /**
     * This shows the initial screen where the user can choose a language to start the quiz. It displays
     * buttons for different languages, each with an image and name. When a user clicks a button, it sets
     * the language state to that choice, which triggers the useEffect to fetch quiz questions for that language.
     */
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
