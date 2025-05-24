import { useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import GameView from "./game/GameView";
import { useGlobalContext } from "./tools/GlobalProvider";

function App() {
  const { setADDRESS } = useGlobalContext();
  const account = useCurrentAccount();

  useEffect(() => {
    // console.log("ACCOUNT", account?.address);
    setADDRESS(account?.address || "disconnected");
  }, [account]);
  
  return (
    <div style={{ 
      width: "100%", 
      minHeight: "100vh", 
      backgroundColor: "black",
      color: "white"
    }}>

      <GameView />

    </div>
  );
}

export default App;
