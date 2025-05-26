import { useRef, useEffect, useLayoutEffect, useState } from "react";
import { Rive, Layout, Fit, Alignment } from "@rive-app/canvas";
import { useGlobalContext } from "../tools/GlobalProvider";
import { FishCatchData } from "../types";
import ReactHowler from "react-howler";
import { Howler } from "howler";

export interface ClubViewProps {
  onNext: () => void;
}

export default function ClubView({ onNext }: ClubViewProps) {
  const { ADDRESS } = useGlobalContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveRef = useRef<Rive>();

  const [currentCatchIndex, setCurrentCatchIndex] = useState(0);
  const [fishCatches, setFishCatches] = useState<FishCatchData[]>([]);
  const [isMinting, setIsMinting] = useState(false);
  const [clubMusicVolume, setClubMusicVolume] = useState(0);
  const [clubMusicReady, setClubMusicReady] = useState(false);

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

  const loadCatches = async () => {
    if (!ADDRESS) return;
    try {
      const res = await fetch(`https://sui-game.onrender.com/fish-catches/${ADDRESS}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FishCatchData[] = await res.json();
      console.log("Reloaded fishCatches via trigger:", data);
      setFishCatches(data);
      // reset index if out of bounds
      setCurrentCatchIndex(ci => Math.min(ci, data.length - 1));
    } catch (e) {
      console.error("Failed to reload fish catches:", e);
    }
  };

  useEffect(() => {
    console.log("fishCatches: ", fishCatches);
    const vmi = riveRef.current?.viewModelInstance;
    if (!vmi) return;

    const catchesTotal = vmi?.number("CatchesTotal");
    if (catchesTotal) {
      catchesTotal.value = fishCatches.length;
      if (fishCatches.length > 0) updateCatch();
    }
  }, [fishCatches]);

  useEffect(() => {
    console.log("currentCatchIndex: ", currentCatchIndex);
    updateCatch();
  }, [currentCatchIndex]);

  useEffect(() => {
    const instance = riveRef.current;
    const vmi = instance?.viewModelInstance;
    if (!vmi) return;

    const lClickTrigger = vmi.trigger("LeftCatch");
    lClickTrigger?.on(() => setCurrentCatchIndex(prev => Math.max(0, prev - 1)));

    const rClickTrigger = vmi.trigger("RightCatch");
    rClickTrigger?.on(() => setCurrentCatchIndex(prev => Math.min(fishCatches.length - 1, prev + 1)));

    const mintTrigger = vmi.trigger("Mint");
    mintTrigger?.on(() => mintCaughtFish(currentCatchIndex));

    const catchesTrigger = vmi.trigger("Catches");
    catchesTrigger?.on(() => {
      console.log("catchesTrigger");
    });

    return () => {
      lClickTrigger?.off();
      rClickTrigger?.off();
      mintTrigger?.off();
    };
  }, [fishCatches.length, currentCatchIndex]);

  const updateCatch = () => {
    if (!fishCatches.length || currentCatchIndex < 0 || currentCatchIndex >= fishCatches.length) return;

    const vmi = riveRef.current?.viewModelInstance;
    if (!vmi) return;

    const catchName = vmi?.string("CatchName");
    if (catchName) catchName.value = fishCatches[currentCatchIndex].type;

    riveRef.current?.setTextRunValueAtPath("fish_name_lbl", fishCatches[currentCatchIndex].type, "Catches_AB");
    riveRef.current?.setTextRunValueAtPath(
      "fish_info_lbl",
      `${fishCatches[currentCatchIndex].weight} lbs ${fishCatches[currentCatchIndex].length} in`,
      "Catches_AB"
    );
  };

  const mintCaughtFish = async (indexToMint: number) => {
    if (!ADDRESS || indexToMint < 0 || indexToMint >= fishCatches.length || fishCatches[indexToMint].minted) return;

    setIsMinting(true);
    try {
      const res = await fetch("https://sui-game.onrender.com/mint-caught-fish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: ADDRESS, index: indexToMint }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Mint failed:", data.error);
        return;
      }

      setFishCatches(prev => {
        const updated = [...prev];
        updated[indexToMint] = { ...updated[indexToMint], minted: true };
        return updated;
      });

    } catch (err: any) {
      console.error("Mint error:", err.message);
    } finally {
      setIsMinting(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rive = new Rive({
      src: "/dfc_club.riv",
      canvas,
      autoplay: true,
      artboard: "Main_AB",
      stateMachines: ["Main_SM"],
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.TopCenter }),
      autoBind: true,
      onLoad: () => {
        const vmi = riveRef.current?.viewModelInstance;
        const playGameTrigger = vmi?.trigger("PlayGame");
        playGameTrigger?.on(() => onNext());
        rive.resizeDrawingSurfaceToCanvas();
      },
    });

    riveRef.current = rive;
    return () => rive.cleanup();
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
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

  // Fade music logic
  useEffect(() => {
    Howler.volume(0.8);
    setTimeout(() => {
      setClubMusicReady(true);
      setTimeout(() => setClubMusicVolume(0.8), 100);
    }, 2000);
    return () => {
      Howler.volume(0);
    };
  }, []);

  return (
    <>
      {isMinting && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 1000
        }}>
          Minting your fish...
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
      {clubMusicReady && (
        <ReactHowler
          src="https://walrus.tusky.io/MzUbX3bn_GBsArWCB2jELlJwdJwl-LUpOAjNkMizDOo"
          playing={true}
          loop={true}
          volume={clubMusicVolume}
        />
      )}
    </>
  );
}
