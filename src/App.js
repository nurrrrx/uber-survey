import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurveyCarousel from './components/SurveyCarousel';
import ThankYou from './components/ThankYou';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <header className="App-header">
          <h1>Uber Survey</h1>
        </header> */}
        <br/>
        <main>
          <Routes>
            <Route path="/" element={<SurveyCarousel />} />
            <Route path="/thank-you" element={<ThankYou />} />
          </Routes>
        </main>
        {/* <footer>
          <p>© {new Date().getFullYear()} Uber Survey</p>
        </footer> */}
      </div>
    </Router>
  );
}

export default App;