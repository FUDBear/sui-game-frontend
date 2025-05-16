import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GameState, CatchHistory } from '../types';

interface GlobalContextType {
  ADDRESS: string;
  setADDRESS: React.Dispatch<React.SetStateAction<string>>;
  PLAYER_DATA: PlayerData;
  setPLAYER_DATA: React.Dispatch<React.SetStateAction<PlayerData>>;
  gameState: GameState | null;
  catchHistory: string[];
  currentHour: number;
}

export interface GameData {
  address: string;
  // other global game data fields...
}

export interface PlayerData {
  address: string;
  selectedCards: number[];
}

const GlobalContext = createContext<GlobalContextType | null>(null);

const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [ADDRESS, setADDRESS] = useState<string>('disconnected');
  const [PLAYER_DATA, setPLAYER_DATA] = useState<PlayerData>({
    address: '',
    selectedCards: [-1, -1, -1],
  });

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [catchHistory, setCatchHistory] = useState<string[]>([]);
  const [currentHour, setCurrentHour] = useState<number>(0);

  // Fetch game state every 3 seconds
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
    const interval = setInterval(fetchState, 3_000);
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
    const interval = setInterval(fetchHistory, 5_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("Cards: ", PLAYER_DATA.selectedCards);
  }, [PLAYER_DATA.selectedCards]);

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
