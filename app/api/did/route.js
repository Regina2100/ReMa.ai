import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { questionText } = await request.json();

    if (!questionText) {
      return NextResponse.json({ error: 'Question text is required' }, { status: 400 });
    }

    const D_ID_API_KEY = process.env.D_ID_API_KEY;
    const D_ID_API_URL = "https://api.d-id.com";

    if (!D_ID_API_KEY) {
      console.error("Missing D-ID API key");
      return NextResponse.json({ error: 'D-ID API key not configured' }, { status: 500 });
    }

    // Log the request being made (remove sensitive data in production)
    console.log(`Making request to D-ID API with text: "${questionText.substring(0, 20)}..."`);

    const createTalkPayload = {
      script: {
        type: "text",
        input: questionText,
        provider: {
          type: "microsoft",
          voice_id: "en-US-JennyNeural",
        },
      },
      config: {
        fluent: true,
        pad_audio: 0.5
      },
      source_url: "https://create-images-results.d-id.com/google-oauth2%7C104065124066654804836/upl_nHfl_YS4mQFOHv7neDv5C/image.jpeg",
    };

    // The authorization format might be wrong - D-ID typically uses Bearer token
    // Check D-ID documentation for the correct format
    const createTalkResponse = await fetch(`${D_ID_API_URL}/talks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        "Authorization": `Basic ${D_ID_API_KEY}`
      },
      body: JSON.stringify(createTalkPayload)
    });

    // Improved error handling
    if (!createTalkResponse.ok) {
      const errorDetail = await createTalkResponse.json();
      console.error("D-ID API error:", errorDetail);
      
      return NextResponse.json({ 
        error: "Failed to create talk", 
        details: errorDetail,
        status: createTalkResponse.status 
      }, { status: createTalkResponse.status });
    }

    const responseData = await createTalkResponse.json();
    const talkId = responseData.id;

    console.log(`Successfully created talk with ID: ${talkId}`);
    return NextResponse.json({
      talkId,
      message: "Talk created. Poll for video using this ID."
    });

  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}