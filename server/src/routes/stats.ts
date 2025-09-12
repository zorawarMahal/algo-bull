import express from 'express';
import axios from 'axios';

const router = express.Router();

// Existing LeetCode Route (No changes needed here)
router.get('/leetcode/:username', async (req, res) => {
  const { username } = req.params;
  const API_URL = `https://leetcode-stats-api.herokuapp.com/${username}`;

  try {
    const response = await axios.get(API_URL);
    res.json(response.data);
  } catch (error: any) {
    console.error(`Error fetching from LeetCode stats API for user ${username}:`, error.message);
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message || 'User not found or API error.' });
    }
    res.status(500).json({ message: 'Failed to fetch LeetCode stats.' });
  }
});

// --- NEW CODEFORCES ROUTE ---
router.get('/codeforces/:username', async (req, res) => {
  const { username } = req.params;
  const API_URL = `https://codeforces.com/api/user.info?handles=${username}`;

  try {
    const response = await axios.get(API_URL);

    // The Codeforces API has a 'status' field. We must check it.
    if (response.data.status !== 'OK') {
      // The 'comment' field usually contains the error reason, e.g., "handles: User not found"
      return res.status(404).json({ message: response.data.comment || 'User not found on Codeforces.' });
    }

    // The user data is in the 'result' array (usually with one element)
    const userData = response.data.result[0];

    // We select and format the most important data to send to our frontend
    const formattedStats = {
      handle: userData.handle,
      rating: userData.rating || 0, // Use 0 if unrated
      rank: userData.rank || 'Unrated',
      maxRating: userData.maxRating || 0,
      maxRank: userData.maxRank || 'Unrated',
      avatar: userData.avatar,
    };

    res.json(formattedStats);
  } catch (error: any) {
    console.error(`Error fetching from Codeforces API for user ${username}:`, error.message);
    res.status(500).json({ message: 'Failed to fetch Codeforces stats.' });
  }
});


export default router;
