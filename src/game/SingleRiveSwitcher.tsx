import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import DynamicRive from "./DynamicRive";

export const riveUrls = [
  // "https://walrus.tusky.io/F2TKOpWVCphPPhjAlcFjxreRxMfPGuOk_hcf_NBqOyA",
  "/dfc_intro.riv",
  "/dfc_maingame.riv",
  "/df_test.riv",
];

export type RiveEventWithIndex = { name: string; index: number };

interface SingleRiveSwitcherProps {
  index: number;
  cardIndex: number;
  timeNormalized: number;
  onIndexChange: (i: number) => void;
  onRiveEvent?: (e: RiveEventWithIndex) => void;
}

export const SingleRiveSwitcher: React.FC<SingleRiveSwitcherProps> = ({
  index,
  cardIndex,
  timeNormalized,
  onIndexChange,
  onRiveEvent,
}) => {
  const prev = () => onIndexChange((index - 1 + riveUrls.length) % riveUrls.length);
  const next = () => onIndexChange((index + 1) % riveUrls.length);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={riveUrls[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.5, duration: 1 } }}
          transition={{ duration: 1 }}
          style={{ position: "relative", overflow: "hidden", width: "100%", height: "100vh" }}
        >
          <DynamicRive
            src={riveUrls[index]}
            cardIndex={cardIndex}
            onRiveEvent={(ev) => onRiveEvent?.({ name: ev.name, index })}
          />
        </motion.div>
      </AnimatePresence>

      <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center" }}>
        <button onClick={prev}>◀ Prev</button>
        <button onClick={next} style={{ marginLeft: 8 }}>
          Next ▶
        </button>
      </div>
    </div>
  );
};