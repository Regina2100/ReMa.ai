"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function InterviewerVideo({ questionText }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  
  useEffect(() => {
    // Skip if no question text provided
    if (!questionText) return;
    
    const generateVideo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Clear previous video
        setVideoUrl("");
        
        const response = await fetch('/api/did', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ questionText }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setVideoUrl(data.videoUrl);

        console.log(data)
      } catch (err) {
        console.error("Failed to generate video:", err);
        setError(err.message || "Failed to generate interviewer video. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    generateVideo();
  }, [questionText]);

  // Handle video loading errors
  const handleVideoError = () => {
    setError("Unable to play the interviewer video. Please try refreshing.");
  };

  return (
    <div className="mt-4  w-1/2 bg-black rounded-xl overflow-hidden flex items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
          <p className="text-gray-400 text-sm">Generating interviewer video...</p>
        </div>
      ) : error ? (
        <div className="text-center p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : videoUrl ? (
        <video 
          ref={videoRef}
          src={videoUrl} 
          autoPlay
          onError={handleVideoError}
          className="w-full h-full object-cover" 
        />
      ) : (
        <p className="text-gray-400 text-sm">Ready to generate interview video</p>
      )}
    </div>
  );
}