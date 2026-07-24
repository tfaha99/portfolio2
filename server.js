require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(__dirname));

// MySQL Connection Helper
function getPool() {
  const connectionString = process.env.MYSQL_CONN_STR || process.env.ConnectionString;

  // Option A: If using a full MySQL connection string/URL
  if (connectionString) {
    return mysql.createPool(connectionString);
  }

  // Option B: If Azure sets individual environment variables
  if (process.env.DB_HOST) {
    return mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      ssl: { rejectUnauthorized: false }
    });
  }

  throw new Error(
    'Database connection string not configured. Set MYSQL_CONN_STR or DB_HOST environment variables.'
  );
}

function validateContactPayload(body) {
  const errors = [];

  if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
    errors.push('Name is required.');
  }

  if (!body.email || typeof body.email !== 'string' || !body.email.trim()) {
    errors.push('Email is required.');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email.trim())) {
      errors.push('Email format is invalid.');
    }
  }

  if (!body.subject || typeof body.subject !== 'string' || !body.subject.trim()) {
    errors.push('Subject is required.');
  }

  if (!body.message || typeof body.message !== 'string' || !body.message.trim()) {
    errors.push('Message is required.');
  }

  return errors;
}

app.post('/api/contact', async (req, res) => {
  const validationErrors = validateContactPayload(req.body);

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: validationErrors.join(' ')
    });
  }

  const { name, email, subject, message } = req.body;

  try {
    const pool = getPool();

    // MySQL parameterized query using ? positional placeholders
    const query = `
      INSERT INTO ContactSubmissions (FullName, Email, Subject, Message)
      VALUES (?, ?, ?, ?)
    `;

    await pool.execute(query, [
      name.trim(),
      email.trim(),
      subject.trim(),
      message.trim()
    ]);

    return res.status(201).json({
      success: true,
      message: 'Message saved!'
    });
  } catch (error) {
    console.error('Contact submission error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to save your message. Please try again later.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
