// app/api/generate-interview-video/route.js
import { NextResponse } from 'next/server';

// In-memory cache for videos (consider using Redis or similar for production)
const videoCache = new Map();

export async function POST(request) {
  try {
    const { questionText } = await request.json();
    
    // Debug log the request
    console.log("Received request for video generation:", { questionText: questionText?.substring(0, 50) + "..." });
    
    if (!questionText) {
      return NextResponse.json({ error: 'Question text is required' }, { status: 400 });
    }
    
    // Check cache first
    const cacheKey = createCacheKey(questionText);
    const cachedUrl = videoCache.get(cacheKey);
    
    if (cachedUrl) {
      console.log("Found cached video URL:", cachedUrl);
      return NextResponse.json({ videoUrl: cachedUrl });
    }
    
    // D-ID API credentials from environment variables
    const D_ID_API_KEY = process.env.D_ID_API_KEY;
    const D_ID_API_URL = "https://api.d-id.com";
    
    if (!D_ID_API_KEY) {
      console.error("D-ID API key not configured in environment variables");
      return NextResponse.json({ error: 'D-ID API key not configured' }, { status: 500 });
    }
    
    console.log("Starting D-ID video generation process");
    
    // Step 1: Create a talk
    const createTalkPayload = {
      script: {
        type: "text",
        input: questionText,
        provider: {
          type: "microsoft",
          voice_id: "en-US-JennyNeural", // Professional female voice
        },
      },
      config: {
        fluent: true,
        pad_audio: 0.5
      },
      source_url: "https://create-images-results.d-id.com/google-oauth2%7C104065124066654804836/upl_nHfl_YS4mQFOHv7neDv5C/image.jpeg",
    };
    
    console.log("Sending create talk request with payload:", JSON.stringify(createTalkPayload).substring(0, 200) + "...");
    
    const createTalkResponse = await fetch(`${D_ID_API_URL}/talks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${D_ID_API_KEY}`
      },
      body: JSON.stringify(createTalkPayload)
    });

    // Log the complete raw response for debugging
    console.log("Create talk response status:", createTalkResponse.status);
    console.log("Create talk response headers:", Object.fromEntries(createTalkResponse.headers.entries()));
    
    if (!createTalkResponse.ok) {
      let errorDetail = {};
      try {
        errorDetail = await createTalkResponse.json();
      } catch (e) {
        console.error("Failed to parse error response:", e);
        try {
          errorDetail = { text: await createTalkResponse.text() };
        } catch (textError) {
          console.error("Failed to get response text:", textError);
        }
      }
      
      console.error("D-ID API error:", errorDetail);
      return NextResponse.json(
        { 
          error: `Failed to create talk: ${createTalkResponse.statusText}`,
          details: errorDetail
        }, 
        { status: createTalkResponse.status }
      );
    }

    // Parse the response body
    let responseData;
    try {
      responseData = await createTalkResponse.json();
      console.log("Create talk successful, received ID:", responseData.id);
    } catch (e) {
      console.error("Failed to parse response JSON:", e);
      return NextResponse.json({ error: 'Failed to parse D-ID response' }, { status: 500 });
    }

    const talkId = responseData.id;
    
    if (!talkId) {
      console.error("No talk ID returned from D-ID API:", responseData);
      return NextResponse.json({ error: 'No talk ID in D-ID response', responseData }, { status: 500 });
    }
    
    // Step 2: Poll for video completion
    let videoUrl = null;
    let attempts = 0;
    const maxAttempts = 30; // Maximum polling attempts
    
    console.log("Starting polling for video completion, talk ID:", talkId);
    
    while (!videoUrl && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between polls
      
      console.log(`Polling attempt ${attempts+1}/${maxAttempts}`);
      
      const statusResponse = await fetch(`${D_ID_API_URL}/talks/${talkId}`, {
        headers: {
          "Authorization": `Basic ${D_ID_API_KEY}`
        }
      });
      
      if (!statusResponse.ok) {
        console.error(`Status check failed with code ${statusResponse.status}`);
        return NextResponse.json(
          { error: `Failed to get talk status: ${statusResponse.statusText}` }, 
          { status: statusResponse.status }
        );
      }
      
      const statusData = await statusResponse.json();
      console.log(`Status check result: ${statusData.status}`, statusData);
      
      if (statusData.status === "done") {
        videoUrl = statusData.result_url;
        console.log("Video generation complete, URL:", videoUrl);
        
        try {
          const videoCheckResponse = await fetch(videoUrl, { method: 'GET' });
          if (!videoCheckResponse.ok) {
            console.error("Generated video URL is not accessible:", videoCheckResponse.status);
            return NextResponse.json(
              { error: `Generated video URL is not accessible: ${videoCheckResponse.statusText}` }, 
              { status: 502 }
            );
          }
          
          const contentType = videoCheckResponse.headers.get('content-type');
          if (!contentType || !contentType.includes('video/')) {
            console.warn("URL may not be a valid video. Content-Type:", contentType);
          }
          
          console.log("Video URL validated successfully");
          // Cache the video URL
          videoCache.set(cacheKey, videoUrl);
        } catch (videoCheckError) {
          console.error("Error validating video URL:", videoCheckError);
          // Continue anyway since the URL might still work
        }
      } else if (statusData.status === "error") {
        console.error("D-ID processing error:", statusData.error_code, statusData.error);
        return NextResponse.json(
          { 
            error: `D-ID processing error: ${statusData.error}`,
            code: statusData.error_code,
            details: statusData
          }, 
          { status: 500 }
        );
      }
      
      attempts++;
    }
    
    if (!videoUrl) {
      console.error("Video generation timed out after", maxAttempts, "attempts");
      return NextResponse.json({ error: "Video generation timed out" }, { status: 504 });
    }
    
    console.log("Successfully generated video, returning URL");
    return NextResponse.json({ 
      videoUrl,
      talkId, // Including the talk ID for reference/debugging
      message: "Video generated successfully"
    });
    
  } catch (error) {
    console.error("Server error generating interview video:", error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

/**
 * Create a consistent cache key from question text
 * @param {string} text - The question text
 * @returns {string} - A hash to use as cache key
 */
function createCacheKey(text) {
  // Simple hashing function for cache keys
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `question_${hash}`;
}