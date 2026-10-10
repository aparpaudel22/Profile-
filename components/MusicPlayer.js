"use client";

import { useEffect, useRef, useState } from "react";
import { playlist } from "../app/data";
import DiscCover from "./DiscCover";

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const autoplayRef = useRef(false); // start playing as soon as the new track is ready
  const ctxRef = useRef(null);       // Web Audio context
  const gainRef = useRef(null);      // volume control that also works on iPhone
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState("Add your MP3 files to public/music to start listening.");

  // Apply volume: through the gain node if it exists, otherwise directly.
  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume;
    else if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Must be called from a tap/click so mobile browsers allow audio.
  function unlockAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    if (!gainRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        try {
          const ctx = new AC();
          const source = ctx.createMediaElementSource(audio);
          const gain = ctx.createGain();
          gain.gain.value = volume;
          source.connect(gain);
          gain.connect(ctx.destination);
          audio.volume = 1; // the gain node controls loudness from now on
          ctxRef.current = ctx;
          gainRef.current = gain;
        } catch {
          // fall back to audio.volume
        }
      }
    }

    if (ctxRef.current && ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
  }

  function playAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (ctxRef.current && ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    audio.play().catch(() => {
      setStatus("Could not play this track. Press ▶ to start it.");
    });
  }

  function selectTrack(index, autoplay = false) {
    unlockAudio();

    const next = (index + playlist.length) % playlist.length;
    const audio = audioRef.current;

    // Same track (for example a one-song playlist): just restart it.
    if (next === active) {
      if (audio) audio.currentTime = 0;
      setTime(0);
      if (autoplay) playAudio();
      return;
    }

    autoplayRef.current = autoplay;
    setActive(next);
    setTime(0);
    setDuration(0);
    setStatus(autoplay ? `Loading: ${playlist[next].title}` : `Selected: ${playlist[next].title}`);
    // React updates the <audio src>; onCanPlay below starts playback.
  }

  function toggle() {
    unlockAudio();
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) playAudio();
    else audio.pause();
  }

  function stop() {
    const audio = audioRef.current;
    if (!audio) return;
    autoplayRef.current = false;
    audio.pause();
    audio.currentTime = 0;
    setTime(0);
    setStatus("Stopped.");
  }

  // Song finished: go to the next one, or stop at the end of the playlist.
  function handleEnded() {
    if (active < playlist.length - 1) {
      selectTrack(active + 1, true);
      return;
    }
    const audio = audioRef.current;
    if (audio) audio.currentTime = 0;
    setPlaying(false);
    setTime(0);
    setStatus("Playlist finished.");
  }

  const track = playlist[active];

  return (
    <article className="panel music-panel">
      <div className="panel-heading">
        <h3>Playlist</h3>
        <span className={playing ? "music-note playing" : "music-note"} aria-hidden="true">♫</span>
      </div>

      <DiscCover src={track.cover} title={track.title} playing={playing} fit={track.fit} />

      <div className="track-info" style={{ textAlign: "center", marginBottom: 16 }}>
        <p className="eyebrow" style={{ margin: 0, fontSize: 8 }}>
          {playing ? "NOW PLAYING" : "NOW SELECTED"}
        </p>
        <h4 style={{ margin: "4px 0 2px", fontSize: 15 }}>{track.title}</h4>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 11 }}>{track.artist}</p>
      </div>

      <label className="select-label" htmlFor="track-select">CHOOSE FROM PLAYLIST</label>
      <select
        id="track-select"
        value={active}
        onChange={(e) => selectTrack(Number(e.target.value), playing)}
      >
        {playlist.map((t, i) => (
          <option value={i} key={t.src}>{t.title}</option>
        ))}
      </select>

      <ol className="playlist">
        {playlist.map((t, i) => (
          <li key={t.src}>
            <button
              type="button"
              className={i === active ? "selected" : ""}
              onClick={() => selectTrack(i, playing)}
            >
              <span>{t.title}</span>
              <small>{t.artist}</small>
            </button>
          </li>
        ))}
      </ol>

      <audio
        ref={audioRef}
        src={track.src}
        preload="auto"
        playsInline
        onCanPlay={() => {
          if (autoplayRef.current) {
            autoplayRef.current = false;
            playAudio();
          }
        }}
        onPlay={() => {
          setPlaying(true);
          setStatus(`Playing: ${track.title}`);
        }}
        onPause={() => {
          setPlaying(false);
          if (!autoplayRef.current) setStatus((s) => (s.startsWith("Playing") ? "Paused." : s));
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onEnded={handleEnded}
        onError={() => {
          autoplayRef.current = false;
          setStatus("Track file not found. Check its path in data.js.");
        }}
      />

      <div className="audio-progress">
        <input
          type="range"
          min="0"
          max={duration || 1}
          value={Math.min(time, duration || 0)}
          aria-label="Seek through track"
          onChange={(e) => {
            if (audioRef.current) audioRef.current.currentTime = Number(e.target.value);
          }}
        />
        <div className="time-row">
          <span>{formatTime(time)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="audio-controls">
        <button
          className="small-button"
          type="button"
          aria-label="Previous track"
          onClick={() => {
            if (audioRef.current?.currentTime > 3) audioRef.current.currentTime = 0;
            else selectTrack(active - 1, true);
          }}
        >
          ←
        </button>

        <button className="play-button" type="button" aria-label={playing ? "Pause" : "Play"} onClick={toggle}>
          {playing ? "Ⅱ" : "▶"}
        </button>

        

        <button
          className="small-button"
          type="button"
          aria-label="Next track"
          onClick={() => selectTrack(active + 1, true)}
        >
          →
        </button>

        <label className="volume-label" htmlFor="volume-control">VOL</label>
        <input
          id="volume-control"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          aria-label="Volume"
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>

      <p className="audio-status" aria-live="polite">{status}</p>
    </article>
  );
}