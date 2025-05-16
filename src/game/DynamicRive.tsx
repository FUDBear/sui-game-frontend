import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import { Alignment, Fit, Layout, Rive, StateMachineInputType } from "@rive-app/canvas";
import { useGlobalContext } from "../tools/GlobalProvider";

export interface DynamicRiveProps {
  src: string;
  cardIndex?: number;
  timeNormalized?: number;
  onRiveEvent?: (e: { name: string }) => void;
}

const DynamicRive: React.FC<DynamicRiveProps> = ({ src, onRiveEvent, cardIndex, timeNormalized }) => {

  const { PLAYER_DATA, setPLAYER_DATA, gameState, currentHour } = useGlobalContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveRef = useRef<any>(null);
  const rafRef = useRef<number>();

  const startTimeAnimation = (vmi: any) => {
    if (!vmi) {
      console.log("No view model instance available");
      return;
    }

    const timeInput = vmi.number("game_time");
    if (!timeInput) {
      console.log("No game_time property found in view model");
      return;
    }
  
    const HOURS = 24;
    const duration = 20_000;              // 20 seconds
    const startValue = (currentHour % HOURS) * 100;
    const endValue   = ((currentHour + 1) % HOURS) * 100;
    const t0 = performance.now();
  
    // jump immediately to the start value
    timeInput.value = startValue;
  
    // animation loop
    const step = (now: number) => {
      const elapsed = now - t0;
      const frac = Math.min(elapsed / duration, 1);
      timeInput.value = startValue + (endValue - startValue) * frac;
      if (frac < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
  
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const vmi = riveRef.current?.viewModelInstance;
    if (!vmi) return;
    
    startTimeAnimation(vmi);
    
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [currentHour]);

  // useEffect(() => {
  //   console.log("Time normalized:", timeNormalized);
  //   const vmi = riveRef.current?.viewModelInstance;
  //   if (vmi) {
  //     console.log( "We have reference to the view model instance" );
  //     const currentTime = vmi.number("game_time").value;
  //     vmi.number("game_time").value = currentTime + 1;
  //   } else {
  //     console.log("No view model instance found");
  //   }

  // }, [currentHour]);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     const vmi = riveRef.current?.viewModelInstance;
  //     if (vmi) {
  //       const currentTime = vmi.number("game_time").value;
  //       vmi.number("game_time").value = currentTime + 1;
  //     }
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);

  const setCardIndex = ( vm: any, cardIndex: number ) => {
    
    // Get the clicked cards selected index
    const card = vm?.number("card_" + cardIndex + "_index");
    console.log( "card: ", cardIndex, "card value: ", card.value);

    // Toggle the selected card
    const selected = vm?.boolean("card_" + cardIndex + "_selected");
    if( selected ) {
      // Toggle the selection state
      selected.value = !selected.value;
      
      // Update PLAYER_DATA using functional update to ensure we have latest state
      setPLAYER_DATA(prevData => {
        const newSelectedCards = [...prevData.selectedCards];
        newSelectedCards[cardIndex] = selected.value ? card.value : -1;
        
        console.log('Previous cards:', prevData.selectedCards);
        console.log('New cards:', newSelectedCards);
        console.log('Card index:', cardIndex);
        console.log('Is selected:', selected.value);
        console.log('Card value:', card.value);
        
        return {
          ...prevData,
          selectedCards: newSelectedCards,
        };
      });
    }
  }

  // const setEvent = ( vm: any, index: number ) => {
    
   
  //   // Toggle the selected card
  //   const eventIndex = vm?.number("event_index");
  //   if( selected ) {
  //     // Toggle the selection state
  //     selected.value = !selected.value;
      
  //     // Update PLAYER_DATA using functional update to ensure we have latest state
  //     setPLAYER_DATA(prevData => {
  //       const newSelectedCards = [...prevData.selectedCards];
  //       newSelectedCards[cardIndex] = selected.value ? card.value : -1;
        
  //       console.log('Previous cards:', prevData.selectedCards);
  //       console.log('New cards:', newSelectedCards);
  //       console.log('Card index:', cardIndex);
  //       console.log('Is selected:', selected.value);
  //       console.log('Card value:', card.value);
        
  //       return {
  //         ...prevData,
  //         selectedCards: newSelectedCards,
  //       };
  //     });
  //   }
  // }

  useLayoutEffect(() => {
    const vmi = riveRef.current?.viewModelInstance;
    if (!vmi) {
      console.log("No view model instance available");
      return;
    } else {

      switch( gameState?.event ) {
        case null:
          vmi.number("event_index").value = 0;
          break;
        case "none":
          vmi.number("event_index").value = 0;
          break;
        case "blood":
          vmi.number("event_index").value = 1;
          break;
        case "frozen":
          vmi.number("event_index").value = 2;
          break;
        case "toxic":
          vmi.number("event_index").value = 3;
          break;
        case "nightmare":
          vmi.number("event_index").value = 4;
          break;
      }
      
      console.log("Setting event index to: ", gameState?.event );
      console.log("Event index set to: ", vmi.number("event_index").value);
    }

  }, [gameState?.event]);

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
        if (!vmi) {
          console.log("No view model instance available in onLoad");
          return;
        }

        const properties = vmi?.properties;
        console.log(properties);

        // Start the time animation
        startTimeAnimation(vmi);

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

          setCardIndex( vmi, clickIndex.value );
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
