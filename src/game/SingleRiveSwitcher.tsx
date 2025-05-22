import React, { Suspense } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import DynamicRive from "./DynamicRive";
import { SingleRiveSwitcherProps } from '../types';

const IntroView = React.lazy(() => import('./IntroView'));
const ClubView = React.lazy(() => import('./ClubView'));
const FishingView = React.lazy(() => import('./FishingView'));

const RIVE_VIEWS = [IntroView, ClubView, FishingView];

export const riveUrls = [
  // "https://walrus.tusky.io/F2TKOpWVCphPPhjAlcFjxreRxMfPGuOk_hcf_NBqOyA",
  "/dfc_intro.riv",
  "/df_club.riv",
  "/dfc_maingame.riv",
];

export type RiveEventWithIndex = { name: string; index: number };

export const SingleRiveSwitcher: React.FC<SingleRiveSwitcherProps> = ({
  index,
  onIndexChange,
}) => {
  const prev = () => onIndexChange((index - 1 + RIVE_VIEWS.length) % RIVE_VIEWS.length);
  const next = () => onIndexChange((index + 1) % RIVE_VIEWS.length);

  const ActiveView = RIVE_VIEWS[index];

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
              <FishingView />
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
    </div>
  );
};