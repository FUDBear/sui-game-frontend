// src/game/FishingView.tsx
import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import { Rive, Layout, Fit, Alignment } from "@rive-app/canvas";
import { useGlobalContext } from "../tools/GlobalProvider";
import { Catch } from "../types";

// Helper function to convert number to Roman numeral
const toRomanNumeral = (num: number): string => {
  if (num === 0) return "0";
  
  const romanNumerals: [number, string][] = [
    [20, 'XX'],
    [19, 'XIX'],
    [18, 'XVIII'],
    [17, 'XVII'],
    [16, 'XVI'],
    [15, 'XV'],
    [14, 'XIV'],
    [13, 'XIII'],
    [12, 'XII'],
    [11, 'XI'],
    [10, 'X'],
    [9, 'IX'],
    [8, 'VIII'],
    [7, 'VII'],
    [6, 'VI'],
    [5, 'V'],
    [4, 'IV'],
    [3, 'III'],
    [2, 'II'],
    [1, 'I']
  ];

  let result = '';
  for (const [value, symbol] of romanNumerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
};

export interface FishingViewProps {
  onPrevious: () => void;
}

export default function FishingView({ onPrevious }: FishingViewProps) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveRef   = useRef<Rive>();
  const { ADDRESS, PLAYER_DATA, setPLAYER_DATA, gameState, currentHour } = useGlobalContext();
  const rafRef = useRef<number>();
  const currentHandRef = useRef<number[]>([-1, -1, -1]);

  const [hand, setHand] = useState<number[]>([-1, -1, -1]);
  const [lastCatch, setLastCatch] = useState<Catch | null>(null);


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
      src: "/dfc_maingame.riv",
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

        riveRef.current = rive;
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
        // const card1 = vmi?.number("card_0_index");
        // if( card1 ) {
        //   card1.value = Math.floor(Math.random() * 14);
        // }
        // const card2 = vmi?.number("card_1_index");
        // if( card2 ) {
        //   card2.value = Math.floor(Math.random() * 14);
        // }
        // const card3 = vmi?.number("card_2_index");
        // if( card3 ) {
        //   card3.value = Math.floor(Math.random() * 14);
        // }

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

        // Card trigger
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

        // Cast trigger
        const castTrigger = vmi?.trigger("cast");
        if (!castTrigger) {
          console.warn("No trigger named 'cast' in Main_VM");
          return;
        } else {
          console.log("Found trigger", castTrigger.name);
        }

        castTrigger.on((value: any) => {
            playerCast();
        });

        // Claim trigger
        const claimTrigger = vmi?.trigger("claim");
        if (!claimTrigger) {
          console.warn("No trigger named 'claim' in Main_VM");
          return;
        } else {
          console.log("Found trigger", claimTrigger.name);
        }

        claimTrigger.on((value: any) => {
          handleClaim();
        });

        // Club trigger
        const clubTrigger = vmi?.trigger("club_trigger");
        if (!clubTrigger) {
          console.warn("No trigger named 'club_trigger' in Main_VM");
          return;
        } else {
          console.log("Found trigger", clubTrigger.name);
        }

        clubTrigger.on((value: any) => {
            console.log("Club trigger fired!");
            onPrevious();
        });
      },
    });

    riveRef.current = rive;
    return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rive.cleanup();
      };
  }, []);

    useEffect(() => {
        const vmi = riveRef.current?.viewModelInstance;
        if (!vmi) return;
        
        startTimeAnimation(vmi);
        
        return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [currentHour]);

    // PLayer State
    useEffect(() => {
        const vmi = riveRef.current?.viewModelInstance;
        if (!vmi) return;
        
        // Change player state
        const fishermanState = vmi?.number("fisherman_state");
        if (!fishermanState) {
            console.warn("No property named 'fisherman_state' in Main_VM");
            return;
        } else {
            fishermanState.value = PLAYER_DATA.state;
        }
    }, [PLAYER_DATA]);

    useEffect(() => {
        const vmi = riveRef.current?.viewModelInstance;
        if (!vmi) return;
        

        console.log("PLAYER_DATA: ", PLAYER_DATA);

        // Change player state
        const fishermanState = vmi?.number("fisherman_state");
        if (!fishermanState) {
            console.warn("No property named 'fisherman_state' in Main_VM");
            return;
        } else {
            // console.log("Found property", fishermanState.name);
            fishermanState.value = PLAYER_DATA.state;
        }

        // Chanfge catch
        if( PLAYER_DATA.catch !== null ) {
            const catchName = vmi?.string("catch_name");
            if (!catchName) {
                console.warn("No property named 'catch_name' in Main_VM");
                return;
            } else {
                console.log("Found property", catchName.value);

                if( PLAYER_DATA.catch ) {
                    console.log( "PLAYER_DATA.catch: ", PLAYER_DATA.catch );

                    if( PLAYER_DATA.catch.type) {
                        console.log("PLAYER_DATA.catch.type: ", PLAYER_DATA.catch.type);
                        const name = "" + PLAYER_DATA.catch.type;
                        catchName.value = name;
                    }
                }
            }

            console.log( "catchName: ", vmi?.string("catch_name")?.value );
        }

        
        
    }, [PLAYER_DATA]);

    useEffect(() => {
        // console.log("PLAYER_DATA: ", PLAYER_DATA);

        const vmi = riveRef.current?.viewModelInstance;
        if (!vmi) return;

        for (let i = 0; i < 3; i++) {
            const cardIndex = vmi?.number("card_" + i + "_index");
            if (!cardIndex) {
                console.warn("No property named 'card_" + i + "_index' in Main_VM");
                return;
            } else {
                if( PLAYER_DATA.hand[i] !== -1 ) {
                    cardIndex.value = PLAYER_DATA.hand[i];
                } 
            }
        }

        // Cards left in deck
        riveRef.current?.setTextRunValue("deck_text", toRomanNumeral(PLAYER_DATA.deck.length));

    }, [PLAYER_DATA]);

    

    useLayoutEffect(() => {
    const vmi = riveRef.current?.viewModelInstance;
    const eventIndex = vmi?.number("event_index");
    if (!vmi || !eventIndex) {
      console.log("No view model instance available");
      return;
    } else {

      switch( gameState?.event ) {
        case null:
          eventIndex.value = 0;
          break;
        case "none":
          eventIndex.value = 0;
          break;
        case "blood":
          eventIndex.value = 1;
          break;
        case "frozen":
          eventIndex.value = 2;
          break;
        case "toxic":
          eventIndex.value = 3;
          break;
        case "nightmare":
          eventIndex.value = 4;
          break;
      }
      
      console.log("Setting event index to: ", gameState?.event );
      console.log("Event index set to: ", eventIndex.value);
    }

  }, [gameState?.event]);

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

  const setCardIndex = ( vm: any, cardIndex: number ) => {

    console.log("setCardIndex: ", cardIndex);
    
    // Get the clicked cards selected index
    const card = vm?.number("card_" + cardIndex + "_index");
    console.log( "card: ", cardIndex, "card value: ", card.value);

    // Toggle the selected card
    const selected = vm?.boolean("card_" + cardIndex + "_selected");
    if( selected ) {
      // Toggle the selection state
      selected.value = !selected.value;

      

      setHand(prevHand => {
        const newHand = [...prevHand];
        newHand[cardIndex] = selected.value ? card.value : -1;
        console.log("newHand: ", newHand);
        currentHandRef.current = newHand;  // Update the ref with the new hand
        return newHand;
      });

      
      // Update PLAYER_DATA using functional update to ensure we have latest state
    //   setPLAYER_DATA(prevData => {
    //     const newSelectedCards = [...prevData.selectedCards];
    //     newSelectedCards[cardIndex] = selected.value ? card.value : -1;
        
    //     console.log('Previous cards:', prevData.selectedCards);
    //     console.log('New cards:', newSelectedCards);
    //     console.log('Card index:', cardIndex);
    //     console.log('Is selected:', selected.value);
    //     console.log('Card value:', card.value);
        
    //     return {
    //       ...prevData,
    //       selectedCards: newSelectedCards,
    //     };
    //   });
    }
  }

//   useEffect(() => {
//     console.log("hand: ", hand);
//   }, [hand]);

  const playerCast = async () => {

    if (!ADDRESS) {
        console.log("No player address set");
        return;
      }

      console.log("Player cast! ", currentHandRef.current);

      try {
        const res = await fetch("https://sui-game.onrender.com/playercast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId: ADDRESS,
            cast: currentHandRef.current,
          }),
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          console.error("Server error:", res.status, errorData);
          return;
        }

        const data = await res.json();
        console.log("Cast successful:", data);

        // Clear the selected cards
        setHand([-1, -1, -1]);

        const vmi = riveRef.current?.viewModelInstance;
        if (!vmi) return;

        for (let i = 0; i < 3; i++) {
            const cardSelected = vmi?.boolean("card_" + i + "_selected");
            if( cardSelected ) {
                cardSelected.value = false;
            }
        }
        
      } catch (err: any) {
        console.error("playerCast error:", err);
      } finally {
      }
  }

  const handleClaim = async (): Promise<void> => {
    if (!ADDRESS) {
      console.warn("No player address");
      return;
    }
  
    try {
      const res = await fetch("https://sui-game.onrender.com/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: ADDRESS }),
      });
  
      const json = await res.json();
      if (!res.ok) {
        console.error("Claim failed:", json.error);
        return;
      }
  
      // 👉 map the server shape into your `Catch` type
      const c = json.claimed;
      const mapped: Catch = {
        type:     c.catch.type,
        length:   c.length   != null ? String(c.length)   : "",
        weight:   c.weight   != null ? String(c.weight)   : "",
        at:       c.at,
      };
  
      setLastCatch(mapped);
      console.log("Claim success, stored:", mapped);

        // Clear the catch
        const vmi = riveRef.current?.viewModelInstance;
        if (!vmi) return;

        const catchName = vmi?.string("catch_name");
        if (!catchName) {
            console.warn("No property named 'catch_name' in Main_VM");
            return;
        } else {
            console.log("Found property", catchName.name);
            catchName.value = "";
        }
    } catch (err) {
      console.error("Claim error:", err);
    }
  };
  

  return (
    <>
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
    </>
  );
}
