import { useState } from 'react';

const BASE_URL = 'https://sui-game.onrender.com';

export default function PlayGameButton() {
  const [result, setResult] = useState<string | null>(null);
  const [rolling, setRolling] = useState(false);

  const playGame = async () => {
    setRolling(true);
    setResult('Rolling…');

    try {
      const res = await fetch(`${BASE_URL}/play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      console.log('🎲 Game result:', json);
      setResult(JSON.stringify(json, null, 2));
    } catch (err: any) {
      console.error('❌ Error:', err);
      setResult(`Error: ${err.message}`);
    } finally {
      setRolling(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow mt-4">
      <h2 className="text-lg font-bold mb-2">Play SUI Roll Game</h2>
      <button
        onClick={playGame}
        disabled={rolling}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {rolling ? 'Rolling…' : 'Play'}
      </button>
      {result && (
        <pre className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  );
}
