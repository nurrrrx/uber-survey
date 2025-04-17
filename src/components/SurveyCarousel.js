import React, { useState, createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SurveyCarousel.css';


// Create a context for language
const LanguageContext = createContext();

// Language resources
const resources = {
  en: {
    dir: 'ltr',
    firstName: "First name",
    lastName: "Last name",
    mobile: "Mobile number",
    carModel: "What model of car are you interested in?",
    salary: "What is your current salary range?",
    city: "What is your city of residence?",
    age: "What is your current age?",
    currentCar: "Which car do you currently drive?",
    introText: "Thank you for your interest in purchasing a car from BYD Al-Futtaim. Please fill out this simple form, and a sales representative will contact you as soon as possible.",
    question: "Question",
    of: "of",
    next: "Next",
    back: "Back",
    submit: "Submit",
    saving: "Saving...",
    phoneErrorStart: "Mobile number should start with 5",
    phoneErrorLength: "Please enter 9 digits for mobile number",
    requiredError: "Please provide an answer to continue",
    selectError: "Please select an option to continue",
    checkboxError: "Please select at least one option to continue",
    salaryOptions: [
      "SAR 0 - 10,000 per month", 
      "SAR 10,000 - 15,000 per month", 
      "SAR 15,000 - 20,000 per month", 
      "SAR more than 20,000 per month"
    ],
    cityOptions: ["Riyadh", "Jeddah", "Makkah", "Madinah", "Dammam", "Other"],
    ageOptions: [
      "18 - 25 years old", 
      "26 - 35 years old", 
      "36 - 45 years old", 
      "more than 45 years old"
    ],
    vehicleOptions: [
      { value: "BYD Qin Hybrid", display: "BYD Qin Hybrid", image: "/byd-qin.jpg" },
      { value: "BYD Song Hybrid", display: "BYD Song Hybrid", image: "/byd-song.jpg" },
      { value: "BYD Auto 3 Electric", display: "BYD Auto 3 Electric", image: "/byd-atto3.jpg" },
      { value: "BYD Han Electric", display: "BYD Han Electric", image: "/byd-han.jpg" },
      { value: "BYD Seal Electric", display: "BYD Seal Electric", image: "/byd-seal.jpg" }
      //{ value: "BYD Sealion 7 Electric", display: "BYD Sealion 7 Electric", image: "/byd-sealion7.jpg" }
    ]
  },
  ar: {
    dir: 'rtl',
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    mobile: "رقم الجوال",
    carModel: "ماهو الطراز المهتم بشرائه؟",
    salary: "ما هو نطاق الراتب الحالي؟",
    city: "المدينة",
    age: "ما هو عمرك؟",
    currentCar: "ما طراز سيارتك الحالية؟",
    introText: "شكرًا لاهتمامكم بشراء سيارة من شركة بي واي دي الفطيم. يرجى تعبئة هذا النموذج البسيط، وسيتواصل معكم أحد ممثلي المبيعات في أقرب وقت ممكن",
    question: "سؤال",
    of: "من",
    next: "التالي",
    back: "رجوع",
    submit: "إرسال",
    saving: "جاري الحفظ...",
    phoneErrorStart: "يجب أن يبدأ رقم الجوال بالرقم 5",
    phoneErrorLength: "الرجاء إدخال 9 أرقام لرقم الجوال",
    requiredError: "الرجاء تقديم إجابة للمتابعة",
    selectError: "الرجاء تحديد خيار للمتابعة",
    checkboxError: "الرجاء تحديد خيار واحد على الأقل للمتابعة",
    salaryOptions: [
      "من 0 - 10,000 ريال", 
      "من 10,000 - 15,000 ريال", 
      "من 15,000 - 20,000 ريال", 
      "أعلى من 20,000 ريال"
    ],
    cityOptions: ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام","أخرى"],
    ageOptions: [
      "18 - 25 سنة", 
      "26 - 35 سنة", 
      "36 - 45 سنة", 
      "أكثر من 45 سنة"
    ],
    vehicleOptions: [
      { value: "BYD Qin Hybrid", display: "BYD Qin الهجينة القابلة للشحن", image: "/byd-qin.jpg" },
      { value: "BYD Song Hybrid", display: "BYD Song الهجينة القابلة للشحن", image: "/byd-song.jpg" },
      { value: "BYD Auto 3 Electric", display: "BYD Auto 3 الكهربائية بالكامل", image: "/byd-atto3.jpg" },
      { value: "BYD Han Electric", display: "BYD Han الكهربائية بالكامل", image: "/byd-han.jpg" },
      { value: "BYD Seal Electric", display: "BYD Seal الكهربائية بالكامل", image: "/byd-seal.jpg" }
      //{ value: "BYD Sealion 7 Electric", display: "BYD Sealion 7 الكهربائية بالكامل", image: "/byd-sealion7.jpg" }
    ]
  }
};

// Language provider component
const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Try to get language from localStorage if available, default to Arabic
    try {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      return savedLanguage || 'ar'; // Default to Arabic
    } catch (e) {
      return 'ar'; // Default to Arabic if localStorage is not available
    }
  });
  
  const [resetSurvey, setResetSurvey] = useState(false);
  
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    // Store language preference in localStorage
    localStorage.setItem('preferredLanguage', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = resources[newLang].dir;
    
    // Trigger survey reset when language changes
    setResetSurvey(true);
  };

  // Set initial language and direction
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = resources[language].dir;
  }, [language]);
  
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, resetSurvey, setResetSurvey }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

