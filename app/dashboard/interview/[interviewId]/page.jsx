"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon, Video, Mic } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
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
    }
  };

  if (!interviewData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl text-gray-600">Loading interview details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-6 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Prepare for Your Interview</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Interview Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Interview Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Job Role</span>
                  <p className="text-lg text-gray-900">{interviewData.jobPosition}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Tech Stack & Description</span>
                  <p className="text-lg text-gray-900">{interviewData.jobDesc}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Experience</span>
                  <p className="text-lg text-gray-900">{interviewData.jobExperience} years</p>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-100 rounded-xl p-6 shadow-sm border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-medium text-amber-800">Quick Info</h3>
              </div>
              <p className="text-amber-700 text-sm leading-relaxed">
                Enable your webcam and microphone to begin your AI-powered mock interview. 
                You'll answer 5 questions, and receive a detailed performance report. 
                <span className="font-medium">Your privacy is safe - we never record video.</span>
              </p>
            </div>
          </div>

          {/* Right Panel - Webcam */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full max-w-md">
              {webCamEnabled ? (
                <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <Webcam
                    mirrored={true}
                    style={{ width: "100%", height: "auto" }}
                    onUserMedia={() => setWebCamEnabled(true)}
                    onUserMediaError={() => {
                      toast.error("Webcam access error");
                      setWebCamEnabled(false);
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    Live
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl p-12 flex flex-col items-center justify-center h-[300px] border border-gray-200">
                  <WebcamIcon className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 text-sm">Webcam preview will appear here</p>
                </div>
              )}
            </div>

            <Button
              onClick={handleWebcamToggle}
              className={`w-full max-w-md transition-all duration-200 ${
                webCamEnabled 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {webCamEnabled ? (
                <>
                  <Video className="mr-2 h-4 w-4" /> Disable Webcam
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" /> Enable Webcam & Mic
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-10 flex justify-center">
          <Link href={`/dashboard/interview/${params.interviewId}/start`}>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg shadow-md transition-all duration-200"
            >
              Start Interview Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Interview;