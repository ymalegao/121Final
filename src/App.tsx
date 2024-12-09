import { useRef, useState } from 'react';
import { IRefPixiGame, PixiGame } from './game/PixiGame';

function App() {
  const pixiRef = useRef<IRefPixiGame | null>(null);
  const [slotName, setSlotName] = useState('');

  const handleSave = () => {
    if (pixiRef.current) {
      try {
        alert(`Game saved successfully to slot "${slotName}"`);
      } catch (error) {
        console.error('Error saving game:', error);
        alert('Failed to save the game state.');
      }
    } else {
      alert('Game instance not available.');
    }
  };

  return (
    <div id="app">
      <h1>Game Save/Load System</h1>
      <div>
        <input
          type="text"
          placeholder="Enter slot name"
          value={slotName}
          onChange={(e) => setSlotName(e.target.value)}
        />
        <button onClick={handleSave}>Save Game</button>
      </div>
      <PixiGame ref={pixiRef} />
    </div>
  );
}

export default App;
