import React, { Suspense, useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { SingleRiveSwitcherProps } from '../types';
import * as Tone from 'tone';

const IntroView = React.lazy(() => import('./IntroView'));
const ClubView = React.lazy(() => import('./ClubView'));
const FishingView = React.lazy(() => import('./FishingView'));

const RIVE_VIEWS = [IntroView, ClubView, FishingView];

export const riveUrls = [
  // "https://walrus.tusky.io/jRZ1yaSFMDhJK52qPGIupCk_JhD2TAevPbLpW7PuyYo",
  // "https://walrus.tusky.io/hCFOn8my043WjqupqvzS-yxZBymaCsdB7XXbSWrQgXE",
  // "https://walrus.tusky.io/zekWDL_iNhIHlRwGJSzo1HHjuz6v4OgnuQaIu0zbfeI",
  "/dfc_intro.riv", 
  "/dfc_club.riv",
  "/dfc_maingame.riv",
];

export const audioUrls = [
  "https://walrus.tusky.io/MzUbX3bn_GBsArWCB2jELlJwdJwl-LUpOAjNkMizDOo",
  "https://walrus.tusky.io/2okNCM9jqVmaiG60FxNHD3IlXMsloiU6P6RKvdfuG_s",
  "https://walrus.tusky.io/n_AJtHq1E1mJnhnGzweRCEmKNvZxZuA3O_HquHUbs54",
];

export const SingleRiveSwitcher: React.FC<SingleRiveSwitcherProps> = ({
  index,
  onIndexChange,
}) => {
  const prev = () => onIndexChange((index - 1 + RIVE_VIEWS.length) % RIVE_VIEWS.length);
  const next = () => onIndexChange((index + 1) % RIVE_VIEWS.length);
  
  const [canPlay, setCanPlay] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const playerRef = useRef<Tone.Player | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handler = async () => {
      await Tone.start();
      setCanPlay(true);
      setShowOverlay(false);
      document.removeEventListener("pointerdown", handler);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  useEffect(() => {
    if (!canPlay) return;

    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.dispose();
      playerRef.current = null;
    }

    const player = new Tone.Player({
      url: audioUrls[index],
      loop: true,
      autostart: true,
      volume: -6,
    }).toDestination();

    playerRef.current = player;

    return () => {
      player.stop();
      player.dispose();
    };
  }, [index, canPlay]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume.value = isMuted ? -Infinity : -6;
    }
  }, [isMuted]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        >
          <Suspense fallback={<div>Loading…</div>}>
            {index === 0 ? (
              <IntroView onNext={next} />
            ) : index === 1 ? (
              <ClubView onNext={next} />
            ) : (
              <FishingView onPrevious={prev} />
            )}
          </Suspense>
        </motion.div>
      </AnimatePresence>

      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 10,
        }}
      >
      
      <button
        onClick={() => window.open('https://x.com/darkshore_fc', '_blank')}
        style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          border: 'none',
          padding: '0.5rem',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Go to X"
      >
        <img
          src="https://walrus.tusky.io/10GPGQ_sJbfGacgV_pRCTmk14UXPMoSN3zLTXmo8KuM"
          alt="X Logo"
          style={{ width: '18px', height: '18px', display: 'block' }}
        />
      </button>

          <button
            onClick={() => setIsMuted(m => !m)}
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              border: 'none',
              padding: '0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            <img
              src={
                isMuted
                  ? 'https://walrus.tusky.io/gj6K10WThcdzUXfcH_8ABZW3JG8EltPDRAjXntplio8'
                  : 'https://walrus.tusky.io/XxNTVCBTLgVvDZywbaYX1WaD_o088VXrljS1AMifrG0'
              }
              alt={isMuted ? 'Unmute' : 'Mute'}
              style={{ width: '24px', height: '24px', display: 'block' }}
            />
          </button>
      </div>



      {showOverlay && (
        <div
          onClick={() => {
            window.Howler?.ctx?.resume();
            setCanPlay(true);
            setShowOverlay(false);
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 9999,
            opacity: showOverlay ? 1 : 0,
            transition: 'opacity 0.8s ease-out',
          }}
        >
          <img 
            src="https://walrus.tusky.io/XeM5yDNcyM9GV64r2GqVv1e4EhfqKN5_xLXdnmikdX8"
            alt="Click to Start"
            style={{
              maxWidth: '80%',
              maxHeight: '80%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}
  
      
    </div>
  );
};