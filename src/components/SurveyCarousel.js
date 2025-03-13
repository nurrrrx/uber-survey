import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SurveyCarousel.css';

function SurveyCarousel() {
  const [questions] = useState([
    { id: 1, text: "Your name", type: "text" },
    { id: 2, text: "Your mobile number", type: "phone" },
    { 
      id: 3, 
      text: "What model of car are you interested in?", 
      type: "checkbox", 
      options: [
        { value: "BYD Qin Hybrid", image: "/byd-qin.jpg" },
        { value: "BYD Song Hybrid", image: "/byd-song.jpg" },
        { value: "BYD Auto 3 Electric", image: "/byd-atto3.jpg" },
        { value: "BYD Han Electric", image: "/byd-han.jpg" },
        { value: "BYD Seal Electric", image: "/byd-seal.jpg" }
      ]
    },
    { 
      id: 4, 
      text: "What is your current salary?", 
      type: "radio", 
      options: [
        "SAR 0 - 10,000 per month", 
        "SAR 10,000 - 20,000 per month", 
        "SAR more than 20,000 per month"
      ] 
    },
    { 
      id: 5, 
      text: "What is your city?", 
      type: "radio", 
      options: ["Riyadh", "Jeddah", "Makkah", "Madinah", "Dammam"] 
    },
    { 
      id: 6, 
      text: "What is your age?", 
      type: "radio", 
      options: [
        "18 - 25 years old", 
        "26 - 35 years old", 
        "35 - 45 years old", 
        "more than 45 years old"
      ] 
    },
    { id: 7, text: "Which car are you currently driving?", type: "text" },
    { 
      id: 8, 
      text: "Do you currently have another job?", 
      type: "radio", 
      options: ["Yes", "No"] 
    },
    { 
      id: 9, 
      text: "How long you worked for Uber?", 
      type: "radio", 
      options: ["1 year", "2 years", "3 years", "4 years or more"] 
    }
  ]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setError('');
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: e.target.value
    });
  };
  
  const handleRadioChange = (value) => {
    setError('');
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: value
    });
  };
  
  const handlePhoneChange = (e) => {
    setError('');
    setPhoneError('');
    
    // Allow only digits
    const inputValue = e.target.value.replace(/\D/g, '');
    
    // Limit to 9 digits (excluding the leading 0)
    const formattedValue = inputValue.slice(0, 9);
    
    setPhoneNumber(formattedValue);
    
    // Validate
    if (formattedValue.length > 0) {
      // Check if the number starts with 5 after removing any leading 0
      const noLeadingZero = formattedValue.replace(/^0+/, '');
      
      if (!noLeadingZero.startsWith('5')) {
        setPhoneError('Mobile number should start with 5');
      } else if (noLeadingZero.length < 9) {
        setPhoneError('Please enter 9 digits for mobile number');
      } else {
        // Valid phone, update answers
        setAnswers({
          ...answers,
          [questions[currentQuestionIndex].id]: `+966${noLeadingZero}`
        });
      }
    }
  };
  
  const handleCheckboxChange = (e) => {
    setError('');
    const questionId = questions[currentQuestionIndex].id;
    const value = e.target.value;
    
    // Initialize array if it doesn't exist
    const currentSelections = answers[questionId] || [];
    
    // Add or remove from array based on checkbox state
    let newSelections;
    if (e.target.checked) {
      newSelections = [...currentSelections, value];
    } else {
      newSelections = currentSelections.filter(item => item !== value);
    }
    
    setAnswers({
      ...answers,
      [questionId]: newSelections
    });
  };
  
  const validateAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answer = answers[currentQuestion.id];
    
    switch (currentQuestion.type) {
      case 'text':
        if (!answer || answer.trim() === '') {
          setError('Please provide an answer to continue');
          return false;
        }
        break;
        
      case 'phone':
        if (!answer || phoneError) {
          setError(phoneError || 'Please enter a valid mobile number');
          return false;
        }
        break;
        
      case 'radio':
        if (!answer) {
          setError('Please select an option to continue');
          return false;
        }
        break;
        
      case 'checkbox':
        if (!answer || answer.length === 0) {
          setError('Please select at least one option to continue');
          return false;
        }
        break;
        
      default:
        break;
    }
    
    return true;
  };
  
  const handleNext = async () => {
    if (!validateAnswer()) {
      return;
    }
    
    setLoading(true);
    const currentQuestion = questions[currentQuestionIndex];
    const answer = answers[currentQuestion.id];
    
    try {
      // If this is the first answered question, create a new session
      if (!sessionId) {
        const newSessionId = Math.floor(Math.random() * 9000000000) + 1000000000;
        setSessionId(newSessionId);
        
        // Save answer with the new session ID
        await saveAnswer(newSessionId, currentQuestion, answer);
      } else {
        // Save answer with existing session ID
        await saveAnswer(sessionId, currentQuestion, answer);
      }
      
      // Move to next question or finish
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        navigate('/thank-you');
      }
    } catch (error) {
      console.error("Error saving answer:", error);
      alert("There was an error saving your answer. Please try again.");
    }
    
    setLoading(false);
  };
  
  const saveAnswer = async (sid, question, response) => {
    const payload = {
      sessionId: sid,
      questionNumber: question.id,
      question: question.text,
      response: Array.isArray(response) ? response.join(", ") : response
    };
    
    // Send to backend API
    await axios.post(`${process.env.REACT_APP_API_URL}/api/survey-response`, payload);
  };
  
  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    switch (currentQuestion.type) {
      case 'text':
        return (
          <input
            type="text"
            value={answers[currentQuestion.id] || ''}
            onChange={handleChange}
            className="survey-input"
            placeholder="Your answer"
          />
        );
      
      case 'phone':
        return (
          <div className="phone-input-container">
            <div className="phone-prefix">+966</div>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="phone-input"
              placeholder="5XXXXXXXX"
            />
            {phoneError && <div className="input-error">{phoneError}</div>}
          </div>
        );
        
      case 'radio':
        return (
          <div className="radio-options">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="radio-option">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name={`question-${currentQuestion.id}`}
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleRadioChange(option)}
                />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="checkbox-options">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="checkbox-option">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id={`option-${index}`}
                    name={`question-${currentQuestion.id}`}
                    value={option.value}
                    checked={answers[currentQuestion.id]?.includes(option.value) || false}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={`option-${index}`}>{option.value}</label>
                </div>
                <div className="car-image">
                  <img 
                    src={option.image} 
                    alt={option.value}
                    onError={(e) => {
                      e.target.src = '/car-placeholder.jpg';
                      e.target.onerror = null;
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="survey-carousel">
      <div className="intro-text">
        <p>Thank you for your interest in purchasing a car from BYD Al-Futtaim. Please fill out this simple form, and a sales representative will contact you as soon as possible.</p>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="question-container">
        <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
        <div className="question">
          <h3>{questions[currentQuestionIndex].text}</h3>
          {renderQuestion()}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
      
      <div className="navigation">
        <button 
          onClick={handleNext} 
          disabled={loading}
          className="next-button"
        >
          {loading ? 'Saving...' : (currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish')}
        </button>
      </div>
    </div>
  );
}

export default SurveyCarousel;