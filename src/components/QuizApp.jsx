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
import { BookOpen, ArrowLeft, Check, X } from "lucide-react";

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

  const calculateScore = async () => {
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

    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      
      if (token && username) {
        await axios.post(
          "http://localhost:3000/submit-score",
          { username, score: newScore, category:"MCQ"},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Error submitting score", err);
    }
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
        backgroundColor: ["#10B981", "#EF4444"],
      },
    ],
  };

  // Check if all questions are answered
  const allQuestionsAnswered = quizData 
    ? quizData.questions.length === Object.keys(userAnswers).length 
    : false;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          className="mr-4 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800" 
          asChild
        >
          <Link to="/dash">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
          Reading Comprehension Quiz
        </h1>
      </div>

      <Card className="shadow-lg dark:bg-gray-900 bg-white">
        <CardContent className="p-6">
          <div className="mb-6">
            <Textarea
              rows="4"
              placeholder="Enter a paragraph to generate a quiz..."
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 transition-all duration-300"
            />
            <Button
              onClick={generateQuiz}
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 dark:bg-blue-800"
            >
              {loading ? "Generating Quiz..." : "Generate Quiz"}
            </Button>
          </div>

          {paragraph && !loading && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Paragraph Preview:
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{paragraph}</p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-10">
              <Loader />
            </div>
          )}

          {quizData && !loading && (
            <>
              <div className="space-y-6">
                {quizData.questions.map((question, index) => (
                  <div 
                    key={index} 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
                  >
                    <p className="font-semibold text-gray-800 dark:text-white mb-3">
                      Q{index + 1}: {question.question}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {question.type === "true/false" ? (
                        ["true", "false"].map((option) => (
                          <Label
                            key={option}
                            className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                              userAnswers[index] === option
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            }`}
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
                        ))
                      ) : (
                        Object.entries(question.options).map(([key, value]) => (
                          <Label
                            key={key}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                              userAnswers[index] === key
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            }`}
                          >
                            <input
                              type="radio"
                              value={key}
                              checked={userAnswers[index] === key}
                              onChange={() => handleAnswerChange(index, key)}
                              className="hidden"
                            />
                            <span className="font-semibold mr-2">{key})</span> {value}
                          </Label>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={calculateScore}
                disabled={!allQuestionsAnswered}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Submit Quiz
              </Button>
            </>
          )}

          {score !== null && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                  {score / quizData.questions.length > 0.7 ? (
                    <Check className="w-6 h-6 mr-2 text-green-600" />
                  ) : (
                    <X className="w-6 h-6 mr-2 text-red-600" />
                  )}
                  Quiz Results
                </h3>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {score}/{quizData.questions.length} (
                  {((score / quizData.questions.length) * 100).toFixed(1)}%)
                </p>
              </div>
              <div className="w-full md:w-1/2 mx-auto">
                <Bar data={chartData} />
              </div>
            </div>
          )}

          {showAns && <QuizAnswers quizData={quizData} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizApp;