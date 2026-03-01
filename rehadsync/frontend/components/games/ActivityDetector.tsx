"use client";

import { useEffect, useRef } from "react";

export default function ActivityDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }
    startCamera();
  }, []);

  return (
    <div>
      <h2>Live Activity Detection</h2>
      <video ref={videoRef} autoPlay playsInline width={500} />
    </div>
  );
}