// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkJwt } from './middleware/auth'; // Import our gatekeeper
import pool from './config/database'; // Import our database pool
import usersRouter from './routes/users'; 
import statsRouter from './routes/stats'; 
import handlesRouter from './routes/handles'; 


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: 'https://algo-bull-ecru.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use('/api/users', usersRouter); // <-- Add this
app.use('/api/stats', statsRouter); // <-- Add this
app.use('/api/handles', handlesRouter); // <-- Add this line


// == PUBLIC ROUTE ==
// This route does not require authentication
app.get('/api/public', (req: Request, res: Response) => {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.',
  });
});

// == PROTECTED ROUTE ==
// This route requires a valid JWT. The checkJwt middleware will enforce this.
app.get('/api/protected', checkJwt, async (req: Request, res: Response) => {
  try {
    // Let's test our database connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()'); // A simple query to get the current time from the DB
    client.release(); // Release the client back to the pool

    res.json({
      message: 'Hello from a protected endpoint! You are authenticated.',
      dbTime: result.rows[0].now, // Send back the time from the database
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({ message: 'Failed to connect to the database.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
