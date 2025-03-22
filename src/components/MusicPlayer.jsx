import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoPlayCircleOutline, IoPauseCircleOutline } from 'react-icons/io5';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { TbVolume, TbVolumeOff } from 'react-icons/tb';
import '../styles/MusicPlayer.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef(null);

  const tracks = [
    {
      name: "Peaceful Garden",
      artist: "Nature Sounds",
      url: "/music/peaceful-garden.mp3",
      cover: "🌸"
    },
    {
      name: "Magic Forest",
      artist: "Ambient Dreams",
      url: "/music/magic-forest.mp3",
      cover: "🌿"
    },
    {
      name: "Mystical Dreams",
      artist: "Meditation Music",
      url: "/music/mystical-dreams.mp3",
      cover: "✨"
    }
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    if (isPlaying) {
      setTimeout(() => audioRef.current.play(), 0);
    }
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    if (isPlaying) {
      setTimeout(() => audioRef.current.play(), 0);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="music-player-floating">
      <motion.div
        className="music-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <button className="main-button" onClick={togglePlay}>
          <span className="track-emoji">{tracks[currentTrack].cover}</span>
          {isPlaying ? <IoPauseCircleOutline /> : <IoPlayCircleOutline />}
        </button>

        <AnimatePresence>
          {showControls && (
            <motion.div
              className="controls-popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="track-info">
                <div className="track-name">{tracks[currentTrack].name}</div>
                <div className="track-artist">{tracks[currentTrack].artist}</div>
              </div>

              <div className="controls">
                <button className="control-button" onClick={prevTrack}>
                  <MdSkipPrevious />
                </button>
                <button className="control-button" onClick={nextTrack}>
                  <MdSkipNext />
                </button>
              </div>

              <div className="volume-control">
                <button
                  className="volume-icon"
                  onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                >
                  {volume === 0 ? <TbVolumeOff /> : <TbVolume />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <audio
        ref={audioRef}
        src={tracks[currentTrack].url}
        onEnded={nextTrack}
      />
    </div>
  );
};

export default MusicPlayer;