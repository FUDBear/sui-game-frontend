import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  useRive,
  EventType,
  RiveEventType,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { MintNFT } from "../tools/SUITools";

const GameView = forwardRef<HTMLDivElement>((_, ref) => {
  const account = useCurrentAccount();
  const signAndExecute = useSignAndExecuteTransaction();

  const containerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => containerRef.current!);

  const {
    setCanvasRef,
    setContainerRef,
    rive,
  } = useRive(
    {
      src: "https://arweave.net/kYSz9S1bRTvd06rcq-DaomljhwV_pBFeeRa2BJfF974",
      artboard: "Artboard",
      stateMachines: "State Machine 1",
      autoplay: true,
      layout: new Layout({
        fit: Fit.FitWidth,
        alignment: Alignment.TopCenter,
      }),
      onLoad: () => console.log("Rive loaded!"),
      onPlay: () => console.log("Animation is playing.."),
    },
    {
      shouldResizeCanvasToContainer: true,
    }
  );

  useEffect(() => {
    if (rive) rive.on(EventType.RiveEvent, onRiveEventReceived);
    return () => {
      if (rive) rive.off(EventType.RiveEvent, onRiveEventReceived);
    };
  }, [rive]);

  const onRiveEventReceived = (e: any) => {
    if (e.data.type === RiveEventType.General) {
      console.log("Event name", e.data.name);
      // now your MintNFT helper can be called safely
      MintNFT(account, signAndExecute, "https://i.imgur.com/UEozkJd.jpeg");
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundColor: "black",
        margin: 0,
        padding: 0,
      }}
    > 
      <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
        <ConnectButton />
      </div>
      {/* attach the rive container and canvas refs here */}
      <div ref={setContainerRef} style={{ width: "100%", height: "100%" }}>
        <canvas ref={setCanvasRef} style={{ width: "100%", height: "100%" }} />
      </div>
      {/* you can still use <RiveComponent /> if you prefer:
          <RiveComponent />
      */}
    </div>
  );
});

export default GameView;
