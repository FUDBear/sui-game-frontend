import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

export async function MintNFT(
    account: { address?: string } | null,
    signAndExecute: ReturnType<typeof useSignAndExecuteTransaction>,
    imageUrl: string
  ) {
    console.log('Minting…', { account, imageUrl });
    if (!account?.address) throw new Error('Wallet not connected');
  
    const tx = new Transaction();
    tx.moveCall({
      target:
        '0x3f318c66e0987eea240227e9104ebb13a54764765e5fe098132fcbf227b19eca::testnet_nft::mint_to_sender',
      arguments: [
        tx.pure.string('My First NFT'),
        tx.pure.string('This is a test NFT from SUI'),
        tx.pure.string(imageUrl),
        tx.pure.string(imageUrl),
      ],
    });
  
    return await signAndExecute.mutateAsync({
      transaction: tx,
      chain: 'sui:testnet',
    });
  }
