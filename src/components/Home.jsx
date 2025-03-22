import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-10  text-gray-900 dark:text-white">
      {/* Top Navigation Bar */}
      <div className="absolute top-4 right-6 flex space-x-4">
        <Button variant="outline" className="px-6 py-2 text-md border-blue-600 text-blue-600 hover:bg-blue-100 dark:text-white dark:hover:bg-gray-800" asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button className="px-6 py-2 text-md " asChild>
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
      
      <h1 className="text-6xl font-extrabold">Welcome to Gamelit</h1>
      <p className="mt-6 text-xl text-center max-w-3xl text-gray-700 dark:text-gray-300">
        Generate MCQs from paragraphs using AI and enjoy a scramble word game! Built with cutting-edge technology.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full max-w-7xl">
        <Card className="shadow-xl rounded-3xl p-8 transform transition duration-300 hover:scale-105 text-gray-900 bg-blue-100 dark:bg-gray-800 dark:text-white">
          <h2 className="text-2xl font-bold">AI-Powered MCQs</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Generate multiple-choice questions from any paragraph using Gemini AI.</p>
        </Card>

        <Card className="shadow-xl rounded-3xl p-8 transform transition duration-300 hover:scale-105 bg-blue-100 text-gray-900 dark:bg-gray-800 dark:text-white">
          <h2 className="text-2xl font-bold">Scramble Word Game</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Improve vocabulary and have fun solving word scrambles.</p>
        </Card>

        <Card className="shadow-xl rounded-3xl p-8 transform transition duration-300 hover:scale-105 bg-blue-100 text-gray-900 dark:bg-gray-800 dark:text-white">
          <h2 className="text-2xl font-bold">Data & Insights</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Track your progress with detailed analytics using Chart.js.</p>
        </Card>
      </div>
    </div>
  );
}

export default Home;