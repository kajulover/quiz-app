import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { fetchQuestions } from './api';
import './Question.css';

const Question = () => {
  const [questions, setQuestions] = useState([]); // Questions array
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Question index
  const [selectedOption, setSelectedOption] = useState(null); // Selected option
  const [progress, setProgress] = useState(0); // Progress percentage
  const [loading, setLoading] = useState(true); // Loading state
  const [score, setScore] = useState(0); // Score
  const [isSubmitted, setIsSubmitted] = useState(false); // Check if quiz is submitted

  useEffect(() => {
    const getQuestions = async () => {
      setLoading(true);  // Set loading state true
      const quizQuestions = await fetchQuestions();
      setQuestions(quizQuestions || []);  // Fallback in case API returns undefined or null
      setLoading(false);  // Set loading state false when data is fetched
    };

    getQuestions();
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption) {
      // Check if selected option is correct
      if (selectedOption === questions[currentQuestionIndex].correct_answer) {
        setScore(score + 1);  // Increment score if answer is correct
      }

      setSelectedOption(null);  // Reset the selected option
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
        setProgress(((nextIndex + 1) / questions.length) * 100);  // Update progress
      }
    }
  };

  const handleSubmit = () => {
    if (selectedOption && selectedOption === questions[currentQuestionIndex].correct_answer) {
      setScore(score + 1);  // Increment score if last answer is correct
    }
    setIsSubmitted(true);  // Mark quiz as submitted
  };

  if (loading) {
    return <div>Loading...</div>;  // Show loading message until questions are fetched
  }

  if (!questions.length) {
    return <div>No questions available</div>;  // Handle case when no questions are fetched
  }

  if (isSubmitted) {
    // Show score after the last question
    return (
      <div className="question-container">
        <header className="header">
          <img
            src="data:image/png;base64,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"
            alt="Upraised Logo"
            className="logo"
          />
        </header>
        <div className="progress-container">
          <CircularProgressbar
            value={100}
            text={`100%`}
            styles={buildStyles({
              textSize: '16px',
              pathColor: `#ff4e4e`,
              textColor: '#ff4e4e',
            })}
          />
        </div>
        <div className="score-box">
          <h2>Your Score: {score}/{questions.length}</h2>
          <p>Well done! You completed the quiz.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex]; // Current question

  return (
    <div className="question-container">
      <header className="header">
        <img
          src="data:image/png;base64,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"
          alt="Upraised Logo"
          className="logo"
        />
      </header>
      <div className="progress-container">
        <CircularProgressbar
          value={progress}
          text={`${Math.round(progress)}%`}
          styles={buildStyles({
            textSize: '16px',
            pathColor: `#ff4e4e`,
            textColor: '#ff4e4e',
          })}
        />
      </div>
      <div className="question-box">
        <h2 dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
        <div className="options">
          {currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer).map((option, index) => (
            <label className='op' key={index}>
              <input 
                type="radio"
                name="option"
                value={option}
                onChange={() => handleOptionSelect(option)}
                checked={selectedOption === option}
              />
              <span dangerouslySetInnerHTML={{ __html: option }} />
            </label>
          ))}
        </div>
      </div>

      {currentQuestionIndex < questions.length - 1 ? (
        <button
          className="next-button"
          onClick={handleNext}
          disabled={!selectedOption}  // Disable button if no option is selected
        >
          Next
        </button>
      ) : (
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={!selectedOption}  // Disable button if no option is selected
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default Question;
