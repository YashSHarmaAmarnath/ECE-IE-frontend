import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function FeaturesPage() {
  return (
    <div className="min-h-screen p-10  text-gray-900  dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-extrabold">Gamelit Features</h1>
      </div>
      
      {/* Features List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="shadow-xl rounded-3xl p-8 bg-blue-100 text-gray-900 dark:bg-gray-800 dark:text-white transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold">AI-Powered MCQ Generation</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Generate multiple-choice questions from any paragraph using cutting-edge AI from Gemini.</p>
        </Card>
        
        <Card className="shadow-xl rounded-3xl p-8 bg-blue-100 text-gray-900 dark:bg-gray-800 dark:text-white transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold">Scramble Word Game</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Improve vocabulary while playing a fun and engaging word scramble game.</p>
        </Card>

        <Card className="shadow-xl rounded-3xl p-8 bg-blue-100 text-gray-900 dark:bg-gray-800 dark:text-white transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold">Interactive UI</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Built with React and ShadCN, ensuring a seamless and modern user experience.</p>
        </Card>

        <Card className="shadow-xl rounded-3xl p-8 bg-blue-100 text-gray-900 dark:bg-gray-800 dark:text-white transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold">Powerful Backend</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Optimized backend using Express.js and MongoDB for efficient data handling.</p>
        </Card>

        <Card className="shadow-xl rounded-3xl p-8 bg-blue-100 text-gray-900 dark:bg-gray-800 dark:text-white transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold">Data Visualization</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Track your progress with interactive charts powered by Chart.js.</p>
        </Card>
      </div>
    </div>
  );
}

export default FeaturesPage;