import React, { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/leaderboard");

        setLeaderboard(res.data);
      } catch (err) {
        console.error("Error fetching leaderboard", err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white p-6">
      <h2 className="text-2xl mb-4">Leaderboard</h2>
      <table className="w-full max-w-md border border-gray-600">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2 border border-gray-600">Rank</th>
            <th className="p-2 border border-gray-600">Username</th>
            <th className="p-2 border border-gray-600">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index} className="text-center">
              <td className="p-2 border border-gray-600">{index + 1}</td>
              <td className="p-2 border border-gray-600">{entry.username}</td>
              <td className="p-2 border border-gray-600">{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
