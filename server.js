require('dotenv').config();

const express = require('express');
const sql = require('mssql');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

const connectionString =
  process.env.SQL_CONN_STR || process.env.ConnectionString;

app.use(express.json());
app.use(express.static(__dirname));

function getPool() {
  if (!connectionString) {
    throw new Error(
      'Database connection string not configured. Set SQL_CONN_STR or ConnectionString in environment variables.'
    );
  }

  return sql.connect({
    connectionString,
    options: {
      encrypt: true
    }
  });
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

  let pool;

  try {
    pool = await getPool();

    const request = pool.request();
    request.input('name', sql.NVarChar(100), name.trim());
    request.input('email', sql.NVarChar(100), email.trim());
    request.input('subject', sql.NVarChar(150), subject.trim());
    request.input('message', sql.NVarChar(sql.MAX), message.trim());

    await request.query(`
      INSERT INTO ContactSubmissions (FullName, Email, Subject, Message)
      VALUES (@name, @email, @subject, @message)
    `);

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
  } finally {
    if (pool) {
      await pool.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
