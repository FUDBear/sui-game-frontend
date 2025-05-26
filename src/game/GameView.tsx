import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import { SingleRiveSwitcher } from "./SingleRiveSwitcher";

const GameView = forwardRef<HTMLDivElement>((_, ref) => {

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => containerRef.current!);

  useEffect(() => {
    console.log("🔥 THIS IS THE LATEST BUILD 🔥");
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      
      {/* Connect */}
      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
        <ConnectButton />
      </div>


      {/* Rive UI */}
      <SingleRiveSwitcher
        index={currentIndex}
        onIndexChange={setCurrentIndex}
      />

      
    </div>
  );
});

export default GameView;
