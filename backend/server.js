const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Check if we're in production (on Render)
const isProduction = process.env.DATABASE_URL.includes('dpg-');

// PostgreSQL connection - Configure SSL based on environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Create table for ubersurvey if not exists
const createTableQuery = `
CREATE TABLE IF NOT EXISTS survey_responses_compiled (
  id SERIAL PRIMARY KEY,
  session_id BIGINT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  mobile TEXT,
  age_range TEXT,
  residence TEXT,
  current_car TEXT,
  salary TEXT,
  model_interested TEXT,
  combined_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

pool.query(createTableQuery)
  .then(() => console.log('Survey responses table created or exists already'))
  .catch(err => console.error('Error creating table', err));

// API endpoint to create initial record with just session ID
app.post('/api/create-record', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    console.log('Creating initial record with session ID:', sessionId);
    
    const query = `
      INSERT INTO survey_responses_compiled (
        session_id, 
        first_name, 
        last_name, 
        mobile, 
        age_range, 
        residence, 
        current_car, 
        salary, 
        model_interested, 
        combined_note
      )
      VALUES ($1, '', '', '', '', '', '', '', '', '')
      RETURNING *
    `;
    
    const values = [sessionId];
    const result = await pool.query(query, values);
    
    console.log('Initial record created successfully');
    
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating initial record:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// API endpoint to update existing record
app.put('/api/update-record', async (req, res) => {
  try {
    const { 
      sessionId, 
      firstName, 
      lastName, 
      mobile, 
      ageRange, 
      residence, 
      currentCar, 
      salary, 
      modelInterested, 
      combinedNote 
    } = req.body;
    
    console.log('Updating record for session ID:', sessionId);
    
    const query = `
      UPDATE survey_responses_compiled
      SET 
        first_name = $2,
        last_name = $3,
        mobile = $4,
        age_range = $5,
        residence = $6,
        current_car = $7,
        salary = $8,
        model_interested = $9,
        combined_note = $10
      WHERE session_id = $1
      RETURNING *
    `;
    
    const values = [
      sessionId, 
      firstName, 
      lastName, 
      mobile, 
      ageRange, 
      residence, 
      currentCar, 
      salary, 
      modelInterested, 
      combinedNote
    ];
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }
    
    console.log('Record updated successfully');
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// API endpoint to check database connection
app.get('/api/db-status', async (req, res) => {
  try {
    // Simple query to check database connection
    const result = await pool.query('SELECT NOW() as current_time');
    
    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      timestamp: result.rows[0].current_time,
      environment: isProduction ? 'production' : 'development'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: error.message
    });
  }
});

// Test endpoint to verify server is working
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Backend server is working' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
});