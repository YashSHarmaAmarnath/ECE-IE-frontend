import React from "react";
import { Card } from "@/components/ui/card";

function About() {
    return (
      <div className="min-h-screen p-10 text-gray-900 dark:text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-extrabold">About Gamelit</h1>
        </div>
        
        {/* About Section */}
        <Card className="shadow-xl rounded-3xl p-8 bg-blue-100 text-gray-900 dark:bg-gray-800 dark:text-white transform transition duration-300 hover:scale-105">
          {/* <h2 className="text-2xl font-bold"></h2> */}
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Gamelit is developed for ECE IE project By Group 1 <br />
            member's list:
            <ul>
              <li>  1) Ashraf Shaikh</li>
              <li>  2) Karan Sharma</li>
              <li>  3) Pratyakash Sharma</li>
              <li>  4) Rheetik Sharma</li>
              <li>  5) Yash Sharma</li>
              <li>  7) Atharva Shinde</li>
              <li>  8) Harsh Shrivastav</li>
              <li>  9) Arvind Shukala</li>
            </ul>
          </p>
        </Card>
      </div>
    );
}
  
export default About;
