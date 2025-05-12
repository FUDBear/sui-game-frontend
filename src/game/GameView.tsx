import React, { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { MintNFT } from "../tools/SUITools";
import { SingleRiveSwitcher, RiveEventWithIndex } from "./SingleRiveSwitcher";

const GameView = forwardRef<HTMLDivElement>((_, ref) => {
  const account = useCurrentAccount();
  const signAndExecute = useSignAndExecuteTransaction();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRiveEvent = ({ name, index }: RiveEventWithIndex) => {
    console.log(`Rive event fired on animation #${index}:`, name);

    switch (name) {
      case "click_1":
        setCurrentIndex(0);
        break;
      case "click_2":
        setCurrentIndex(1);
        break;
      case "click_3":
      case "PlayGame":
        setCurrentIndex(2);
        break;
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => containerRef.current!);

  return (
    <div ref={containerRef}>
      <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
        <ConnectButton />
      </div>

      <SingleRiveSwitcher
        index={currentIndex}
        onIndexChange={setCurrentIndex}
        onRiveEvent={handleRiveEvent}
        cardIndex={currentIndex}
      />
    </div>
  );
});

export default GameView;