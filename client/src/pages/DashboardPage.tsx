import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LogoutButton } from '../components/LogoutButton';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { StatsCard } from '../components/StatsCard';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const API_URL = 'https://algo-bull.onrender.com';

type LeetCodeStats = {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
};

type SavedHandles = {
  [key: string]: string; 
};

export const DashboardPage = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [error, setError] = useState('');
  const [savedHandles, setSavedHandles] = useState<SavedHandles>({});

  useEffect(() => {
    const getHandles = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${API_URL}/api/handles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedHandles(response.data);
        if (response.data.leetcode) {
          setUsername(response.data.leetcode);
        }
      } catch (err) {
        console.error("Failed to fetch handles", err);
      }
    };
    getHandles();
  }, [getAccessTokenSilently]);

  const fetchStats = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setIsLoadingStats(true);
    setError('');
    setStats(null);
    try {
      const response = await axios.get(`${API_URL}/api/stats/leetcode/${username}`);
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
      setError('Failed to fetch stats. Please check the username and try again.');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const saveHandle = async () => {
    if (!username) return;
    try {
      const token = await getAccessTokenSilently();
      await axios.post(
        `${API_URL}/api/handles`,
        { platform: 'leetcode', handle: username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("LeetCode handle saved successfully!");
      setSavedHandles(prev => ({ ...prev, leetcode: username }));
    } catch (err) {
      console.error("Failed to save handle", err);
      toast.error("Failed to save handle.");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">AlgoBull Dashboard</h1>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">{user?.email}</p>
          <LogoutButton />
        </div>
      </header>
      
      {/* --- ADDED THIS SECTION TO DISPLAY SAVED HANDLES --- */}
      {Object.keys(savedHandles).length > 0 && (
        <div className="mb-8 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Your Saved Handles</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(savedHandles).map(([platform, handle]) => (
              <Badge key={platform} variant="secondary" className="text-sm">
                <span className="capitalize font-medium mr-2">{platform}:</span>
                <span>{handle}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}
      {/* --- END OF ADDED SECTION --- */}
      
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="https://leetcode.com/static/images/LeetCode_logo_rvs.png" alt="LeetCode Logo" className="w-6 h-6 bg-white rounded-full p-0.5" />
                  LeetCode
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={fetchStats} className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                  <Input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter LeetCode username"
                    className="flex-grow"
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button type="submit" disabled={isLoadingStats} className="flex-1">
                      {isLoadingStats ? 'Fetching...' : 'Get Stats'}
                    </Button>
                    <Button type="button" variant="outline" onClick={saveHandle} disabled={!username} className="flex-1">
                      Save
                    </Button>
                  </div>
                </form>
                
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                
                <div className="flex justify-center mt-4">
                  {stats && (
                    <StatsCard platform="LeetCode" username={username} stats={stats} />
                  )}
                </div>
            </CardContent>
        </Card>
        <Card className="flex flex-col items-center justify-center bg-muted/40 border-dashed">
            <CardHeader>
                <CardTitle className="text-muted-foreground">More platforms coming soon!</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Codeforces, HackerRank, and more...</p>
            </CardContent>
        </Card>
      </main>
    </div>
  );
};
