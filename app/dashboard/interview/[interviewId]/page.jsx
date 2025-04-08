"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { 
  Lightbulb, 
  WebcamIcon, 
  Video, 
  Mic, 
  BriefcaseIcon, 
  Code2Icon, 
  ClockIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ActivityIcon,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    setIsLoading(true);
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (result.length > 0) {
        setInterviewData(result[0]);
      } else {
        toast.error("Interview details not found");
      }
    } catch (error) {
      toast.error("Error fetching interview details");
      console.error("Interview details fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebcamToggle = () => {
    if (!webCamEnabled) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(() => {
          setWebCamEnabled(true);
          toast.success("Webcam and microphone enabled");
        })
        .catch((error) => {
          toast.error("Failed to access webcam or microphone");
          console.error("Webcam access error:", error);
        });
    } else {
      setWebCamEnabled(false);
      toast.info("Webcam and microphone disabled");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 px-6 max-w-md"
        >
          <div className="relative mx-auto w-28 h-28">
            <ActivityIcon className="absolute inset-0 w-full h-full text-indigo-600 animate-spin" />
            <motion.div
              className="absolute inset-0 w-full h-full border-4 border-indigo-200 rounded-full"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Preparing Your Interview</h3>
          <p className="text-gray-600 text-lg">Crafting your personalized AI-powered session...</p>
        </motion.div>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-white shadow-2xl rounded-3xl border-0 max-w-lg w-full overflow-hidden">
            <CardHeader className="text-center pb-0 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full opacity-50"></div>
              <div className="mx-auto bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Interview Not Found</h2>
            </CardHeader>
            <CardContent className="text-center space-y-4 pt-4">
              <p className="text-gray-600 text-lg">
                It seems this interview doesn’t exist or has been removed. Let’s get you back on track.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pb-8">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-10 py-3 rounded-full shadow-lg transition-all duration-300 text-lg">
                  Back to Dashboard
                </Button>
              </Link>
            </CardFooter>
          </Card>
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
          className="text-center mb-16"
        >
          <Badge className="mb-2 px-4 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold shadow-sm">
            AI-Powered Interview Prep
          </Badge>
          <h1 className="text-5xl md:text-6xl p-2 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 tracking-tight">
            Your {interviewData.jobPosition} Interview
          </h1>
          <p className="mt-2 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Practice with precision for your {interviewData.jobPosition} role with tailored questions and real-time feedback.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Panel - Interview Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <Card className="bg-white shadow-2xl rounded-3xl border-0 overflow-hidden">
              <CardHeader className="relative pb-0">
                <div className="absolute right-0 top-0 h-32 w-32 bg-indigo-100 rounded-bl-full opacity-50"></div>
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 relative z-10">
                  Interview Overview
                </h3>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6 relative z-10"></div>
              </CardHeader>
              <CardContent className="pt-2 space-y-8">
                {[
                  { icon: BriefcaseIcon, color: "blue", label: "Job Role", value: interviewData.jobPosition, bold: true },
                  { icon: Code2Icon, color: "purple", label: "Tech Stack & Description", value: interviewData.jobDesc },
                  { icon: ClockIcon, color: "green", label: "Experience", value: `${interviewData.jobExperience} years`, bold: true },
                  { icon: Lightbulb, color: "amber", label: "Format", value: "5 tailored technical questions" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className={`bg-${item.color}-50 p-3 rounded-full flex-shrink-0 shadow-sm`}>
                      <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">{item.label}</span>
                      <p className={cn("text-lg text-gray-900", item.bold && "font-semibold")}>{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* How It Works Card */}
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              className="bg-gradient-to-r from-amber-50 to-yellow-100 shadow-lg rounded-3xl border-0 overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-200 bg-opacity-50 p-2 rounded-full shadow-sm">
                    <Lightbulb className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-900">How It Works</h3>
                </div>
                <div className="space-y-5">
                  {[
                    "Activate your webcam and mic for an immersive experience",
                    "Answer 5 expertly crafted technical questions",
                    "Get comprehensive feedback powered by AI"
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="flex gap-3 items-center"
                    >
                      <div className="flex-shrink-0 bg-amber-100 rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
                        <span className="text-amber-700 text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-amber-900 text-base">{step}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="mt-6 flex items-center gap-2 bg-amber-100 bg-opacity-70 p-3 rounded-xl shadow-inner"
                >
                  <ShieldCheckIcon className="h-5 w-5 text-amber-700 flex-shrink-0" />
                  <p className="text-amber-900 text-sm font-medium">Privacy-first: No recordings are stored</p>
                </motion.div>
              </CardContent>
            </motion.div>
          </motion.div>

          {/* Right Panel - Webcam */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col space-y-6"
          >
            <Card className="bg-white shadow-2xl rounded-3xl border-0 overflow-hidden h-full flex flex-col">
              <CardHeader className="pb-0">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                  Webcam Setup
                </h3>
                <p className="text-gray-600 text-base mt-2">Preview your camera before starting</p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>
              </CardHeader>
              <CardContent className="pt-2 flex-grow flex flex-col items-center justify-center">
                <div className="w-full max-w-lg mb-8">
                  {webCamEnabled ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100"
                    >
                      <Webcam
                        mirrored={true}
                        className="w-full h-auto min-h-[360px] object-cover"
                        onUserMedia={() => setWebCamEnabled(true)}
                        onUserMediaError={() => {
                          toast.error("Webcam access error");
                          setWebCamEnabled(false);
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-green-500 px-3 py-1 rounded-full text-sm text-white flex items-center gap-1 shadow-md">
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        Live
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-12 flex flex-col items-center justify-center h-[360px] border border-gray-200 shadow-sm">
                      <WebcamIcon className="h-20 w-20 text-gray-300 mb-6" />
                      <p className="text-gray-700 text-lg font-medium">Camera Off</p>
                      <p className="text-gray-500 text-base mt-2">Enable to preview your setup</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleWebcamToggle}
                  className={cn(
                    "w-full max-w-lg transition-all duration-300 rounded-full py-7 flex items-center justify-center gap-3 shadow-lg text-lg font-semibold",
                    webCamEnabled 
                      ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700" 
                      : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                  )}
                >
                  {webCamEnabled ? (
                    <>
                      <Video className="h-6 w-6" /> Disable Camera & Mic
                    </>
                  ) : (
                    <>
                      <Mic className="h-6 w-6" /> Enable Camera & Mic
                    </>
                  )}
                </Button>
              </CardContent>
              
              {webCamEnabled && (
                <CardFooter className="bg-green-50 border-t border-green-100 p-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-2 text-green-800 w-full"
                  >
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <p className="text-base font-medium">Ready for your interview simulation</p>
                  </motion.div>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 flex flex-col items-center"
        >
          <div className="max-w-md w-full text-center">
            <Link href={`/dashboard/interview/${params.interviewId}/start`}>
              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-800 text-white px-10 py-7 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-xl font-semibold group focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                Begin Interview
                <ArrowRightIcon className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
              </Button>
            </Link>
            <p className="text-gray-600 mt-4 text-base">
              Face 5 questions crafted for {interviewData.jobPosition}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Interview;