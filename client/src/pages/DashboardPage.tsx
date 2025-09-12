import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { LogoutButton } from "../components/LogoutButton";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { StatsCard } from "../components/StatsCard";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Loader2 } from "lucide-react";

const API_URL = "https://algo-bull.onrender.com";

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
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [error, setError] = useState("");
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
    setError("");
    setStats(null);
    try {
      const response = await axios.get(
        `${API_URL}/api/stats/leetcode/${username}`
      );
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
      setError(
        "Failed to fetch stats. Please check the username and try again."
      );
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
        { platform: "leetcode", handle: username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("LeetCode handle saved successfully!");
      setSavedHandles((prev) => ({ ...prev, leetcode: username }));
    } catch (err) {
      console.error("Failed to save handle", err);
      toast.error("Failed to save handle.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-white/10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            AlgoBull Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-300">{user?.email}</p>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-10">
        {/* Saved Handles */}
        {Object.keys(savedHandles).length > 0 && (
          <Card className="mb-10 bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-slate-500 font-semibold">
                Your Saved Handles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {Object.entries(savedHandles).map(([platform, handle]) => (
                  <Badge
                    key={platform}
                    variant="secondary"
                    className="px-3 py-1 text-sm bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-white/10"
                  >
                    <span className="capitalize font-medium mr-2">
                      {platform}:
                    </span>
                    <span>{handle}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LeetCode Section */}
          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <img
                  src="https://leetcode.com/static/images/LeetCode_logo_rvs.png"
                  alt="LeetCode Logo"
                  className="w-7 h-7 bg-white rounded-full p-0.5"
                />
                <span className="font-semibold text-slate-400">LeetCode</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={fetchStats}
                className="flex flex-col sm:flex-row items-center gap-4 mb-6"
              >
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter LeetCode username"
                  className="flex-grow bg-black/50 border-white/10 text-white placeholder-gray-400"
                />
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    type="submit"
                    disabled={isLoadingStats}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  >
                    {isLoadingStats ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Fetching...
                      </span>
                    ) : (
                      "Get Stats"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={saveHandle}
                    disabled={!username}
                    className="flex-1 border-white/20 text-black hover:bg-white/10"
                  >
                    Save
                  </Button>
                </div>
              </form>

              {error && (
                <p className="text-red-400 text-center mt-4">{error}</p>
              )}

              <div className="flex justify-center mt-6">
                {stats && (
                  <StatsCard platform="LeetCode" username={username} stats={stats} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Section */}
          <Card className="flex flex-col items-center justify-center bg-black/30 border-dashed border-white/10">
            <CardHeader>
              <CardTitle className="text-gray-400">
                More platforms coming soon 🚀
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Codeforces, HackerRank, and more...
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
