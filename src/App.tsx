import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { CounterIncrementor } from "./CounterIncrementor";
import MintNFTButton from "./MintNFTButton";
import PlayGameButton from "./PlayGameButton";
import GameView from "./game/GameView";
import WalletNFTs from "./WalletNFTs";
import { OwnedNFTs } from "./OwnedNFTs";

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

      {/* <div style={{ width: "100%", height: "100vh", backgroundColor: "black" }}>
        <GameView />
      </div> */}
      {/* <WalletNFTs /> */}
      {/* <OwnedNFTs /> */}

      {/* <Container>
      
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <WalletStatus />
        </Container>
      </Container> */}
    </>
  );
}

export default App;
