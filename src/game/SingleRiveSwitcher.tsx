// SingleRiveSwitcher.tsx
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DynamicRive from "./DynamicRive";

const riveUrls = [
  "https://arweave.net/lYnwRYyAywkFLi-uXrfSEtXC4M154UxgQCSXBnMuk8Q",
  "https://arweave.net/nAwybMT1YihjZoj2wOgb9Cs7DA6N6HdtfadaA-l8dlg",
  "https://arweave.net/3TyDt1UmAeF2DXa8bXAvq5ECbXbUabUTLK6Ewi8Jsto",
];

export const SingleRiveSwitcher: React.FC<{
  onRiveEvent?: (e: { name: string; index: number }) => void;
}> = ({ onRiveEvent }) => {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent(c => (c - 1 + riveUrls.length) % riveUrls.length), []);
  const next = useCallback(() => setCurrent(c => (c + 1) % riveUrls.length), []);

  return (
    <div>
       <AnimatePresence mode="wait">
        <motion.div
            key={riveUrls[current]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.2, duration: 1 } }}
            transition={{ duration: 1 }}
        >
            <DynamicRive src={riveUrls[current]} onRiveEvent={e => onRiveEvent?.({ name: e.name, index: current })} />
        </motion.div>
        </AnimatePresence>

      <div style={{
        position: "absolute", bottom: 8, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 8
      }}>
        <button onClick={prev}>◀ Prev</button>
        <button onClick={next}>Next ▶</button>
      </div>
    </div>
  );
};
