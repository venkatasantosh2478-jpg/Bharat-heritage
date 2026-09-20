import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

export default function HeroVideo({ src, showControls = true }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
    }
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function toggleFullscreen() {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      v.requestFullscreen?.() || v.webkitRequestFullscreen?.();
    }
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    setMuted(true);
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
    return () => {
      try { v.pause(); } catch {}
    };
  }, [src]);

  return (
    <div className="relative w-full h-full group">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-center"
        src={src}
        muted={muted}
        loop
        playsInline
        autoPlay
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={() => setMuted(!!videoRef.current?.muted)}
      />

      {/* Floating Compact Video Controller Bar */}
      {showControls && (
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-30 flex items-center gap-1.5 p-1.5 sm:p-2 rounded-full bg-stone-950/85 text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause video" : "Play video"}
            className="w-8 h-8 sm:w-9 sm:h-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
            title={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-amber-400 fill-amber-400" />}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute audio" : "Mute audio"}
            className="w-8 h-8 sm:w-9 sm:h-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
            title={muted ? "Unmute Sound" : "Mute Sound"}
          >
            {muted ? <VolumeX className="w-4 h-4 text-stone-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="w-8 h-8 sm:w-9 sm:h-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
            title="Fullscreen"
          >
            <Maximize className="w-4 h-4 text-stone-200" />
          </button>
        </div>
      )}
    </div>
  );
}