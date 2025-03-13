import React from 'react';
import { Link } from 'react-router-dom';
import './ThankYou.css';

function ThankYou() {
  return (
    <div className="thank-you">
      <h2>Thank You!</h2>
      <p>Your responses have been submitted successfully.</p>
      <p>A BYD Al-Futtaim sales representative will contact you shortly to discuss your car purchase options.</p>
      <Link to="/" className="start-over">Fill Another Form</Link>
    </div>
  );
}

export default ThankYou;