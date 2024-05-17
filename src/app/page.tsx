"use client"
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');

  const handleGo = () => {
    if (inputUrl) {
      localStorage.setItem('videoUrl', inputUrl);
    }
  };

  return (
    <main className="h-full flex justify-center items-center">
      <div className="border border-[0.12rem] mt-[28rem] flex justify-center items-center ">
        <input
          placeholder="  Paste YouTube URL here"
          className="h-12 w-[44rem]"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
        <div className="bg-[#0DA5E9] text-white">
          <Link href="/notes">
            <button onClick={handleGo} className="w-12 h-12">GO</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
