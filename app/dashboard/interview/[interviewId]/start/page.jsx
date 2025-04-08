"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic, StopCircle, Loader2, Camera, CameraOff,
  Volume2, Lightbulb, ChevronLeft, ChevronRight,
  CheckCircle, Clock, MessageSquare, Award, Save
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Webcam from "react-webcam";
import InterviewerVideo from "./_components/InterviewerVideo";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { motion } from "framer-motion";
import { chatSession } from "@/utils/GeminiAIModal";

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [user] = useState({ primaryEmailAddress: { emailAddress: "user@example.com" } });

  const recognitionRef = useRef(null);
  const webcamRef = useRef(null);
  const generateVideoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Speech recognition setup
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript.trim()) {
          setUserAnswer((prev) => (prev + " " + finalTranscript).trim());
        }
      };

      recognition.onerror = (event) => {
        toast.error(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const StartStopRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech-to-text not supported in your browser");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      toast.info("Recording stopped");
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      toast.success("Recording started");
    }
  };

  const fetchInterviewDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (result.length > 0) {
        const parsedQuestions = JSON.parse(result[0].jsonMockResp) || [];
        if (!Array.isArray(parsedQuestions)) throw new Error("Invalid questions format");

        setMockInterviewQuestion(parsedQuestions);
        setInterviewData(result[0]);

        if (parsedQuestions.length > 0) {
          const answeredResults = await db
            .select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.interviewId));

          const answered = answeredResults
            .map(answer => ({
              ...answer,
              questionIndex: parsedQuestions.findIndex(q => q.question === answer.question)
            }))
            .filter(answer => answer.questionIndex !== -1);

          setAnsweredQuestions(answered);
        }
      } else {
        toast.error("Interview not found");
      }
    } catch (error) {
      console.error("Failed to fetch interview details:", error);
      toast.error("Failed to load interview details");
    } finally {
      setIsLoading(false);
    }
  }, [params.interviewId]);

  useEffect(() => {
    fetchInterviewDetails();
  }, [fetchInterviewDetails]);

  useEffect(() => {
    if (timerActive && remainingTime > 0) {
      timerRef.current = setTimeout(() => setRemainingTime(prev => prev - 1), 1000);
    } else if (timerActive && remainingTime === 0) {
      stopRecording();
      toast.info("Time's up! Your answer has been recorded.");
    }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, remainingTime]);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript + " ";
        }
        setUserAnswer(prev => (prev + " " + finalTranscript).trim());
      };

      recognition.onerror = (event) => {
        toast.error(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
        setTimerActive(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setTimerActive(false);
      };
    }
    return () => recognitionRef.current?.stop();
  }, []);

  const handleWebcamToggle = async () => {
    try {
      if (!webcamEnabled) {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setWebcamEnabled(true);
        toast.success("Webcam enabled");
      } else {
        setWebcamEnabled(false);
        toast.info("Webcam disabled");
      }
    } catch (error) {
      toast.error("Failed to enable webcam", { description: "Check permissions" });
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech-to-text not supported in your browser");
      return;
    }
    recognitionRef.current.start();
    setIsRecording(true);
    setTimerActive(true);
    setRemainingTime(120);
    toast.success("Recording started - 2 minutes");
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    setTimerActive(false);
    toast.info("Recording stopped");
  };

  const handleGenerateVideoClick = () => {
    setIsVideoVisible(true);
    // Trigger video generation immediately when visibility is toggled
    setTimeout(() => generateVideoRef.current?.(), 0); // Ensure it runs after render
  };

  const saveAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer");
      return;
    }

    setIsProcessing(true);
    try {
      const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Provide a rating out of 10 and feedback in JSON format: { "rating": <number>, "feedback": <text> }`;
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = result.response.text().replace(/```json|```/g, "").trim();
      const JsonfeedbackResp = JSON.parse(mockJsonResp);

      const answerRecord = {
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question || "",
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer || "",
        userAns: userAnswer,
        feedback: JsonfeedbackResp?.feedback,
        rating: JsonfeedbackResp?.rating.toString(),
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
      };

      await db.insert(UserAnswer).values(answerRecord);

      setAnsweredQuestions(prev => [
        ...prev.filter(a => a.questionIndex !== activeQuestionIndex),
        { ...answerRecord, questionIndex: activeQuestionIndex }
      ]);

      toast.success("Answer saved successfully");

      if (activeQuestionIndex < mockInterviewQuestion.length - 1) {
        setTimeout(moveToNextQuestion, 1000);
      }
    } catch (error) {
      toast.error("Failed to save answer", { description: error.message });
      console.error("Answer save error:", error);
    } finally {
      setIsProcessing(false);
      setUserAnswer("");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US";
      speech.rate = 0.9;
      window.speechSynthesis.speak(speech);
    } else {
      toast.error("Text-to-speech not supported");
    }
  };

  const moveToNextQuestion = () => {
    if (activeQuestionIndex < mockInterviewQuestion.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
      setIsVideoVisible(false);
      setUserAnswer("");
    }
  };

  const moveToPreviousQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(prev => prev - 1);
      setIsVideoVisible(false);
      setUserAnswer("");
    }
  };

  const isQuestionAnswered = (index) => answeredQuestions.some(a => a.questionIndex === index);

  if (!isLoading && (!mockInterviewQuestion || mockInterviewQuestion.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl border border-red-100 p-8 max-w-md w-full"
        >
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl text-red-600">!</span>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900">No Questions Found</h3>
            <p className="mt-3 text-gray-600 text-base">
              It seems there was an issue loading your interview questions.
            </p>
            <Link href="/dashboard">
              <Button className="mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-full px-8 py-3">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <div className="relative w-20 h-20 mx-auto">
            <Loader2 className="absolute inset-0 h-20 w-20 animate-spin text-indigo-600" />
            <motion.div
              className="absolute inset-0 h-20 w-20 rounded-full border-4 border-indigo-200"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="text-gray-800 text-xl font-semibold">Initializing Interview</p>
          <p className="text-gray-600">Preparing your AI-driven session...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl py-2 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 tracking-tight">
                {interviewData?.jobPosition || "Mock Interview"}
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Question {activeQuestionIndex + 1} of {mockInterviewQuestion.length}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Progress:</span>
              <div className="w-64 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                <motion.div
                  className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${((activeQuestionIndex + 1) / mockInterviewQuestion.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <span className="text-sm font-semibold text-indigo-700">
                {Math.round(((activeQuestionIndex + 1) / mockInterviewQuestion.length) * 100)}%
              </span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 flex flex-wrap gap-3"
          >
            {[
              { icon: MessageSquare, text: "Technical", color: "blue" },
              { icon: Award, text: interviewData?.jobPosition, color: "indigo" },
              { icon: Clock, text: "30 Minutes", color: "purple" }
            ].map((tag, index) => (
              <span key={index} className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-${tag.color}-100 text-${tag.color}-800 shadow-sm`}>
                <tag.icon className="mr-2 h-4 w-4" /> {tag.text}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
          {/* Questions Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="xl:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 border-b border-gray-100 pb-4 mb-8">
              Interview Questions
            </h2>
            <div className="grid grid-cols-5 gap-3 mb-8">
              {mockInterviewQuestion.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeQuestionIndex === index
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                      : isQuestionAnswered(index)
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  onClick={() => {
                    setActiveQuestionIndex(index);
                    setIsVideoVisible(false);
                    setUserAnswer("");
                  }}
                >
                  {index + 1}
                  {isQuestionAnswered(index) && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </motion.button>
              ))}
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 shadow-md mb-8">
              <div className="mb-4">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full mb-3 shadow-sm">
                  Question {activeQuestionIndex + 1}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
                  {mockInterviewQuestion[activeQuestionIndex]?.question}
                </h3>
              </div>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
                  className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 transition-colors duration-200 bg-indigo-50 px-4 py-2 rounded-full shadow-sm"
                >
                  <Volume2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Listen</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerateVideoClick}
                  disabled={isVideoVisible}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${isVideoVisible
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`}
                >
                  <Camera className="h-5 w-5" />
                  <span>Show Interviewer</span>
                </motion.button>
              </div>
            </div>
            {isVideoVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-6 rounded-2xl overflow-hidden bg-black aspect-video shadow-lg"
              >
                <InterviewerVideo
                  key={`video-${activeQuestionIndex}`}
                  questionText={mockInterviewQuestion[activeQuestionIndex]?.question}
                  onGenerate={(generateFn) => (generateVideoRef.current = generateFn)}
                />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-2xl border border-yellow-100 shadow-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-full shadow-sm">
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-yellow-900">Pro Tips</h3>
              </div>
              <ul className="space-y-3 text-yellow-800 text-base">
                {[
                  "Use the STAR method: Situation, Task, Action, Result.",
                  "Speak clearly and concisely for maximum impact.",
                  "Fully address each part of the question."
                ].map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Response Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="xl:col-span-3 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 border-b border-gray-100 pb-4 mb-8">
              Your Response
            </h2>
            <div className="flex flex-wrap items-center justify-between mb-8">
              <div className="flex items-center gap-4 flex-wrap">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm ${isRecording ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-700"
                  }`}>
                  {isRecording ? (
                    <><StopCircle className="h-4 w-4 animate-pulse" /> Recording</>
                  ) : (
                    <><Mic className="h-4 w-4" /> Ready</>
                  )}
                </span>
                {webcamEnabled && (
                  <span className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm">
                    <Camera className="h-4 w-4" /> Camera On
                  </span>
                )}
                {isQuestionAnswered(activeQuestionIndex) && (
                  <span className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm">
                    <CheckCircle className="h-4 w-4" /> Answered
                  </span>
                )}
              </div>
              <motion.div
                animate={{ scale: timerActive ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.5, repeat: timerActive ? Infinity : 0 }}
                className={`flex items-center gap-2 font-mono text-lg font-semibold ${timerActive && remainingTime < 30 ? "text-red-600" : "text-gray-800"
                  }`}
              >
                <Clock className="h-5 w-5" />
                {formatTime(remainingTime)}
              </motion.div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-8 mb-8">
              <div className="md:col-span-3 space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-lg relative flex items-center justify-center"
                >
                  {webcamEnabled ? (
                    <Webcam
                      ref={webcamRef}
                      mirrored={true}
                      className="w-full h-full object-cover"
                      onUserMedia={() => setWebcamEnabled(true)}
                      onUserMediaError={() => {
                        toast.error("Webcam access error");
                        setWebcamEnabled(false);
                      }}
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <CameraOff className="h-16 w-16 mx-auto mb-3 opacity-50" />
                      <p className="text-base">Camera Off</p>
                    </div>
                  )}
                  {webcamEnabled && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <motion.div
                        className="h-2 w-2 bg-red-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      Live
                    </div>
                  )}
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWebcamToggle}
                  className={`w-full py-3 rounded-full items-center justify-center cursor-pointer  flex text-base font-semibold transition-all duration-300 shadow-md ${webcamEnabled
                      ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
                      : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                    }`}
                >
                  {webcamEnabled ? (
                    <><CameraOff className="mr-2 " /> Disable Camera</>
                  ) : (
                    <><Camera className="mr-2" /> Enable Camera</>
                  )}
                </motion.button>
              </div>
              <div className="md:col-span-4 flex flex-col gap-4">
                <div className="flex-1 relative">
                  <textarea
                    className="w-full h-full min-h-[200px] p-5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 resize-none shadow-sm"
                    placeholder="Speak or type your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isProcessing}
                  />
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gray-100/90 rounded-2xl flex items-center justify-center"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                        <p className="text-gray-800 text-base font-medium">Analyzing your response...</p>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={StartStopRecording}
                    disabled={isProcessing}
                    className={`py-3 rounded-full text-base items-center justify-center cursor-pointer  flex font-semibold transition-all duration-300 shadow-md ${isRecording
                        ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
                        : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                      }`}
                  >
                    {isRecording ? (
                      <><StopCircle className="mr-2" /> Stop Recording</>
                    ) : (
                      <><Mic className="mr-2 " /> Start Recording</>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveAnswer}
                    disabled={isProcessing || !userAnswer.trim()}
                    className={`rounded-full items-center justify-center cursor-pointer  flex text-base font-semibold transition-all duration-300 shadow-md ${isQuestionAnswered(activeQuestionIndex)
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                        : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                      }`}
                  >
                    {isProcessing ? (
                      <><Loader2 className="mr-2  animate-spin" /> Saving...</>
                    ) : isQuestionAnswered(activeQuestionIndex) ? (
                      <><Save className="mr-2 " /> Update Answer</>
                    ) : (
                      <><Save className="mr-2" /> Save Answer</>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
            {isQuestionAnswered(activeQuestionIndex) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-green-50 border border-green-100 rounded-2xl p-6 shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800">Response Recorded</h3>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                    {answeredQuestions.find(a => a.questionIndex === activeQuestionIndex)?.rating}/10
                  </span>
                </div>
                <p className="text-green-700 text-base leading-relaxed">
                  {answeredQuestions.find(a => a.questionIndex === activeQuestionIndex)?.feedback}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex justify-between items-center"
        >
          <div>
            {activeQuestionIndex > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={moveToPreviousQuestion}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 px-6 py-3 rounded-full shadow-md transition-all duration-300 flex items-center gap-2 text-base font-semibold"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </motion.button>
            )}
          </div>
          <div className="flex gap-4">
            {activeQuestionIndex < mockInterviewQuestion.length - 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={moveToNextQuestion}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-full shadow-md transition-all duration-300 flex items-center gap-2 text-base font-semibold"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            )}
            {activeQuestionIndex === mockInterviewQuestion.length - 1 && (
              <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-full shadow-md transition-all duration-300 flex items-center gap-2 text-base font-semibold"
                >
                  <CheckCircle className="h-5 w-5" />
                  Finish Interview
                </motion.button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StartInterview;