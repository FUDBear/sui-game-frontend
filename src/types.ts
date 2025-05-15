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