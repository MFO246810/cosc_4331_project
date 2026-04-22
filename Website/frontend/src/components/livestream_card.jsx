import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const LiveStreamPlayer = ({ streamUrl = 'http://localhost:8080/hls/stream.m3u8' }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls;

    // Check if the browser requires hls.js to play the stream
    if (Hls.isSupported()) {
      hls = new Hls({
        // Optional: Tweak these settings for low-latency streaming
        lowLatencyMode: true,
        backBufferLength: 90 
      });
      
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => console.error("Auto-play prevented by browser:", err));
      });
    } 
    // Fallback for browsers with native HLS support (like Safari)
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(err => console.error("Auto-play prevented by browser:", err));
      });
    }

    // Cleanup hls instance on component unmount
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl]);

  return (
    <>
      {/* PLAYER CONTAINER WITH GRAY BORDER
        'border-4' gives it a 4px solid border.
        'border-gray-500' sets the color to a distinct medium gray.
      */}
      <div className="w-full max-w-4xl bg-black rounded-xl overflow-hidden border-4 border-gray-500 shadow-2xl">
        
        {/* Stream Header */}
        <div className="p-3 bg-gray-800 border-b border-gray-600 flex items-center justify-between">
          <h2 className="text-white font-mono font-semibold flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            LIVE FEED
          </h2>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            controls
            muted
          />
        </div>
        
      </div>
    </>
      
  );
};

export default LiveStreamPlayer;