// src/components/OwnedObjects.tsx
import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

export default function OwnedObjects() {
  const account = useCurrentAccount();
  const [objectIds, setObjectIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account?.address) {
      setObjectIds([]);
      return;
    }

    setLoading(true);
    client
      .getOwnedObjects({ owner: account.address })
      .then((resp) => {
        const ids = resp.data.map((obj) => {
          // Some responses have top-level .objectId,
          // others nest it under .data.objectId
          if ('objectId' in obj) return obj.objectId;
          return (obj.data as any)?.objectId ?? 'unknown';
        });
        setObjectIds(ids);
      })
      .catch((e) => {
        console.error('Failed to fetch owned objects:', e);
        setObjectIds([]);
      })
      .finally(() => setLoading(false));
  }, [account]);

  if (!account?.address) {
    return (
      <div className="p-4 border rounded shadow">
        <h3 className="font-bold">Objects owned by the connected wallet</h3>
        <p>Wallet not connected.</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded shadow mt-4">
      <h3 className="font-bold mb-2">Objects owned by {account.address}</h3>
      {loading ? (
        <p>Loading…</p>
      ) : objectIds.length ? (
        <ul className="list-disc pl-5">
          {objectIds.map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      ) : (
        <p>No objects found.</p>
      )}
    </div>
  );
}
