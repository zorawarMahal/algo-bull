import express, { Request, Response } from 'express';
import { checkJwt } from '../middleware/auth';
import pool from '../config/database';

const router = express.Router();

// Helper function to get our internal user ID from an Auth0 ID
const getUserId = async (auth0Id: string): Promise<string | null> => {
    const result = await pool.query('SELECT id FROM users WHERE auth0_id = $1', [auth0Id]);
    if (result.rows.length > 0) {
        return result.rows[0].id;
    }
    return null;
};

// GET /api/handles - Retrieve all saved handles for the logged-in user
router.get('/', checkJwt, async (req: Request, res: Response) => {
    const auth0Id = req.auth?.payload.sub;
    if (!auth0Id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const userId = await getUserId(auth0Id);
        if (!userId) {
            return res.status(404).json({ message: 'User not found in our database' });
        }

        const handlesResult = await pool.query('SELECT platform, handle FROM platform_handles WHERE user_id = $1', [userId]);

        // Convert the array of rows into a simple { platform: handle } object
        const handles = handlesResult.rows.reduce((acc, row) => {
            acc[row.platform] = row.handle;
            return acc;
        }, {});

        res.json(handles);
    } catch (error) {
        console.error('Error fetching handles:', error);
        res.status(500).json({ message: 'Failed to fetch handles' });
    }
});

// POST /api/handles - Save or update a handle for a platform
router.post('/', checkJwt, async (req: Request, res: Response) => {
    const { platform, handle } = req.body;
    const auth0Id = req.auth?.payload.sub;

    if (!platform || !handle) {
        return res.status(400).json({ message: 'Platform and handle are required' });
    }
    if (!auth0Id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const userId = await getUserId(auth0Id);
        if (!userId) {
            return res.status(404).json({ message: 'User not found' });
        }

        // This is an "UPSERT" query.
        // It tries to INSERT a new row. If it fails because the (user_id, platform) pair
        // already exists (violating our unique constraint), it will UPDATE the handle instead.
        const query = `
            INSERT INTO platform_handles (user_id, platform, handle)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, platform)
            DO UPDATE SET handle = EXCLUDED.handle
            RETURNING *;
        `;

        const newHandle = await pool.query(query, [userId, platform, handle]);
        res.status(201).json(newHandle.rows[0]);
    } catch (error) {
        console.error('Error saving handle:', error);
        res.status(500).json({ message: 'Failed to save handle' });
    }
});

export default router;