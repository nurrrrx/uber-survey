const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection - Modified to disable SSL for local development
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Disable SSL for local development
});

// Create table if not exists
const createTableQuery = `
CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  session_id BIGINT NOT NULL,
  question_number INTEGER NOT NULL,
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

pool.query(createTableQuery)
  .then(() => console.log('Survey responses table created or exists already'))
  .catch(err => console.error('Error creating table', err));

// API endpoint to save survey response
app.post('/api/survey-response', async (req, res) => {
  try {
    const { sessionId, questionNumber, question, response } = req.body;
    
    console.log('Received survey response:', { sessionId, questionNumber, question, response });
    
    const query = `
      INSERT INTO survey_responses (session_id, question_number, question, response)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [sessionId, questionNumber, question, response.toString()];
    const result = await pool.query(query, values);
    
    console.log('Survey response saved successfully');
    
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error saving survey response:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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
});