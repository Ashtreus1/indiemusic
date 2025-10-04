"use client"

import { useAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { playingAtom } from '@/lib/atom'
import ReactPlayer from 'react-player';
import { Track } from './types'

async function fetchTracks(): Promise<Track[]> {
  const res = await fetch("/api/tracks");
  const data = await res.json();
  return data.tracks || [];
}

export default function Home(){
  const { data: tracks = [], isLoading, error } = useQuery({
    queryKey: ['tracks'],
    queryFn: fetchTracks
  });

  const [playing, setPlaying] = useAtom(playingAtom);

  if (isLoading) return <p className="text-white">Loading tracks...</p>;
  if (error) return <p className="text-red-500">Error loading tracks</p>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Indie Audius Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tracks.map((t) => (
          <div key={t.id} className="bg-gray-800 rounded-lg overflow-hidden">
            {t.artwork && <img src={t.artwork} alt={t.title} />}
            <div className="p-4">
              <h2 className="font-semibold">{t.title}</h2>
              <p className="text-sm text-gray-400">{t.artist}</p>
              <button
                className="mt-2 px-3 py-1 bg-indigo-600 rounded"
                onClick={() => setPlaying(playing === t.streamUrl ? null : t.streamUrl)}
              >
                {playing === t.streamUrl ? "Stop" : "Play"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {playing && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[400px] bg-gray-800 rounded p-2">
          <ReactPlayer url={playing} playing controls width="100%" height="50px" />
        </div>
      )}
    </div>
  );
}