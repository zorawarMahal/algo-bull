// src/pages/LandingPage.tsx
import { LoginButton } from '../components/LoginButton';

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to AlgoBull</h1>
      <p className="text-muted-foreground mb-8 max-w-lg">
        Your all-in-one dashboard to track your progress across LeetCode, Codeforces, HackerRank, and more. Log in to get started!
      </p>
      <LoginButton />
    </div>
  );
};