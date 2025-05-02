import React, { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { Box, Button, Flex, Text } from '@radix-ui/themes';

const PACKAGE_ID = '0xbc79c367fa197310390c7bd20535caf843c98e97a8e79855da4f5ff4abb6f4c1';
const OBJECT_ID = '0xdf2699f4f497a385a13db20f2bf21758d90564abe05bb7f1849bbcf91874e110';

export function CounterIncrementor() {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();

  const [digest, setDigest] = useState('');
  const [counterValue, setCounterValue] = useState<number | null>(null);

  const fetchCounterValue = async () => {
    try {
      const result = await client.getObject({
        id: OBJECT_ID,
        options: { showContent: true },
      });
      const value = result.data?.content?.fields?.value;
      setCounterValue(parseInt(value, 10));
    } catch (error) {
      console.error('Failed to fetch counter value:', error);
    }
  };

  useEffect(() => {
    fetchCounterValue();
  }, []);

  const handleIncrement = () => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::counter::increment`,
      arguments: [tx.object(OBJECT_ID)],
    });

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: 'sui:testnet',
      },
      {
        onSuccess: (result) => {
          console.log('Transaction executed:', result);
          setDigest(result.digest);
          fetchCounterValue();
        },
        onError: (error) => {
          console.error('Transaction failed:', error);
        },
      }
    );
  };

  if (!currentAccount) {
    return <Text>Please connect your wallet to interact with the counter.</Text>;
  }

  return (
    <Box>
      <Flex direction="column" gap="3">
        <Button onClick={handleIncrement}>Increment Counter</Button>
        <Button onClick={fetchCounterValue} variant="outline">Refresh Counter Value</Button>
        {counterValue !== null && <Text>Current Counter Value: {counterValue}</Text>}
        {digest && <Text>Transaction Digest: {digest}</Text>}
      </Flex>
    </Box>
  );
}