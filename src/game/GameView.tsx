// src/game/GameView.tsx
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { EventType, RiveEventType } from "@rive-app/react-canvas";
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { MintNFT } from "../tools/SUITools";
import { SingleRiveSwitcher, RiveEventWithIndex } from "./SingleRiveSwitcher";

const GameView = forwardRef<HTMLDivElement>((_, ref) => {
  const account = useCurrentAccount();
  const signAndExecute = useSignAndExecuteTransaction();

  // ← this is our new “lifted” state
  const [currentIndex, setCurrentIndex] = useState(0);

  // when a Rive event fires from within SingleRiveSwitcher...
  const handleRiveEvent = ({ name, index }: RiveEventWithIndex) => {
    console.log(`Rive event fired on animation #${index}:`, name);
    
    // MintNFT(account, signAndExecute, "https://i.imgur.com/UEozkJd.jpeg");
    // setCurrentIndex((prev) => (prev + 1) % 3);

    switch (name) {
      case "click_1":
        setCurrentIndex(0);
        break;
      case "click_2":
        setCurrentIndex(1);
        break;
      case "click_3":
        setCurrentIndex(2);
        break;
      case "PlayGame":
        setCurrentIndex(1);
        break;
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => containerRef.current!);

  return (
    <div
      
    >
      <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
        <ConnectButton />
      </div>

      {/* pass both the controlled index and your handler */}
      <SingleRiveSwitcher
        index={currentIndex}
        onIndexChange={setCurrentIndex}
        onRiveEvent={handleRiveEvent}
      />
    </div>
  );
});

export default GameView;
