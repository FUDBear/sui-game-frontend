import { useEffect, useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import GameView from "./game/GameView";
import { useGlobalContext } from "./tools/GlobalProvider";

function App() {
  const { setADDRESS } = useGlobalContext();
  const account = useCurrentAccount();
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    // console.log("ACCOUNT", account?.address);
    setADDRESS(account?.address || "disconnected");
  }, [account]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div style={{ 
      width: "100%", 
      minHeight: "100vh", 
      backgroundColor: "black",
      color: "white",
      position: "relative"
    }}>
      {showArrow && (
        <div style={{
          position: "fixed",
          bottom: "10px",
          left: "5%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          animation: "fadeInOut 4s ease-in-out infinite",
          zIndex: 1000
        }}>
          <span style={{
            fontFamily: "girassol-regular",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center"
          }}>
            Pitch Deck <br />
          </span>
          <div style={{
            width: "10px",
            height: "10px",
            borderRight: "3px solid #ffffff",
            borderBottom: "3px solid #ffffff",
            transform: "rotate(45deg)",
            animation: "bounce 2s infinite"
          }} />
        </div>
      )}

      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0) rotate(45deg);
            }
            40% {
              transform: translateY(-10px) rotate(45deg);
            }
            60% {
              transform: translateY(-3px) rotate(45deg);
            }
          }
          @keyframes fadeInOut {
            0%, 100% {
              opacity: 0.1;
            }
            50% {
              opacity: 1;
            }
          }
        `}
      </style>

      <GameView />
    </div> 
  );
}

export default App;
