import React, { useState } from "react";
import axios from "axios";
import QuizAnswers from '@/components/QuizAnswers';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import Loader from "./Loader";
import { Link } from "react-router-dom";

Chart.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const QuizApp = () => {
  const [paragraph, setParagraph] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showAns, setShowAns] = useState(false)
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
    if (!paragraph.trim()) {
      alert("Please enter a paragraph.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:3000/make-question", {
        paragraph,
      });
      if (response.data.success) {
        setQuizData(response.data.questions);
        setUserAnswers({});
        setScore(null);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      alert("Failed to generate quiz. Try again.");
    }
    setLoading(false);
    setShowAns(false);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: answer });
  };

  const calculateScore = () => {
    let newScore = 0;
    quizData.questions.forEach((question, index) => {
      const correctAnswer = question.correctAnswer
        .toString()
        .trim()
        .toLowerCase();
      const userAnswer = (userAnswers[index] || "")
        .toString()
        .trim()
        .toLowerCase();
      if (userAnswer === correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setShowAns(true);
  };

  const chartData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        label: "Quiz Score",
        data: [
          score || 0,
          quizData ? quizData.questions.length - (score || 0) : 0,
        ],
        backgroundColor: ["#4a4f49", "#ffffff"],
      },
    ],
  };

  return (
    <>
    <br />
    <Button style={{marginLeft:'3vh'}}  variant="outline" className="px-4 py-4 text-md border-blue-600 text-blue-600 hover:bg-blue-100 dark:text-white dark:hover:bg-gray-800" asChild>
              <Link to="/dash">← Go Back</Link>
      </Button>
    <div className="text-center p-5">
      
      <h1 className="text-2xl font-bold mb-4">Reading Comprehension Quiz</h1>
      <Textarea
        rows="3"
        placeholder="Enter a paragraph..."
        value={paragraph}
        onChange={(e) => setParagraph(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded dark:border-gray-700"
      />
      <Button
        onClick={generateQuiz}
        disabled={loading}
        className="p-2 mb-4 bg-blue-500 text-white dark:bg-blue-700"
      >
        {loading ? "Loading..." : "Generate Quiz"}
      </Button>
      <div className="text-left border border-gray-300 p-2 rounded mt-4 dark:border-gray-700">
        {paragraph}
      </div>
      {loading && (
        <div className="flex justify-center items-center mt-5">
        <Loader />
        </div>
        )}
      {quizData && (
        <Card className="shadow-lg p-4 mt-5 dark:bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-bold mb-3">{quizData.title}</h2>
            {quizData.questions.map((question, index) => (
              <div key={index} className="mb-4 text-left">
                <p className="font-medium">
                  Q{index + 1}: {question.question}
                </p>
                <div className="ml-10">
                  {question.type === "true/false" ? (
                    <>
                      {["true", "false"].map((option) => (
                        <>
                          <Label
                            key={option}
                            className={`inline-flex items-center gap-2 cursor-pointer p-2 border rounded transition-colors ${
                              userAnswers[index] === option
                                ? "bg-blue-500 text-white dark:bg-blue-700"
                                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            } m-2`}
                          >
                            <input
                              type="radio"
                              value={option}
                              checked={userAnswers[index] === option}
                              onChange={() => handleAnswerChange(index, option)}
                              className="hidden"
                            />
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Label>
                          <br />
                        </>
                      ))}
                    </>
                  ) : (
                    Object.entries(question.options).map(([key, value]) => (
                      <>
                        <Label
                          key={key}
                          className={`inline-flex items-center gap-2 cursor-pointer p-2 border rounded transition-colors ${
                            userAnswers[index] === key
                              ? "bg-blue-500 text-white dark:bg-blue-700"
                              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          } m-2`}
                        >
                          <input
                            type="radio"
                            value={key}
                            checked={userAnswers[index] === key}
                            onChange={() => handleAnswerChange(index, key)}
                            className="hidden"
                          />
                          {key}) {value}
                        </Label>
                        <br />
                      </>
                    ))
                  )}
                </div>
              </div>
            ))}
            <Button
              onClick={calculateScore}
              className="w-full p-2 bg-blue-500 text-white rounded mt-2 dark:bg-blue-700"
            >
              Submit Quiz
            </Button>
          </CardContent>
          {score !== null && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">
                Your score: {score}/{quizData.questions.length} (
                {((score / quizData.questions.length) * 100).toFixed(1)}%)
              </h3>
              <div className="mt-4 w-1/2 mx-auto">
                <Bar data={chartData} />
              </div>
            </div>
          )}
        </Card>
      )}
      {showAns && <QuizAnswers quizData={quizData} />}
    </div>
    </>
  );
};

export default QuizApp;
