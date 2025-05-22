import { useRef, useEffect, useLayoutEffect, useState } from "react";
import { Rive, Layout, Fit, Alignment } from "@rive-app/canvas";
import { useGlobalContext } from "../tools/GlobalProvider";
import { FishCatchData } from "../types";

export interface ClubViewProps {
    onNext: () => void;
  }


export default function ClubView({ onNext }: ClubViewProps) {

    const { ADDRESS } = useGlobalContext();
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const riveRef   = useRef<Rive>();

    const [currentCatchIndex, setCurrentCatchIndex] = useState(0);
    const [fishCatches, setFishCatches] = useState<FishCatchData[]>([]);

    // fetch all catches when ADDRESS becomes available
    useEffect(() => {
        if (!ADDRESS) return;

        fetch(`https://sui-game.onrender.com/fish-catches/${ADDRESS}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then((data: FishCatchData[]) => {
            console.log("Loaded fishCatches:", data);
            setFishCatches(data);
        })
        .catch(err => console.error("Failed to fetch fish catches:", err));
    }, [ADDRESS]);

    useEffect(() => {
        console.log("fishCatches: ", fishCatches);

        let vmi = riveRef.current?.viewModelInstance;
        if (!vmi) {
          console.log("No view model instance available in onLoad");
          return;
        }

        let catchesTotal = vmi?.number("CatchesTotal");
        if (!catchesTotal) {
          console.warn("No property named 'CatchesTotal' in Main_VM");
          return;
        } else {
          console.log("Found property", catchesTotal.name);
          catchesTotal.value = fishCatches.length;

          if( fishCatches.length > 0 ) {
            updateCatch();
          }
        }

    }, [fishCatches]);

    useEffect(() => {
        console.log("currentCatchIndex: ", currentCatchIndex);
        updateCatch();
    }, [currentCatchIndex]);


    const updateCatch = () => {
        if (!fishCatches.length || currentCatchIndex < 0 || currentCatchIndex >= fishCatches.length) {
            return;
        }

        console.log("fishCatches at " + currentCatchIndex + ": ", fishCatches[currentCatchIndex]);

        const instance = riveRef.current;
        const vmi      = instance?.viewModelInstance;

        let catchName = vmi?.string("CatchName");
        if (!catchName) {
          console.warn("No property named 'CatchName' in Main_VM");
          return;
        } else {
          console.log("Found property", catchName.name);
        }

        // CatchImage
        catchName.value = fishCatches[currentCatchIndex].type;

        // CatchName
        console.log( "FishName: " +fishCatches[currentCatchIndex].type );
        riveRef.current?.setTextRunValueAtPath("fish_name_lbl", 
            fishCatches[currentCatchIndex].type, "Catches_AB" );

        // CatchInfo
        riveRef.current?.setTextRunValueAtPath(
            "fish_info_lbl", fishCatches[currentCatchIndex].weight + " lbs"
             + " " + fishCatches[currentCatchIndex].length + " in", "Catches_AB" );
    }

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

  // Separate useEffect for trigger setup
  useEffect(() => {
    const instance = riveRef.current;
    const vmi = instance?.viewModelInstance;
    if (!vmi) return;

    // L Click Trigger
    const lClickTrigger = vmi.trigger("LeftCatch");
    if (!lClickTrigger) {
      console.warn("No trigger named 'LClick' in Main_VM");
      return;
    } else {
      console.log("Found trigger", lClickTrigger.name);
    }

    lClickTrigger.on(() => {
      console.log("LClick trigger fired!");
      setCurrentCatchIndex(prev => Math.max(0, prev - 1));
    });

    // R Click Trigger
    const rClickTrigger = vmi.trigger("RightCatch");
    if (!rClickTrigger) {
      console.warn("No trigger named 'RClick' in Main_VM");
      return;
    } else {
      console.log("Found trigger", rClickTrigger.name); 
    }

    rClickTrigger.on(() => {
      console.log("RClick trigger fired!");
      setCurrentCatchIndex(prev => Math.min(fishCatches.length - 1, prev + 1));
    });

    return () => {
        lClickTrigger.off();
        rClickTrigger.off();
    };
  }, [fishCatches.length]); // Only recreate when fishCatches length changes

  return (
    <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
  );
}
