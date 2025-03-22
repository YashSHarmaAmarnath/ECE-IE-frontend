import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import "./Dash.css";

const Dash = () => {
        const [username, setUsername] = useState("");
      
        useEffect(() => {
          const storedUsername = localStorage.getItem("username");
          if (storedUsername) {
            setUsername(storedUsername);
          }
        }, []);
  return (
    <>
      <div className="program">
        <h1 className="text-6xl font-extrabold">👋🏻 Hello {username} !{/*here the usrname should be there*/} </h1><br />
        <p className="mt-6 text-xl text-center max-w-3xl text-gray-700 dark:text-gray-300">
        Which one you wanna go for? 
      </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-12 w-full max-w-7xl">
          <Card
            id="quiz1"
            className="shadow-xl rounded-3xl p-8 transform transition duration-300 hover:scale-105 text-gray-900 bg-blue-100 dark:bg-gray-800 dark:text-white"
          >
            <h2 className="text-2xl font-bold text-center">AI-Powered MCQs</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-center">
              Generate multiple-choice questions from any paragraph using Gemini
              AI 🤖  <br /><br />
            <Button className="px-6 py-2 text-md object-center" asChild>
              <Link to="/quiz">Let's Go</Link>
            </Button>
            </p>
            
          </Card>

          <Card
            id="quiz1"
            className="shadow-xl rounded-3xl p-8 transform transition duration-300 hover:scale-105 bg-blue-100 text-gray-900 dark:bg-gray-800 dark:text-white"
          >
            <h2 className="text-2xl font-bold text-center">
              Scramble Word Game
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-center">
              Improve vocabulary and have fun solving word scrambles. Try to solve and compete 💪<br /><br />
              <Button className="px-6 py-2 text-md object-center" asChild>
              <Link to="/game">Let's Go</Link>
            </Button>
            </p>
            
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dash;
