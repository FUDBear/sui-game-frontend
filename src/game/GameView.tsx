import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import { SingleRiveSwitcher, RiveEventWithIndex } from "./SingleRiveSwitcher";
import { useGlobalContext } from "../tools/GlobalProvider";

const GameView = forwardRef<HTMLDivElement>((_, ref) => {
  const { gameState, catchHistory, ADDRESS, PLAYER_DATA, currentHour } = useGlobalContext();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [casting, setCasting] = useState<boolean>(false);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [timeNormalized, setTimeNormalized] = useState<number>(0);
  const handleRiveEvent = ({ name, index }: RiveEventWithIndex) => {
    console.log(`Rive event on #${index}:`, name);
    switch (name) {
      case "click_1": setCurrentIndex(0); break;
      case "click_2": setCurrentIndex(1); break;
      case "click_3":
      case "PlayGame": setCurrentIndex(2); break;
    }
  };

  const handleCast = async (): Promise<void> => {
    if (!ADDRESS) {
      console.warn('No player address');
      return;
    }
    setCasting(true);
    try {
      const res = await fetch('https://sui-game.onrender.com/playercast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: ADDRESS,
          cast: PLAYER_DATA.selectedCards,
          cards: [],
        }),
      });
      const data = await res.json();
      if (!res.ok) console.error('Cast failed:', data.error);
      else console.log('Cast success:', data);
    } catch (err) {
      console.error('Cast error:', err);
    } finally {
      setCasting(false);
    }
  };

  const handleClaim = async (): Promise<void> => {
    if (!ADDRESS) {
      console.warn('No player address');
      return;
    }
    setClaiming(true);
    try {
      const res = await fetch('https://sui-game.onrender.com/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: ADDRESS }),
      });
      const data = await res.json();
      if (!res.ok) console.error('Claim failed:', data.error);
      else console.log('Claim success:', data);
    } catch (err) {
      console.error('Claim error:', err);
    } finally {
      setClaiming(false);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => containerRef.current!);

  useEffect(() => {
    console.log("Current Hour:", currentHour);
    const normalized = currentHour / 24;
    setTimeNormalized(normalized);
  }, [currentHour]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Connect */}
      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
        <ConnectButton />
      </div>

      {/* State Display */}
      {gameState && (
        <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 4, color: '#fff' }}>
          <div><strong>Phase:</strong> {gameState.phase}</div>
          <div><strong>Event:</strong> {gameState.event ?? 'None'}</div>
          <div><strong>Hour:</strong> {gameState.hour}</div>
          <div><strong>Catches:</strong> {gameState.catches.length}</div>
          <div><strong>Current Hour:</strong> {currentHour}</div>
        </div>
      )}

      {/* History Toggle */}
      <div style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 10 }}>
        <button
          onClick={() => setHistoryOpen(open => !open)}
          style={{ padding: '6px 12px', borderRadius: 4, background: '#222', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          {historyOpen ? 'Hide History' : 'Show History'}
        </button>
      </div>

      {/* History Panel */}
      {historyOpen && catchHistory.length > 0 && (
        <div
          onClick={() => setHistoryOpen(false)}
          style={{ position: 'absolute', bottom: 48, left: 8, zIndex: 10, maxHeight: 200, width: 300, overflowY: 'auto', background: 'rgba(0,0,0,0.8)', padding: 8, borderRadius: 4, color: '#fff', cursor: 'pointer' }}
        >
          <div style={{ marginBottom: 4, fontWeight: 'bold' }}>Catch History (click to close)</div>
          <ul style={{ margin: 0, paddingLeft: '1em' }}>
            {catchHistory.map((line: string, i: number) => (
              <li key={i} style={{ fontSize: 12, marginBottom: 2 }}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Rive UI */}
      <SingleRiveSwitcher
        index={currentIndex}
        onIndexChange={setCurrentIndex}
        onRiveEvent={handleRiveEvent}
        cardIndex={currentIndex}
        timeNormalized={timeNormalized}
      />

      {/* Cast & Claim Buttons */}
      <div style={{ position: 'absolute', bottom: 8, right: 8, zIndex: 10, display: 'flex', gap: 8 }}>
        <button
          onClick={handleCast}
          disabled={casting}
          style={{ padding: '8px 16px', borderRadius: 4, background: '#0066ff', color: '#fff', border: 'none', cursor: casting ? 'default' : 'pointer', opacity: casting ? 0.6 : 1 }}
        >
          {casting ? 'Casting...' : 'Cast'}
        </button>
        <button
          onClick={handleClaim}
          disabled={claiming}
          style={{ padding: '8px 16px', borderRadius: 4, background: '#00aa00', color: '#fff', border: 'none', cursor: claiming ? 'default' : 'pointer', opacity: claiming ? 0.6 : 1 }}
        >
          {claiming ? 'Claiming...' : 'Claim'}
        </button>
      </div>
    </div>
  );
});

export default GameView;
