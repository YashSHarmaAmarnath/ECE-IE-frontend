import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Leaderboard from "./Leaderboard";
import { Link } from "react-router-dom";

const Game = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const [words, setWords] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchWords = async () => {
    

    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/scramble");
      console.log("Fetched words:", res.data.words); 
      setWords(res.data.words);
      setGuesses(Array(res.data.words.length).fill(""));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching words", err);
      setLoading(false);
    }
  };

  const handleInputChange = (index, value) => {
    const updatedGuesses = [...guesses];
    updatedGuesses[index] = value;
    setGuesses(updatedGuesses);
  };

  const submitAnswers = async () => {
    let totalScore = 0;
    for (let i = 0; i < words.length; i++) {
      try {
        const res = await axios.post("http://localhost:3000/check", {
          word: words[i].original,
          guess: guesses[i],
        });
        if (res.data.correct) {
          totalScore += 20;
        }
      } catch (err) {
        console.error("Error checking", err);
      }
    }
    setScore(totalScore);
    setShowResult(true);
    console.log("Total Score:", totalScore);
    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      
      if (token && username) {
        await axios.post(
          "http://localhost:3000/submit-score",
          { username, score: totalScore ,category:"Word Scramble"},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Error submitting score", err);
    }
    
  };

  const startGame = () => {
    setGameStarted(true);
    setShowResult(false);
    setScore(0);
    fetchWords();
  };

  const restartGame = () => {
    setGuesses([]);
    setWords([]);
    setGameStarted(false);
    setShowResult(false);
    setScore(0);
  };

  return (
    <>
    <br />
 <Button style={{marginLeft:'3vh', marginBottom:'-50vh'}}  variant="outline" className="px-4 py-4 text-md border-blue-600 text-blue-600 hover:bg-blue-100 dark:text-white dark:hover:bg-gray-800" asChild>
              <Link to="/dash">← Go Back</Link>
      </Button>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-1000 text-white p-4">
      <h1 className="text-3xl mb-10">Word Scramble Game</h1>

      {!gameStarted ? (
        <button
          onClick={startGame}
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700"
        >
          Start Game
        </button>
      ) : (
        <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {words.map((word, index) => (
                <div key={index} className="mb-5">
                  <h2 className="text-xl mb-1">Scrambled: {word.scrambled}</h2>
                  <input
                    type="text"
                    value={guesses[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="Your guess"
                    disabled={showResult}
                    className="w-full p-2 rounded text-white"
                  />
                  <p className="text-sm mt-1 text-gray-400">
                    Meaning: {word.meaning}
                  </p>
                </div>
              ))}

              {!showResult ? (
                <button
                  onClick={submitAnswers}
                  className="w-full bg-green-500 py-2 rounded hover:bg-green-700"
                >
                  Submit Answers
                </button>
              ) : (
                <div className="text-center mt-4">
                  <h2 className="text-2xl mb-2">Your Score: {score} / 100</h2>
                  <h3 className="mb-4">Correct Words:</h3>
                  <ul>
                    {words.map((word, index) => (
                      <li key={index}>
                        <strong>{word.original}</strong> — Your Guess:{" "}
                        {guesses[index]}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setShowLeaderboard(true)}
                    className="mt-4 bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-700"
                  >
                    View Score History
                  </button>
                  <button
                    onClick={restartGame}
                    className="mt-4 w-full bg-blue-500 py-2 rounded hover:bg-blue-700"
                  >
                    Restart Game
                  </button>
                </div>
              )}             
            </>
          )}
          {showLeaderboard && <Leaderboard />}
        </div>
        
      
      )}
    </div>
    </>
  );
};

export default Game;
