import { useRef, useEffect, useLayoutEffect } from "react";
import { Rive, Layout, Fit, Alignment } from "@rive-app/canvas";
import { useGlobalContext } from "../tools/GlobalProvider";

export interface ClubViewProps {
    onNext: () => void;
  }

export default function ClubView({ onNext }: ClubViewProps) {

    const { ADDRESS } = useGlobalContext();
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const riveRef   = useRef<Rive>();

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width  = width * dpr;
        canvas.height = height * dpr;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.scale(dpr, dpr);
        riveRef.current?.resizeDrawingSurfaceToCanvas?.();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas.parentElement!);
        return () => ro.disconnect();
    }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rive = new Rive({
      src: "/dfc_club.riv",
      canvas,
      autoplay: true,
      artboard: "Main_AB",
      stateMachines: ["Main_SM"],
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.TopCenter,
      }),
      autoBind: true,
      onLoad: (instance) => {

        let vmi = riveRef.current?.viewModelInstance;
        if (!vmi) {
          console.log("No view model instance available in onLoad");
          return;
        }

        const properties = vmi?.properties;
        console.log(properties);

        const playGameTrigger = vmi?.trigger("PlayGame");
        if (!playGameTrigger) {
          console.warn("No trigger named 'PlayGame' in Main_VM");
          return;
        } else {
          console.log("Found trigger", playGameTrigger.name);
        }

        playGameTrigger.on(() => {
          console.log("PlayGame trigger fired!");

          onNext();
        });

      },
    });

    riveRef.current = rive;
    return () => rive.cleanup();
  }, []);

  return (
    <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
  );
}
