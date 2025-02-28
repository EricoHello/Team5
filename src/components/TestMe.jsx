import React, { useState, useEffect } from 'react';
import './style.css';


const TestMe = () => {
    const [quizData, setQuizData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [correctCount, setCorrectCount] = useState(0);
    const [showResults, setShowResults] = useState(false);


    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [wrongQuestions, setWrongQuestions] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);


    useEffect(() => {
        fetch("https://students.washington.edu/is04/learn2code_db/api.php?action=getQuiz&lesson_id=1")
            .then(response => response.json())
            .then(data => {
                setQuizData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching quiz:", error);
                setLoading(false);
            });
    }, []);


    if (loading) {
        return <p>Loading quiz...</p>;
    }


    const handleSelection = (choice) => {
        setSelectedAnswers(prev =>
            ({ ...prev, [currentQuestion]: choice })
        );
    };


    const handleNextQuestion = () => {
        const currentQ = quizData[currentQuestion];
        const userAnswer = selectedAnswers[currentQuestion];

        if (currentQ.correct_answer === userAnswer) {
            setCorrectCount(prev => prev + 1);
        } else {
            setWrongQuestions(prev => [...prev, currentQ.question]);
            setWrongAnswers(prev => [...prev, userAnswer || "No answer"]);
            setCorrectAnswers(prev => [...prev, currentQ.correct_answer]);
        }

        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setShowResults(true);
        }
    };


    if (showResults) {
        return (
            <div id="scorecard">
                <h1>Quiz Completed!</h1>
                <p>Correct Answers: {correctCount} / {quizData.length}</p>
                <p>Score: {(correctCount / quizData.length * 100).toFixed(2)}%</p>
                {wrongQuestions.length > 0 && (
                    <div id="incorrectAnswers">
                        <h2>Incorrect Answers:</h2>
                        <ol>
                            {wrongQuestions.map((question, index) => (
                                <li key={index}>
                                    <strong>Question:</strong> {question} <br />
                                    <strong>Your Answer:</strong> {wrongAnswers[index]}   <br />
                                    <strong id="lastStrong">Correct Answer:</strong> {correctAnswers[index]}  <br />
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
                {
                    wrongQuestions.length === 0 && <h2>Congratulations! You got all the answers correct!</h2>
                }
            </div>
        );
    }


    return (
        <div>
            <h1>Quiz</h1>
            <div id="flashcard">
                <h3>{quizData[currentQuestion].question}</h3>
                {quizData[currentQuestion].choices.map((choice, i) => (
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
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswers[currentQuestion]}
                >
                    {currentQuestion < quizData.length - 1 ? "Next" : "Submit"}
                </button>
            </div>
        </div>
    );
};


export default TestMe;