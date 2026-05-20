import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'bio_quiz'
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Biology Quiz API is running' });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all AQA modules
app.get('/api/modules', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, module_number FROM topics WHERE parent_topic_id IS NULL ORDER BY module_number'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// Get quizzes by module
app.get('/api/modules/:moduleId/quizzes', async (req, res) => {
  try {
    const { moduleId } = req.params;
    const result = await pool.query(
      'SELECT id, title, description, difficulty, question_count FROM quizzes WHERE topic_id = $1 ORDER BY created_at DESC',
      [moduleId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get quiz with questions
app.get('/api/quizzes/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const quizResult = await pool.query(
      'SELECT id, title, description, difficulty FROM quizzes WHERE id = $1',
      [quizId]
    );
    
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    const quiz = quizResult.rows[0];
    
    const questionsResult = await pool.query(
      'SELECT id, question, question_type, explanation FROM questions WHERE quiz_id = $1 ORDER BY created_at',
      [quizId]
    );
    
    const questions = await Promise.all(
      questionsResult.rows.map(async (q) => {
        const optionsResult = await pool.query(
          'SELECT id, option_text, is_correct FROM question_options WHERE question_id = $1 ORDER BY order_number',
          [q.id]
        );
        return {
          ...q,
          options: optionsResult.rows
        };
      })
    );
    
    res.json({ ...quiz, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Biology Quiz API running on http://localhost:${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/health`);
  console.log(`🎯 AQA Modules: http://localhost:${PORT}/api/modules`);
});

export { pool };
