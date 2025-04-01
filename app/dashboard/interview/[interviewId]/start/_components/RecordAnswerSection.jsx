"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useRef } from "react";
import { Mic, StopCircle, Loader2, Camera, CameraOff, WebcamIcon } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import Webcam from "react-webcam";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
  onAnswerSave,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const recognitionRef = useRef(null);
  const webcamRef = useRef(null);

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

  const handleWebcamToggle = async () => {
    if (!webcamEnabled) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setWebcamEnabled(true);
        toast.success("Webcam enabled");
      } catch (error) {
        toast.error("Failed to enable webcam", { description: "Check permissions" });
        console.error("Webcam error:", error);
      }
    } else {
      setWebcamEnabled(false);
      toast.info("Webcam disabled");
    }
  };

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

  const UpdateUserAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer");
      return;
    }

    setLoading(true);
    try {
      const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Provide a rating out of 10 and feedback in JSON format: { "rating": <number>, "feedback": <text> }`;
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = result.response.text().replace(/```json|```/g, "").trim();
      const JsonfeedbackResp = JSON.parse(mockJsonResp);

      const answerRecord = {
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonfeedbackResp?.feedback,
        rating: JsonfeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      };

      await db.insert(UserAnswer).values(answerRecord);
      onAnswerSave?.(answerRecord);

      toast.success("Answer saved successfully");
      setUserAnswer("");
    } catch (error) {
      toast.error("Failed to save answer", { description: error.message });
      console.error("Answer save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative space-y-6">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-gray-900/80 z-50 flex flex-col items-center justify-center rounded-xl">
          <Loader2 className="h-12 w-12 animate-spin text-white mb-2" />
          <p className="text-white">Processing your answer...</p>
        </div>
      )}

      {/* Webcam Section */}
      <div className="flex flex-col items-center">
        <div className="w-64 h-48 relative rounded-xl overflow-hidden shadow-sm border border-gray-200">
          {webcamEnabled ? (
            <Webcam
              ref={webcamRef}
              mirrored={true}
              style={{ width: "100%", height: "100%" }}
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => {
                toast.error("Webcam access error");
                setWebcamEnabled(false);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
              <WebcamIcon className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-600 text-sm">Camera Off</p>
            </div>
          )}
          {webcamEnabled && (
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Live
            </span>
          )}
        </div>
        <Button
          onClick={handleWebcamToggle}
          className={`mt-4 w-64 transition-all duration-200 ${
            webcamEnabled
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {webcamEnabled ? (
            <>
              <CameraOff className="mr-2 h-4 w-4" /> Disable Webcam
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" /> Enable Webcam
            </>
          )}
        </Button>
      </div>

      {/* Recording Controls */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={StartStopRecording}
          disabled={loading || !recognitionRef.current}
          className={`flex items-center gap-2 transition-all duration-200 ${
            isRecording
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isRecording ? (
            <>
              <StopCircle className="h-4 w-4 animate-pulse" /> Stop
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" /> Record
            </>
          )}
        </Button>
      </div>

      {/* Answer Input */}
      <textarea
        className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        placeholder="Your answer will appear here as you speak, or type manually..."
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
      />

      {/* Save Button */}
      <Button
        onClick={UpdateUserAnswer}
        disabled={loading || !userAnswer.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          "Save Answer"
        )}
      </Button>
    </div>
  );
};

export default RecordAnswerSection;