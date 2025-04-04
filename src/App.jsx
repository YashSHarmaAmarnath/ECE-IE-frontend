import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./page/Home";
import './App.css';
import QuizApp from './components/QuizApp';
import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/Navbar';
import FeaturesPage from "./page/Features";
import About from "./page/About";
import Game from "./components/Game";
import Dash from "./page/Dash";
import Leaderboard from "./components/Leaderboard";
import Feedback from "./components/Feedback.jsx";

function App() {
  return ( 
    
       <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feat" element={<FeaturesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/quiz" element={<QuizApp />} />
        <Route path="/dash" element={<Dash />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
      </ThemeProvider>
    
  );
}

export default App;
