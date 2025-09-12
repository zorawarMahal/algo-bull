// src/pages/LandingPage.tsx
import { LoginButton } from "../components/LoginButton";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-400 h-6 w-6" />
          <h1 className="font-bold text-xl">AlgoBull</h1>
        </div>
        <LoginButton />
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 bg-clip-text text-transparent"
        >
          Welcome to AlgoBull
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl"
        >
          Your all-in-one dashboard to track your progress across{" "}
          <span className="text-purple-400">LeetCode</span>,{" "}
          <span className="text-pink-400">Codeforces</span>,{" "}
          <span className="text-red-400">HackerRank</span>, and more.  
          Log in to get started!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-10"
        >
          <LoginButton />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        Made by Zorawar Singh 🚀
      </footer>
    </div>
  );
};
