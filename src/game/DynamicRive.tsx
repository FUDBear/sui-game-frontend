import React, { useLayoutEffect, useEffect, useRef } from "react";
import { Alignment, Fit, Layout, Rive, StateMachineInputType } from "@rive-app/canvas";

export interface DynamicRiveProps {
  src: string;
  cardIndex?: number;
  onRiveEvent?: (e: { name: string }) => void;
}

const DynamicRive: React.FC<DynamicRiveProps> = ({ src, onRiveEvent, cardIndex }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveRef = useRef<any>(null);

  const randCardIndex = ( vm: any, value: number ) => {
    const card = vm?.number("card_" + value + "_index");
    card.value = Math.floor(Math.random() * 14);
  }

  // ← Insert your high-DPI resize observer here
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
      // if the Rive instance exposes resize…
      riveRef.current?.resizeDrawingSurfaceToCanvas?.();
    };

    // run once immediately
    resize();
    // watch for container size changes
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    return () => ro.disconnect();
  }, [src, cardIndex]);

  // ← Then your existing effect that creates/cleans up the Rive instance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const r = new Rive({
      src,
      canvas,
      autoplay: true,
      artboard: "Main_AB",
      stateMachines: ["Main_SM"],
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.TopCenter,
      }),
      autoBind: true,
      onLoad: () => {
        let vmi = riveRef.current?.viewModelInstance;
        const properties = vmi?.properties;
        console.log(properties);

        let clickIndex = vmi?.number("click_index");
        if (!clickIndex) {
          console.warn("No property named 'click_index' in Main_VM");
          return;
        } else {
          console.log("Found property", clickIndex.name);
        }

        clickIndex.on((value: any) => {
          console.log("Index!", value);
          // randCardIndex(vmi, value);
        });
        

        const clickTrigger = vmi?.trigger("click");
        if (!clickTrigger) {
          console.warn("No trigger named 'click' in Main_VM");
          return;
        } else {
          console.log("Found trigger", clickTrigger.name);
        }

        clickTrigger.on((value: any) => {
          console.log("Trigger fired!");

          randCardIndex( vmi, clickIndex.value );
        });

        
      },
      onStateChange: (ctx) => {
        // handle events…
      },
    });
    riveRef.current = r;
    return () => r.cleanup();
  }, [src, cardIndex]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
};

export default DynamicRive;
