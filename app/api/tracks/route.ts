import { NextResponse } from "next/server";
import { sdk } from "@audius/sdk";

if (!process.env.AUDIUS_API_KEY) {
  throw new Error("Missing AUDIUS_API_KEY");
}

const audiusSdk = sdk({
  apiKey: process.env.AUDIUS_API_KEY,
});

export async function GET() {
  try {
    const trendingRes = await audiusSdk.tracks.getTrendingTracks();
    const trackList = trendingRes.data || [];

    const withStreams = await Promise.all(
      trackList.map(async (t) => {
        const streamUrl = await audiusSdk.tracks.getTrackStreamUrl({ trackId: t.id });
        return {
          id: t.id,
          title: t.title,
          artist: t.user?.name,
          artwork: t.artwork?._150x150 || null,
          streamUrl,
        };
      })
    );

    return NextResponse.json({ tracks: withStreams });
  } catch (err: any) {
    console.error("SDK error fetching tracks:", err.message || err);
    return NextResponse.json({ error: "Could not fetch tracks" }, { status: 500 });
  }
}
