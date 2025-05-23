import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Rive, Layout, Fit, Alignment } from "@rive-app/canvas";
import { useGlobalContext } from "../tools/GlobalProvider";

export interface IntroViewProps {
    onNext: () => void;
  }

export default function IntroView({ onNext }: IntroViewProps) {

    const { ADDRESS } = useGlobalContext();
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const riveRef   = useRef<Rive>();


    const initPlayer = async () => {
        if (!ADDRESS && ADDRESS !== "disconnected") {
          console.warn("Can't init: no ADDRESS");
          onNext();     // still advance if you like
          return;
        }
    
        try {
          const res = await fetch("https://sui-game.onrender.com/player/init", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerId: ADDRESS }),
          });
          const json = await res.json();
          if (!res.ok) {
            throw new Error(json.error || "Init failed");
          }
          console.log("Player init success:", json);
    
          // Optionally set your VM's `connected` input to true
          const vmi = riveRef.current?.viewModelInstance;
          const connected = vmi?.boolean("connected");
          if (connected) {
            connected.value = true;
          }
        } catch (err) {
          console.error("initPlayer error:", err);
        } finally {
          // only after attempt (success or failure) do we advance
          onNext();
        }
      };

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
      src: "/dfc_intro.riv",
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
        
        // PlayGame trigger
        const playGameTrigger = vmi?.trigger("play_game");
        if (!playGameTrigger) {
          console.warn("No trigger named 'play_game' in Main_VM");
          return;
        } else {
          console.log("Found trigger", playGameTrigger.name);
        }

        playGameTrigger.on(() => {
          console.log("PlayGame trigger fired!");

          // Call init player endpoint here
          initPlayer();

          // tell the SingleRiveSwitcher to switch to the FishingView
          onNext();
        });

        let connected = vmi?.boolean("connected");
        if (!connected) {
          console.warn("No property named 'connected' in Main_VM");
          return;
        } else {
          console.log("Found property", connected.name);

          if( ADDRESS && ADDRESS !== "disconnected" ) {
            connected.value = true;
          } else {
            connected.value = false;
          }
        }
      },
    });

    riveRef.current = rive;
    return () => rive.cleanup();
  }, []);

  useEffect(() => {

    console.log("ADDRESS: ", ADDRESS);

    let vmi = riveRef.current?.viewModelInstance;
    if (!vmi) {
        console.log("No view model instance available in onLoad");
        return;
    }

        let connected = vmi?.boolean("connected");
        if (!connected) {
          console.warn("No property named 'connected' in Main_VM");
          return;
        } else {
          console.log("Found property", connected.name);

          if( ADDRESS !== "disconnected" ) {
            connected.value = true;
          } else {
            connected.value = false;
          }
        }
    
  }, [ADDRESS]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </>
  );
  
}
