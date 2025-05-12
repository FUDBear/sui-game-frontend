import React, { useLayoutEffect, useEffect, useRef } from "react";
import { Alignment, Fit, Layout, Rive, StateMachineInputType } from "@rive-app/canvas";
import { useGlobalContext } from "../tools/GlobalProvider";

export interface DynamicRiveProps {
  src: string;
  cardIndex?: number;
  onRiveEvent?: (e: { name: string }) => void;
}

const DynamicRive: React.FC<DynamicRiveProps> = ({ src, onRiveEvent, cardIndex }) => {

  const { PLAYER_DATA, setPLAYER_DATA } = useGlobalContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveRef = useRef<any>(null);

  const randCardIndex = ( vm: any, cardIndex: number ) => {
    console.log("card: ", cardIndex);

    // Get the clicked cards selceted index
    const card = vm?.number("card_" + cardIndex + "_index");
    console.log("card: ", card.value);

    const selected = vm?.boolean("card_" + cardIndex + "_selected");
    if( selected ) {
      console.log("Before selected: ", selected.value);
      selected.value = !selected.value;
      console.log("After selected: ", selected.value);
    }
    
    setPLAYER_DATA({
      ...PLAYER_DATA,
      selectedCards: PLAYER_DATA.selectedCards.map((val, i) => 
        i === cardIndex ? card.value : val
      ),
    });
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
  }, [src, cardIndex]);

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

        // Randomize the cards
        const card1 = vmi?.number("card_0_index");
        if( card1 ) {
          card1.value = Math.floor(Math.random() * 14);
        }
        const card2 = vmi?.number("card_1_index");
        if( card2 ) {
          card2.value = Math.floor(Math.random() * 14);
        }
        const card3 = vmi?.number("card_2_index");
        if( card3 ) {
          card3.value = Math.floor(Math.random() * 14);
        }

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
      },
    });
    riveRef.current = r;
    return () => r.cleanup();
  }, [src, cardIndex]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
};

export default DynamicRive;
