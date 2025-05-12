import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


interface GlobalContextType {
  ADDRESS: string;
  setADDRESS: React.Dispatch<React.SetStateAction<string>>;
  PLAYER_DATA: PlayerData;
  setPLAYER_DATA: React.Dispatch<React.SetStateAction<PlayerData>>;
}

export interface GameData {
  address: string;
  // player net - Whatever they last caught and must claim to clear out
  // cards in deck
  // cards in hand
  // Time of day
  // event in play
  // Event turns



  // -- Hide These -- //
  // Fish in lake
  // -- Depths
  // -- Types
  // 

  // -- Stats -- //
  // Total of catches for all players
  // Total casts of all players
  // Total players in game
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
    selectedCards: [ -1, -1, -1], // Always 3 cards
  });
 
  useEffect(() => {
    console.log("ADDRESS", ADDRESS);
  }, [ADDRESS]);

  useEffect(() => {
    console.log("PLAYER_DATA", PLAYER_DATA);
  }, [PLAYER_DATA]);

  return (
    <GlobalContext.Provider
      value={{
        ADDRESS,
        setADDRESS,
        PLAYER_DATA,
        setPLAYER_DATA,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export default GlobalProvider;