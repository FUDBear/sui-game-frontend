import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { useState } from 'react';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

export default function MintNFTButton() {
  const account = useCurrentAccount();
  const signAndExecute = useSignAndExecuteTransaction();
  const [imageUrl, setImageUrl] = useState('https://i.imgur.com/sFFNxAr.jpeg');
  const [minting, setMinting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const mint = async () => {
    console.log('Minting NFT...');
    console.log('Account:', account);

    if (!account?.address) {
      setResult('Wallet not connected');
      return;
    }

    setMinting(true);
    setResult(null);

    const tx = new Transaction();
    tx.moveCall({
      target: '0x3f318c66e0987eea240227e9104ebb13a54764765e5fe098132fcbf227b19eca::testnet_nft::mint_to_sender',
      arguments: [
        tx.pure.string('My First NFT'),
        tx.pure.string('This is a test NFT from SUI'),
        tx.pure.string(imageUrl),
        tx.pure.string(imageUrl), // thumbnail_url
      ],
    });

    try {
      const result = await signAndExecute.mutateAsync({
        transaction: tx,
        chain: 'sui:testnet',
      });
      setResult(`Minted! Digest: ${result.digest}`);
    } catch (err: any) {
      console.error(err);
      setResult(`Error: ${err.message}`);
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow">
      <h2 className="text-lg font-bold mb-2">Mint a Testnet NFT</h2>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="border px-2 py-1 rounded w-full mb-2"
        placeholder="Image URL"
      />
      <button
        onClick={mint}
        disabled={minting}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {minting ? 'Minting…' : 'Mint NFT'}
      </button>
      {result && <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>}
    </div>
  );
}
