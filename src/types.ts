export interface CatchRecord {
    playerId: string;
    catch: { type: string };
    event: string | null;
    phase: string;
    at: string;
    weight: number | null;
    length: number | null;
  }
  
  export interface GameState {
    phase: string;
    event: string | null;
    hour: number;
    catches: CatchRecord[];
  }
  
  export interface CatchHistory {
    history: string[];
  }

  export interface SingleRiveSwitcherProps {
    index: number;
    onIndexChange: (i: number) => void;
  }

  export interface GameData {
    address: string;
  }
  
  export interface PlayerData {
    // address: string;
    activeHand: number[];
    casts: number;
    catch: Catch | null;
    deck: number[];
    deckCount: number;
    hand: number[];
    madness: number;
    playerId: string;
    resetDeck: boolean;
    state: number;
    // selectedCards: number[];
  }

  export interface Catch {
    type: string;
    at: string;
    weight: string;
    length: string;
  }