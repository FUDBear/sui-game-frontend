// src/components/OwnedNFTs.tsx
import React from "react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Flex, Heading, Text } from "@radix-ui/themes";

interface NFTData {
  objectId: string;
  name: string;
  imageUrl?: string;
}

export function OwnedNFTs() {
  const account = useCurrentAccount();
  const {
    data: ownedResp,
    isPending: ownedLoading,
    error: ownedError,
  } = useSuiClientQuery(
    "getOwnedObjects",
    { owner: account?.address! },
    { enabled: Boolean(account) }
  );

  if (!account) return <Flex>Please connect your wallet.</Flex>;
  if (ownedError) return <Flex>Error loading objects: {ownedError.message}</Flex>;
  if (ownedLoading || !ownedResp) return <Flex>Loading your objects…</Flex>;

  const objectIds = ownedResp.data.map((o) => o.data?.objectId).filter((id): id is string => id !== undefined);
  if (objectIds.length === 0)
    return <Flex>No NFTs found in your wallet.</Flex>;

  return (
    <Flex direction="column" gap="4">
      <Heading size="4">My NFTs</Heading>
      <Flex wrap="wrap" gap="4">
        {objectIds.map((id) => (
          <NFTCard key={id} objectId={id} />
        ))}
      </Flex>
    </Flex>
  );
}

function NFTCard({ objectId }: { objectId: string }) {
  // for each object, fetch its full content+display metadata
  const {
    data: objResp,
    isPending,
    error,
  } = useSuiClientQuery(
    "getObject",
    {
      id: objectId,
      options: { showContent: true, showDisplay: true },
    },
    { enabled: true }
  );

  if (isPending || !objResp) {
    return (
      <Flex direction="column" align="center" style={{ width: 140 }}>
        <Text>Loading…</Text>
      </Flex>
    );
  }
  if (error) {
    return (
      <Flex direction="column" align="center" style={{ width: 140 }}>
        <Text>Error</Text>
      </Flex>
    );
  }

  // unwrap the response
  const resp = objResp.data;    // SuiObjectResponse
  const data = resp;       // SuiObjectData
  const display = (data?.display as any) || {};
  const fields = (data?.content as any)?.fields || {};

  const name = display.name || fields.name || "Unnamed NFT";
  const imageUrl =
    display.image_url ||
    display.imageUrl ||
    fields.image_url ||
    fields.imageUrl ||
    null;

  return (
    <Flex direction="column" align="center" style={{ width: 140 }}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      ) : (
        <Flex
          align="center"
          justify="center"
          style={{
            width: 120,
            height: 120,
            background: "#f0f0f0",
            borderRadius: 8,
          }}
        >
          <Text>No Image</Text>
        </Flex>
      )}
      <Text size="2" truncate style={{ marginTop: 4 }}>
        {name}
      </Text>
      <Text size="1" truncate style={{ color: "#888" }}>
        {objectId.slice(0, 8)}…{objectId.slice(-4)}
      </Text>
    </Flex>
  );
}
