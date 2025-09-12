import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "framer-motion";
import { BarChart3, Smile, Meh, Frown } from "lucide-react";

// Stats shape
type Stats = {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
};

interface StatsCardProps {
  platform: string;
  username: string;
  stats: Stats;
}

export const StatsCard = ({ platform, username, stats }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <Card className="shadow-lg hover:shadow-xl transition rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="capitalize text-xl flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {platform} Stats for <span className="text-primary">{username}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 text-base">
          <div className="font-semibold text-muted-foreground">Total Solved</div>
          <motion.div
            key={stats.totalSolved}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="font-bold text-right"
          >
            {stats.totalSolved}
          </motion.div>

          <div className="flex items-center gap-2 text-green-500 font-semibold">
            <Smile className="w-4 h-4" /> Easy
          </div>
          <div className="text-green-500 font-bold text-right">{stats.easySolved}</div>

          <div className="flex items-center gap-2 text-yellow-500 font-semibold">
            <Meh className="w-4 h-4" /> Medium
          </div>
          <div className="text-yellow-500 font-bold text-right">{stats.mediumSolved}</div>

          <div className="flex items-center gap-2 text-red-500 font-semibold">
            <Frown className="w-4 h-4" /> Hard
          </div>
          <div className="text-red-500 font-bold text-right">{stats.hardSolved}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
