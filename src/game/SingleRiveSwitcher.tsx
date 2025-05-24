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

  // Unlock audio context
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

  // Change audio on index
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
        {/* <button onClick={prev}>◀ Prev</button>
        <button onClick={next} style={{ marginLeft: 8 }}>
          Next ▶
        </button> */}
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
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontFamily: 'sans-serif',
            cursor: 'pointer',
            zIndex: 9999,
            opacity: showOverlay ? 1 : 0,
            transition: 'opacity 0.8s ease-out',
          }}
        >
          Click to Start
        </div>
      )}
  
      
    </div>
  );
};