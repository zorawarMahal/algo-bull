import express, { Request, Response } from 'express';
import { checkJwt } from '../middleware/auth';
import pool from '../config/database';

const router = express.Router();

// POST /api/users/sync
// This endpoint syncs the Auth0 user with our local database
router.post('/sync', checkJwt, async (req: Request, res: Response) => {
  const auth0Id = req.auth?.payload.sub;
  const email = req.auth?.payload['email'];

  if (!auth0Id) {
    return res.status(400).json({ message: 'Missing user ID in token' });
  }

  try {
    let user = await pool.query('SELECT * FROM users WHERE auth0_id = $1', [auth0Id]);

    if (user.rows.length === 0) {
      user = await pool.query(
        'INSERT INTO users (auth0_id, email) VALUES ($1, $2) RETURNING *',
        [auth0Id, email]
      );
      console.log('New user created:', user.rows[0]);
    }

    res.json(user.rows[0]);
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ message: 'Error syncing user data' });
  }
});

export default router;