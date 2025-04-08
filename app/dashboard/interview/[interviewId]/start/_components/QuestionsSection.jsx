"use client";
import { Lightbulb, Volume2 } from "lucide-react";
import React, { useState } from "react";
import InterviewerVideo from "./InterviewerVideo";

const QuestionsSection = ({ mockInterviewQuestion, activeQuestionIndex, onQuestionChange }) => {
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US"; // Set language for better consistency
      speech.rate = 1; // Normal speed
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text-to-speech.");
    }
  };

  if (!mockInterviewQuestion) return null;

  return (
    <div className="space-y-6">
      {/* Question Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {mockInterviewQuestion.map((_, index) => (
          <button
            key={index}
            className={`py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
              activeQuestionIndex === index
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => onQuestionChange && onQuestionChange(index)}
          >
            Question #{index + 1}
          </button>
        ))}
      </div>

      {/* Current Question */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() =>
              textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)
            }
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <Volume2 className="h-5 w-5" />
            <span className="text-sm font-medium">Listen to Question</span>
          </button>
          
          <button
            onClick={() => setIsGeneratingVideo(true)}
            className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200"
          >
            <span className="text-sm font-medium">Generate Video</span>
          </button>
        </div>
        
        {isGeneratingVideo && (
          <InterviewerVideo questionText={mockInterviewQuestion[activeQuestionIndex]?.question} />
        )}
      </div>

      {/* Info Note */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-800">Quick Tip</h3>
        </div>
        <p className="text-sm text-blue-700 leading-relaxed">
          Enable your webcam and microphone to begin your AI-powered mock interview. 
          You'll answer 5 questions and receive a detailed report based on your responses. 
          <span className="font-medium">Note:</span> We never record your video, and you can disable webcam access anytime.
        </p>
      </div>
    </div>
  );
};

export default QuestionsSection;