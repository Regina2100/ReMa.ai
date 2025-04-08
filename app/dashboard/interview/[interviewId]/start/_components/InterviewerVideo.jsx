"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, RefreshCw, AlertCircle, Camera } from "lucide-react";
import { motion } from "framer-motion";

export default function InterviewerVideo({ questionText, onGenerate }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const generateVideo = async () => {
    if (!questionText) return;

    setLoading(true);
    setError(null);
    setVideoUrl("");

    try {
      // Step 1: Create the video (get talkId)
      const createRes = await fetch("/api/did", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionText }),
      });

      const data = await createRes.json();
      if (!createRes.ok || !data.talkId) {
        throw new Error(data.error || "Failed to start video generation.");
      }

      const talkId = data.talkId;

      // Step 2: Poll for completion
      let attempts = 0;
      const maxAttempts = 30;

      const poll = async () => {
        const res = await fetch(`/api/check-interview-video?talkId=${talkId}`);
        const { status, videoUrl, error: pollError } = await res.json();

        if (status === "done" && videoUrl) {
          setVideoUrl(videoUrl);
          setLoading(false);
        } else if (status === "error" || pollError) {
          throw new Error(pollError || "Error during video generation.");
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 1000);
        } else {
          throw new Error("Video generation timed out.");
        }
      };

      await poll();
    } catch (err) {
      console.error("Video generation failed:", err);
      setError(err.message || "Failed to generate video.");
      setLoading(false);
    }
  };

  const handleVideoError = () => {
    setError("Unable to play the video. Please try again.");
    setVideoUrl("");
  };

  // Expose the generateVideo function to the parent component
  useEffect(() => {
    if (onGenerate) {
      onGenerate(generateVideo);
    }
  }, [onGenerate, questionText]);

  return (
    <div className="w-full h-full bg-black rounded-2xl overflow-hidden flex items-center justify-center relative">
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center p-8 w-full h-full bg-gradient-to-br from-gray-900 to-black"
        >
          <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-300 text-base font-medium">Crafting your interviewer video...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center p-8 w-full h-full bg-gradient-to-br from-gray-900 to-black"
        >
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-400 text-base font-medium">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateVideo}
            className="mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300 flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Retry
          </motion.button>
        </motion.div>
      ) : videoUrl ? (
        <motion.video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          onError={handleVideoError}
          controls
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center p-8 w-full h-full bg-gradient-to-br from-gray-900 to-black"
        >
          <Camera className="h-16 w-16 text-gray-500 mb-4" />
          <p className="text-gray-400 text-base font-medium">Interviewer video ready</p>
          <p className="text-gray-600 text-sm mt-2">Click 'Show Interviewer' to start</p>
        </motion.div>
      )}
    </div>
  );
}