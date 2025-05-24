import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GameState, CatchHistory, PlayerData } from '../types';

interface GlobalContextType {
  ADDRESS: string;
  setADDRESS: React.Dispatch<React.SetStateAction<string>>;
  PLAYER_DATA: PlayerData;
  setPLAYER_DATA: React.Dispatch<React.SetStateAction<PlayerData>>;
  gameState: GameState | null;
  catchHistory: string[];
  currentHour: number;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [ADDRESS, setADDRESS] = useState<string>('disconnected');
  const [PLAYER_DATA, setPLAYER_DATA] = useState<PlayerData>({
    // address: '',
    activeHand: [-1, -1, -1],
    casts: 0,
    catch: {
      type: '',
      length: '',
      weight: '',
      at: '',
    },
    deck: [],
    deckCount: 0,
    hand: [-1, -1, -1],
    madness: 0,
    playerId: '',
    resetDeck: false,
    state: 0,
    // selectedCards: [-1, -1, -1],
  });

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [catchHistory, setCatchHistory] = useState<string[]>([]);
  const [currentHour, setCurrentHour] = useState<number>(0);

  // Fetch game state every 1 seconds
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch('https://sui-game.onrender.com/state');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: GameState = await res.json();
        setGameState(data);
      } catch (e) {
        console.error('Error fetching game state:', e);
      }
    };
    fetchState();
    const interval = setInterval(fetchState, 1_000);
    return () => clearInterval(interval);
  }, []);

  // Fetch catch history every 5 seconds
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('https://sui-game.onrender.com/catch-history');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: CatchHistory = await res.json();
        setCatchHistory(data.history);
      } catch (e) {
        console.error('Error fetching catch history:', e);
      }
    };
    fetchHistory();
    const interval = setInterval(fetchHistory, 3_000);
    return () => clearInterval(interval);
  }, []);

  // Fetch player info every 3 seconds
  useEffect(() => {
    if (!ADDRESS) return;

    const fetchState = async () => {
      try {
        const res = await fetch(
          `https://sui-game.onrender.com/player-info/${ADDRESS}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: PlayerData = await res.json();
        setPLAYER_DATA(data);
      } catch (e) {
        console.error('Error fetching player info:', e);
      }
    };
    fetchState();
    const interval = setInterval(fetchState, 1_000);
    return () => clearInterval(interval);
  }, [ADDRESS]);

  useEffect(() => {
    // console.log("PLAYER_DATA: ", PLAYER_DATA);
  }, [PLAYER_DATA]);

  useEffect(() => {
    const fetchHour = async () => {
      try {
        const res = await fetch('https://sui-game.onrender.com/time');
        if (!res.ok) throw new Error(res.statusText);
        const { hour }: { hour: number } = await res.json();
        setCurrentHour(hour);
      } catch (e) {
        console.error('Failed to fetch time:', e);
      }
    };
    fetchHour();
    const interval = setInterval(fetchHour, 1_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        ADDRESS,
        setADDRESS,
        PLAYER_DATA,
        setPLAYER_DATA,
        gameState,
        catchHistory,
        currentHour,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobalContext must be used within a GlobalProvider');
  return context;
};

export default GlobalProvider;
