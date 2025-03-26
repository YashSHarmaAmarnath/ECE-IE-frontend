import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Book, Shuffle, User, Calendar, Award, AlertCircle } from "lucide-react";

const Leaderboard = () => {
  const [mcqScores, setMcqScores] = useState([]);
  const [wordScrambleScores, setWordScrambleScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("mcq");

  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);
      try {
        const [mcqResponse, wordScrambleResponse] = await Promise.all([
          axios.get("http://localhost:3000/leaderboard/MCQ"),
          axios.get("http://localhost:3000/leaderboard/Word Scramble")
        ]);

        if (mcqResponse.data.success) {
          setMcqScores(mcqResponse.data.topScores);
        }

        if (wordScrambleResponse.data.success) {
          setWordScrambleScores(wordScrambleResponse.data.topScores);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching leaderboards:", err);
        setError("Failed to load leaderboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboards();
  }, []);

  // Get unique users with their best scores
  const getUniqueTopScores = (scores) => {
    const userBestScores = {};
    scores.forEach(score => {
      if (!userBestScores[score.username] || userBestScores[score.username].score < score.score) {
        userBestScores[score.username] = score;
      }
    });
    return Object.values(userBestScores).sort((a, b) => b.score - a.score);
  };

  const uniqueMcqScores = getUniqueTopScores(mcqScores);
  const uniqueWordScrambleScores = getUniqueTopScores(wordScrambleScores);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMedalColor = (index) => {
    switch (index) {
      case 0: return "text-yellow-400"; // Gold
      case 1: return "text-gray-400 dark:text-gray-300";   // Silver
      case 2: return "text-amber-600";  // Bronze
      default: return "text-gray-500 dark:text-gray-400";  // Others
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl">Loading leaderboards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white flex items-center justify-center">
        <Card className="p-6 bg-blue-50 dark:bg-gray-800 max-w-lg shadow-lg">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Leaderboards</h2>
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800  dark:text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold flex items-center justify-center">
            <Trophy className="text-yellow-400 mr-4" size={48} />
            Leaderboards
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">See who's leading the way in our learning games</p>
        </div>

        {/* Tabs for different leaderboards */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-2 mb-8 bg-inherit">
            <TabsTrigger value="mcq" className="flex items-center justify-center gap-2 py-3">
              <Book size={20} />
              <span>Reading Comprehension</span>
            </TabsTrigger>
            <TabsTrigger value="wordscramble" className="flex items-center justify-center gap-2 py-3">
              <Shuffle size={20} />
              <span>Word Scramble</span>
            </TabsTrigger>
          </TabsList>

          {/* MCQ Leaderboard */}
          <TabsContent value="mcq">
            <Card className="bg-blue-50 dark:bg-gray-800 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold flex items-center">
                  <Book className="text-green-500 mr-3" size={24} />
                  Reading Comprehension Leaderboard
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Top performers in our multiple-choice reading comprehension challenge
                </p>
              </div>

              {uniqueMcqScores.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {uniqueMcqScores.map((score, index) => (
                    <div key={score._id} 
                      className={`p-4 flex items-center dark:text-white dark:bg-gray-800`}>
                      <div className="text-center w-16">
                        {index < 3 ? (
                          <Medal size={28} className={getMedalColor(index)} />
                        ) : (
                          <div className={`w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto ${getMedalColor(index)}`}>
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold mr-3 text-white">
                            {score.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{score.username}</h3>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Calendar size={14} className="mr-1" />
                              <span>{formatDate(score.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{score.score}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  <Award size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-xl">No scores available yet.</p>
                  <p className="mt-2">Be the first to take the challenge!</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Word Scramble Leaderboard */}
          <TabsContent value="wordscramble">
            <Card className="bg-blue-50 dark:bg-gray-800 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold flex items-center">
                  <Shuffle className="text-indigo-600 mr-3" size={24} />
                  Word Scramble Leaderboard
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Top performers in our word unscrambling vocabulary challenge
                </p>
              </div>

              {uniqueWordScrambleScores.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {uniqueWordScrambleScores.map((score, index) => (
                    <div key={score._id} 
                      className={`p-4 flex items-center dark:text-white dark:bg-gray-800'`}>
                      <div className="text-center w-16">
                        {index < 3 ? (
                          <Medal size={28} className={getMedalColor(index)} />
                        ) : (
                          <div className={`w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto ${getMedalColor(index)}`}>
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 ml-4 ">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold mr-3 dark:text-white text-white">
                            {score.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{score.username}</h3>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Calendar size={14} className="mr-1" />
                              <span>{formatDate(score.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{score.score}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  <Award size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-xl">No scores available yet.</p>
                  <p className="mt-2">Be the first to take the challenge!</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <Card className="bg-blue-50 dark:bg-gray-800 p-6 text-center shadow">
            <Trophy className="text-yellow-400 mx-auto mb-3" size={32} />
            <h3 className="text-xl font-bold mb-1">Top Score</h3>
            <p className="text-3xl font-bold">
              {uniqueMcqScores.length > 0 ? uniqueMcqScores[0].score : 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Reading Comprehension</p>
          </Card>
          
          <Card className="bg-blue-50 dark:bg-gray-800 p-6 text-center shadow">
            <Trophy className="text-yellow-400 mx-auto mb-3" size={32} />
            <h3 className="text-xl font-bold mb-1">Top Score</h3>
            <p className="text-3xl font-bold">
              {uniqueWordScrambleScores.length > 0 ? uniqueWordScrambleScores[0].score : 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Word Scramble</p>
          </Card>
          
          <Card className="bg-blue-50 dark:bg-gray-800 p-6 text-center shadow">
            <User className="text-blue-400 mx-auto mb-3" size={32} />
            <h3 className="text-xl font-bold mb-1">Total Players</h3>
            <p className="text-3xl font-bold">
              {new Set([
                ...mcqScores.map(s => s.username),
                ...wordScrambleScores.map(s => s.username)
              ]).size}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Across all games</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;