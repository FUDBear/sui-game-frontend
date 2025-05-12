// src/game/SingleRiveSwitcher.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useRive,
  EventType,
  RiveEventType,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";

export const riveUrls = [
  "https://walrus.tusky.io/F2TKOpWVCphPPhjAlcFjxreRxMfPGuOk_hcf_NBqOyA",
  "https://walrus.tusky.io/0wEkXukCixZc57RZjOiS8SDFZ-Q656Zi7q0y96ZY8Nw",
  "/dfc_intro.riv",
  "/df_test.riv",
];

export type RiveEventWithIndex = { name: string; index: number };

interface SingleRiveSwitcherProps {
  index: number;
  onIndexChange: (i: number) => void;
  onRiveEvent?: (e: RiveEventWithIndex) => void;
}

export const SingleRiveSwitcher: React.FC<SingleRiveSwitcherProps> = ({
  index,
  onIndexChange,
  onRiveEvent,
}) => {
  const prev = () => onIndexChange((index - 1 + riveUrls.length) % riveUrls.length);
  const next = () => onIndexChange((index + 1) % riveUrls.length);

  return (
    <div>
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

interface DynamicRiveProps {
  src: string;
  onRiveEvent?: (e: { name: string }) => void;
}

const DynamicRive: React.FC<DynamicRiveProps> = ({ src, onRiveEvent }) => {
  const { setCanvasRef, setContainerRef, rive } = useRive(
    {
      src,
      artboard: "Main_AB",
      stateMachines: "Main_SM",
      autoplay: true,
      layout: new Layout({ fit: Fit.FitWidth, alignment: Alignment.TopCenter }),
      onLoad: () => console.log("Rive loaded:", src),
      onPlay: () => console.log("Rive playing:", src),
    },
    { shouldResizeCanvasToContainer: true }
  );

  React.useEffect(() => {
    if (!rive || !onRiveEvent) return;
    const handler = (e: any) => {
      if (e.data.type === RiveEventType.General) {
        onRiveEvent({ name: e.data.name });
      }
    };
    rive.on(EventType.RiveEvent, handler);
    return () => void rive.off(EventType.RiveEvent, handler);
  }, [rive, onRiveEvent]);

  return (
    <div ref={setContainerRef} style={{ width: "100%", height: "100%" }}>
      <canvas ref={setCanvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};
