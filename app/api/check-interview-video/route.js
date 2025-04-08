// app/api/check-interview-video/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const talkId = searchParams.get("talkId");

    if (!talkId) {
      return NextResponse.json({ error: "talkId is required" }, { status: 400 });
    }

    const D_ID_API_KEY = process.env.D_ID_API_KEY;
    const D_ID_API_URL = "https://api.d-id.com";

    const statusResponse = await fetch(`${D_ID_API_URL}/talks/${talkId}`, {
      headers: {
        "Authorization": `Basic ${D_ID_API_KEY}`
      }
    });

    if (!statusResponse.ok) {
      return NextResponse.json({ error: "Failed to get talk status" }, { status: statusResponse.status });
    }

    const statusData = await statusResponse.json();

    return NextResponse.json({
      status: statusData.status,
      videoUrl: statusData.result_url || null
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal error", message: error.message }, { status: 500 });
  }
}
