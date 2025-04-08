// app/api/check-video-status/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const talkId = searchParams.get('talkId');
    
    if (!talkId) {
      return NextResponse.json({ error: 'Talk ID is required' }, { status: 400 });
    }
    
    // D-ID API credentials from environment variables
    const D_ID_API_KEY = process.env.D_ID_API_KEY;
    const D_ID_API_URL = "https://api.d-id.com";
    
    if (!D_ID_API_KEY) {
      return NextResponse.json({ error: 'D-ID API key not configured' }, { status: 500 });
    }
    
    const statusResponse = await fetch(`${D_ID_API_URL}/talks/${talkId}`, {
      headers: {
        "Authorization": `Basic ${D_ID_API_KEY}`
      }
    });
    
    if (!statusResponse.ok) {
      return NextResponse.json(
        { error: `Failed to check status: ${statusResponse.statusText}` }, 
        { status: statusResponse.status }
      );
    }
    
    const statusData = await statusResponse.json();
    return NextResponse.json(statusData);
    
  } catch (error) {
    console.error("Server error checking video status:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}