import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import {
  UserCircle,
  Award,
  Calendar,
  ArrowUpCircle,
  BookOpen,
  Shuffle,
} from "lucide-react";

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [scores, setScores] = useState([]);
  const [scoresMCQ, setScoresMCQ] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add this to your UserProfile component
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Add a useEffect to detect theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    // Watch for changes on the html element's class list
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (username) {
      const fetchScrambleScores = axios.get(
        `http://localhost:3000/score-history/WordScramble/${username}`
      );
      const fetchMCQScores = axios.get(
        `http://localhost:3000/score-history/MCQ/${username}`
      );

      Promise.all([fetchScrambleScores, fetchMCQScores])
        .then(([scrambleResponse, mcqResponse]) => {
          if (scrambleResponse.data.success) {
            setScores(scrambleResponse.data.scores);
          }
          if (mcqResponse.data.success) {
            setScoresMCQ(mcqResponse.data.scores);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching score history:", error);
          setLoading(false);
        });
    }
  }, [username]);

  // Calculate stats
  const totalActivities = scores.length + scoresMCQ.length;
  const latestScrambleScore =
    scores.length > 0 ? scores[scores.length - 1].score : 0;
  const latestMCQScore =
    scoresMCQ.length > 0 ? scoresMCQ[scoresMCQ.length - 1].score : 0;
  const averageScrambleScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((acc, score) => acc + score.score, 0) / scores.length
        )
      : 0;
  const averageMCQScore =
    scoresMCQ.length > 0
      ? Math.round(
          scoresMCQ.reduce((acc, score) => acc + score.score, 0) /
            scoresMCQ.length
        )
      : 0;

  // Last activity date
  const lastActivityDate = () => {
    const allDates = [
      ...scores.map((s) => new Date(s.createdAt)),
      ...scoresMCQ.map((s) => new Date(s.createdAt)),
    ];

    if (allDates.length === 0) return "No activities yet";

    const latestDate = new Date(Math.max(...allDates));
    return latestDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const chartData = {
    labels: scores.map((score) =>
      new Date(score.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Word Scramble",
        data: scores.map((score) => score.score),
        fill: false,
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const chartDataMCQ = {
    labels: scoresMCQ.map((score) =>
      new Date(score.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Reading Comprehension",
        data: scoresMCQ.map((score) => score.score),
        fill: false,
        borderColor: "rgb(52, 211, 153)",
        backgroundColor: "rgba(52, 211, 153, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          // Use white text in dark mode, dark text in light mode
          color: document.documentElement.classList.contains("dark")
            ? "white"
            : "black",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          // Use white text in dark mode, dark text in light mode
          color: document.documentElement.classList.contains("dark")
            ? "white"
            : "black",
        },
        grid: {
          color: document.documentElement.classList.contains("dark")
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        ticks: {
          // Use white text in dark mode, dark text in light mode
          color: document.documentElement.classList.contains("dark")
            ? "white"
            : "black",
        },
        grid: {
          color: document.documentElement.classList.contains("dark")
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center mb-8 bg-white rounded-xl p-6 shadow-lg dark:bg-gray-800">
          <div className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center text-4xl font-bold mb-4 md:mb-0 md:mr-6 text-white">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{username}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              Learning enthusiast
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-4">
              <div className="flex items-center">
                <Calendar
                  className="mr-2 text-gray-500 dark:text-gray-400"
                  size={20}
                />
                <span>Last active: {lastActivityDate()}</span>
              </div>
              <div className="flex items-center">
                <Award className="mr-2 text-yellow-500" size={20} />
                <span>Total activities: {totalActivities}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-gray-800 p-4 flex flex-col items-center text-center shadow">
            <ArrowUpCircle size={40} className="text-indigo-600 mb-2" />
            <h3 className="font-medium">Latest Scramble</h3>
            <p className="text-2xl font-bold">{latestScrambleScore}</p>
          </Card>
          <Card className="bg-white dark:bg-gray-800 p-4 flex flex-col items-center text-center shadow">
            <ArrowUpCircle size={40} className="text-green-500 mb-2" />
            <h3 className="font-medium">Latest MCQ</h3>
            <p className="text-2xl font-bold">{latestMCQScore}</p>
          </Card>
          <Card className="bg-white dark:bg-gray-800 p-4 flex flex-col items-center text-center shadow">
            <Shuffle size={40} className="text-indigo-600 mb-2" />
            <h3 className="font-medium">Avg Scramble</h3>
            <p className="text-2xl font-bold">{averageScrambleScore}</p>
          </Card>
          <Card className="bg-white dark:bg-gray-800 p-4 flex flex-col items-center text-center shadow">
            <BookOpen size={40} className="text-green-500 mb-2" />
            <h3 className="font-medium">Avg MCQ</h3>
            <p className="text-2xl font-bold">{averageMCQScore}</p>
          </Card>
        </div>

        {/* Performance Charts */}
        <h2 className="text-2xl font-bold mb-4">Learning Progress</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-lg dark:bg-gray-800">
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <BookOpen className="mr-2 text-green-500" size={20} />
              Reading Comprehension Progress
            </h3>
            {scoresMCQ.length > 0 ? (
              <Line data={chartDataMCQ} options={chartOptions} />
            ) : (
              <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                No MCQ data available yet
              </p>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg dark:bg-gray-800">
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <Shuffle className="mr-2 text-indigo-600" size={20} />
              Word Scramble Progress
            </h3>
            {scores.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                No Word Scramble data available yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-lg dark:bg-gray-800">
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <BookOpen className="mr-2 text-green-500" size={20} />
              Reading Comprehension Scores
            </h3>
            <div className="overflow-y-auto max-h-64">
              {scoresMCQ.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoresMCQ
                      .slice()
                      .reverse()
                      .map((score, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 dark:border-gray-700"
                        >
                          <td className="px-4 py-2 text-left">
                            {new Date(score.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 text-right font-medium">
                            {score.score}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No scores available yet
                </p>
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg dark:bg-gray-800">
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <Shuffle className="mr-2 text-indigo-600" size={20} />
              Word Scramble Scores
            </h3>
            <div className="overflow-y-auto max-h-64">
              {scores.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores
                      .slice()
                      .reverse()
                      .map((score, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 dark:border-gray-700"
                        >
                          <td className="px-4 py-2 text-left">
                            {new Date(score.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 text-right font-medium">
                            {score.score}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No scores available yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <h2 className="text-2xl font-bold mb-4">Start a New Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 p-6 rounded-lg shadow-lg transition-colors">
            <div className="flex items-center mb-4">
              <BookOpen className="text-green-500 mr-3" size={30} />
              <h3 className="text-xl font-bold">AI-Powered MCQs</h3>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Test your comprehension with AI-generated multiple-choice
              questions. Generate questions from any paragraph using Gemini AI.
            </p>
            <Button className="w-full text-md py-6" asChild>
              <Link to="/quiz">Start Quiz</Link>
            </Button>
          </Card>

          <Card className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 p-6 rounded-lg shadow-lg transition-colors">
            <div className="flex items-center mb-4">
              <Shuffle className="text-indigo-600 mr-3" size={30} />
              <h3 className="text-xl font-bold">Word Scramble Game</h3>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Improve your vocabulary and have fun solving word scrambles.
              Challenge yourself and see if you can beat your previous scores.
            </p>
            <Button className="w-full text-md py-6" asChild>
              <Link to="/game">Play Game</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
