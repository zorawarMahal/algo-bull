import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

// This type defines the "shape" of the stats object the card expects to receive.
// It must match the data structure from our backend API and the type in DashboardPage.tsx.
type Stats = {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
};

// This interface defines all the props that our StatsCard component needs.
interface StatsCardProps {
  platform: string;
  username: string;
  stats: Stats;
}

export const StatsCard = ({ platform, username, stats }: StatsCardProps) => {
  return (
    <Card className="w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
      <CardHeader>
        <CardTitle className="capitalize text-xl">
          {platform} Stats for <span className="text-primary">{username}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-base">
        <div className="font-semibold text-muted-foreground">Total Solved:</div>
        <div className="font-bold text-right">{stats.totalSolved}</div>
        
        <div className="text-green-500 font-semibold">Easy:</div>
        <div className="text-green-500 font-bold text-right">{stats.easySolved}</div>
        
        <div className="text-yellow-500 font-semibold">Medium:</div>
        <div className="text-yellow-500 font-bold text-right">{stats.mediumSolved}</div>
        
        <div className="text-red-500 font-semibold">Hard:</div>
        <div className="text-red-500 font-bold text-right">{stats.hardSolved}</div>
      </CardContent>
    </Card>
  );
};