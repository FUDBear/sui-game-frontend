import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { CounterIncrementor } from "./CounterIncrementor";
import MintNFTButton from "./MintNFTButton";
import PlayGameButton from "./PlayGameButton";
import GameView from "./game/GameView";

function App() {
  return (
    <>
      {/* <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>Darkshore Fishing</Heading>
        </Box>
        <Box>
          <ConnectButton />
        </Box>
      </Flex> */}

      {/* <Container> */}
      
        {/* <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <WalletStatus />
          <MintNFTButton />
          <PlayGameButton />
        </Container> */}
      {/* </Container> */}

      <GameView />
    </>
  );
}

export default App;
