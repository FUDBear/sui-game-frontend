import React, { useEffect } from "react";
import {
  useRive,
  EventType,
  RiveEventType,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";

export interface DynamicRiveProps {
  src: string;
  onRiveEvent?: (e: { name: string }) => void;
}

const DynamicRive: React.FC<DynamicRiveProps> = ({ src, onRiveEvent }) => {
  const { setCanvasRef, setContainerRef, rive } = useRive(
    {
      src,
      artboard: "Artboard",
      stateMachines: "State Machine 1",
      autoplay: true,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.TopCenter,
      }),
      onLoad: () => console.log("Rive loaded:", src),
      onPlay: () => console.log("Rive playing:", src),
    },
    { shouldResizeCanvasToContainer: true }
  );

  useEffect(() => {
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

export default DynamicRive;