function SurveyCarousel() {
  const { language, toggleLanguage, resetSurvey, setResetSurvey } = useLanguage();
  const t = resources[language];
  const en_t = resources['en'];
  const isRTL = language === 'ar';
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [error, setError] = useState('');
  const [visitedQuestions, setVisitedQuestions] = useState([0]); // Track visited questions
  const [sessionId, setSessionId] = useState(null); // Add session ID state
  const [recordCreated, setRecordCreated] = useState(false); // Track if record has been created
  
  const navigate = useNavigate();
  
  // Generate a session ID on component mount
  useEffect(() => {
    const newSessionId = Math.floor(Math.random() * 9000000000) + 1000000000;
    setSessionId(newSessionId);
  }, []);
  
  // Update questions when language changes
  useEffect(() => {
    const newQuestions = [
      { id: 1, text: t.firstName, text2: t.lastName, type: "name", label1:en_t.firstName, label2:en_t.lastName }, // Changed to a new type "name"
      { id: 2, text: t.mobile, type: "phone" ,label:"Mobile Number"},
      { 
        id: 3, 
        text: t.age, 
        type: "radio", 
        options: t.ageOptions,
        label:en_t.age
      },
      { 
        id: 4, 
        text: t.city, 
        type: "radio", 
        options: t.cityOptions,
        label: en_t.city
      },
      { id: 5, text: t.currentCar, type: "text" , label:en_t.currentCar},
      { 
        id: 6, 
        text: t.salary, 
        type: "radio", 
        options: t.salaryOptions,
        label:en_t.salary
      },
      { 
        id: 7, 
        text: t.carModel, 
        type: "carradio", //Previously multi-select checkbox: changes requested by Suhail Mistry
        options: t.vehicleOptions,
        label:en_t.carModel
      }
    ];
    setQuestions(newQuestions);
  }, [language, t]);
  
  // Handle survey reset when language changes
  useEffect(() => {
    if (resetSurvey) {
      // Reset all survey state
      setCurrentQuestionIndex(0);
      setAnswers({});
      setPhoneNumber('');
      setPhoneError('');
      setError('');
      setVisitedQuestions([0]);
      setRecordCreated(false);
      
      // Generate a new session ID
      const newSessionId = Math.floor(Math.random() * 9000000000) + 1000000000;
      setSessionId(newSessionId);
      
      // Reset the flag
      setResetSurvey(false);
    }
  }, [resetSurvey, setResetSurvey]);
  
  // Update phoneNumber field when returning to phone question
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex === 1) { // Phone question index
      const phoneAnswer = answers[questions[currentQuestionIndex].id];
      if (phoneAnswer && phoneAnswer.startsWith('+966')) {
        // Extract the phone number without the prefix
        setPhoneNumber(phoneAnswer.replace('+966', ''));
      }
    }
  }, [currentQuestionIndex, questions, answers]);
  
  const handleChange = (e) => {
    setError('');
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: e.target.value
    });
  };
  
  // Handle name field changes
  const handleNameChange = (field, value) => {
    setError('');
    const questionId = questions[currentQuestionIndex].id;
    
    // Initialize or update the name object in answers
    const currentNameData = answers[questionId] || {};
    const updatedNameData = {
      ...currentNameData,
      [field]: value
    };
    
    setAnswers({
      ...answers,
      [questionId]: updatedNameData
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
    
    const inputValue = e.target.value.replace(/\D/g, '');
    const formattedValue = inputValue.slice(0, 9);
    setPhoneNumber(formattedValue);
    
    if (formattedValue.length > 0) {
      const noLeadingZero = formattedValue.replace(/^0+/, '');
      
      if (!noLeadingZero.startsWith('5')) {
        setPhoneError(t.phoneErrorStart);
      } else if (noLeadingZero.length < 9) {
        setPhoneError(t.phoneErrorLength);
      } else {
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
    const currentSelections = answers[questionId] || [];
    
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


  const handleCarRadioChange = (value) => {
    setError('');
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: value
    });
  };
  
  const validateAnswer = () => {
    if (questions.length === 0) return false;
    
    const currentQuestion = questions[currentQuestionIndex];
    const answer = answers[currentQuestion.id];
    
    switch (currentQuestion.type) {
      case 'text':
        if (!answer || answer.trim() === '') {
          setError(t.requiredError);
          return false;
        }
        break;
      case 'name':
        if (!answer || !answer.firstName || !answer.lastName || 
            answer.firstName.trim() === '' || answer.lastName.trim() === '') {
          setError(t.requiredError);
          return false;
        }
        break;
      case 'phone':
        if (!answer || phoneError) {
          setError(phoneError || t.requiredError);
          return false;
        }
        break;
        case 'radio':
        case 'carradio':
        if (!answer) {
          setError(t.selectError);
          return false;
        }
        break;
      case 'checkbox':
        if (!answer || answer.length === 0) {
          setError(t.checkboxError);
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };
  
  // Create initial record with session ID only
  const createInitialRecord = async () => {
    try {
      console.log("Creating initial record with session ID:", sessionId);
      
      // Create a record with just the session ID
      await axios.post(`${process.env.REACT_APP_API_URL}/api/create-record`, {
        sessionId: sessionId
      });
      
      setRecordCreated(true);
      console.log("Initial record created successfully");
    } catch (error) {
      console.error("Error creating initial record:", error);
      // Continue anyway to not block the user experience
    }
  };
  
  const handleNext = async () => {
    if (!validateAnswer()) return;
    
    // If this is the first question and record hasn't been created yet, create it
    if (currentQuestionIndex === 0 && !recordCreated) {
      await createInitialRecord();
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // Add to visited questions if not already there
      if (!visitedQuestions.includes(nextIndex)) {
        setVisitedQuestions([...visitedQuestions, nextIndex]);
      }
    }
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setError(''); // Clear any errors when going back
    }
  };

  // Updated submit function - update existing record
  const handleSubmitandSave = async () => {
    if (!validateAnswer()) return;
    
    setLoading(true);

    try {
      const nonmandatorynote = "Age: " + answers[3] + ", Residence: " + answers[4] + ", Current Car: " + answers[5] + ", Salary: " + answers[6];

      // To edit upon changing order of question
      const payload = {
        sessionId: sessionId,
        firstName: answers[1]?.firstName || '',
        lastName: answers[1]?.lastName || '',
        mobile: answers[2] || '',
        ageRange: answers[3] || '',
        residence: answers[4] || '',
        currentCar: answers[5] || '',
        salary: answers[6] || '',
        modelInterested: answers[7] || '',
        combinedNote: nonmandatorynote
      };
      
      console.log("-- Updating Information --");
      console.log(payload);
      
      // Use the update endpoint to update the existing record
      await axios.put(`${process.env.REACT_APP_API_URL}/api/update-record`, payload);
      
      // Store current language preference in localStorage before navigation
      localStorage.setItem('preferredLanguage', language);
      
      // Navigate to thank you page
      navigate('/thank-you');
    } catch (error) {
      console.error("Error saving answers:", error);
      alert("Failed to submit form. Please try again.");
    }

    setLoading(false);
  };

  const renderQuestion = () => {
    if (questions.length === 0) return null;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    switch (currentQuestion.type) {
      case 'name':
        return (
          <div className="name-fields">
            <div className="name-field">
              <label className={isRTL ? 'rtl-label' : ''}>{currentQuestion.text}</label>
              <input
                type="text"
                value={(answers[currentQuestion.id]?.firstName) || ''}
                onChange={(e) => handleNameChange('firstName', e.target.value)}
                className="survey-input"
                placeholder={t.requiredError}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="name-field">
              <label className={isRTL ? 'rtl-label' : ''}>{currentQuestion.text2}</label>
              <input
                type="text"
                value={(answers[currentQuestion.id]?.lastName) || ''}
                onChange={(e) => handleNameChange('lastName', e.target.value)}
                className="survey-input"
                placeholder={t.requiredError}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        );
      case 'text':
        return (
          <input
            type="text"
            value={answers[currentQuestion.id] || ''}
            onChange={handleChange}
            className="survey-input"
            placeholder={t.requiredError}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        );
      case 'phone':
        return (
          <div className={`phone-input-container ${isRTL ? 'rtl' : ''}`}>
            <div className="phone-prefix">+966</div>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className="phone-input"
              placeholder="5XXXXXXXX"
              dir="ltr" // Phone numbers should always be LTR
            />
            {phoneError && <div className="input-error">{phoneError}</div>}
          </div>
        );
        // For the radio options, modify the rendering to conditionally order elements
      case 'radio':
        return (
          <div className="radio-options">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className={`radio-option ${isRTL ? 'rtl' : ''}`}>
                {isRTL ? (
            <>
                    <label htmlFor={`option-${index}`} className="rtl-label">
                      {option}
                    </label>
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name={`question-${currentQuestion.id}`}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleRadioChange(option)}
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name={`question-${currentQuestion.id}`}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleRadioChange(option)}
                    />
                    <label htmlFor={`option-${index}`}>
                      {option}
                    </label>
                  </>
                )}
              </div>
            ))}
          </div>
        );

      // For checkboxes, implement a similar change
      case 'checkbox':
        return (
          <div className="checkbox-options">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className={`checkbox-option ${isRTL ? 'rtl' : ''}`}>
                <div className={`checkbox-container ${isRTL ? 'rtl' : ''}`}>
                  {isRTL ? (
                    <>
                      <label htmlFor={`option-${index}`} className="rtl-label">
                        {option.display}
                      </label>
                      <input
                        type="checkbox"
                        id={`option-${index}`}
                        name={`question-${currentQuestion.id}`}
                        value={option.value}
                        checked={answers[currentQuestion.id]?.includes(option.value) || false}
                        onChange={handleCheckboxChange}
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="checkbox"
                        id={`option-${index}`}
                        name={`question-${currentQuestion.id}`}
                        value={option.value}
                        checked={answers[currentQuestion.id]?.includes(option.value) || false}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor={`option-${index}`}>
                        {option.display}
                      </label>
                    </>
                  )}
                </div>
                <div className="car-image">
                  <img 
                    src={option.image} 
                    alt={option.display}
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

        // New case for car radio buttons
      case 'carradio':
        return (
          <div className="checkbox-options">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className={`checkbox-option ${isRTL ? 'rtl' : ''}`}>
                <div className={`checkbox-container ${isRTL ? 'rtl' : ''}`}>
                  {isRTL ? (
                    <>
                      <label htmlFor={`option-${index}`} className="rtl-label">
                        {option.display}
                      </label>
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name={`question-${currentQuestion.id}`}
                        value={option.value}
                        checked={answers[currentQuestion.id] === option.value}
                        onChange={() => handleCarRadioChange(option.value)}
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name={`question-${currentQuestion.id}`}
                        value={option.value}
                        checked={answers[currentQuestion.id] === option.value}
                        onChange={() => handleCarRadioChange(option.value)}
                      />
                      <label htmlFor={`option-${index}`}>
                        {option.display}
                      </label>
                    </>
                  )}
                </div>
                <div className="car-image">
                  <img 
                    src={option.image} 
                    alt={option.display}
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
  
  // Guard against rendering before questions are loaded
  if (questions.length === 0) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className={`survey-carousel`}>
      <div className="intro-text">
        <p>{t.introText}</p>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="question-container">
        <h2>{t.question} {currentQuestionIndex + 1} {t.of} {questions.length}</h2>
        <div className="question">
          {questions[currentQuestionIndex].type !== 'name' && (
            <h3>{questions[currentQuestionIndex].text}</h3>
          )}
          {renderQuestion()}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
      
      <div className={`navigation ${isRTL ? 'rtl-navigation' : ''}`}>
        <div className="button-container">
          {/* Back button */}
          {currentQuestionIndex > 0 && (
            <button 
              onClick={handleBack} 
              className={`back-button`}
            >
              {t.back}
            </button>
          )}
          
          {/* Next/Submit button */}
          {currentQuestionIndex < questions.length - 1 ? (
            <button 
              onClick={handleNext} 
              className={`next-button`}
            >
              {t.next}
            </button>
          ) : (
            <button 
              onClick={handleSubmitandSave} //to modify based on testing handleSubmitandSave / handleSubmit
              disabled={loading}
              className={`submit-button`}
            >
              {loading ? t.saving : t.submit}
            </button>
          )}
        </div>
      </div>
      
      <div className="language-toggle">
        <button onClick={toggleLanguage} className="language-button">
          {language === 'en' ? 'التغيير إلى العربية' : 'Switch to English'}
        </button>
      </div>
    </div>
  );
}

export default function WrappedSurveyCarousel() {
  return (
    <LanguageProvider>
      <SurveyCarousel />
    </LanguageProvider>
  );
}