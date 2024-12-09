import { useRef, useState } from 'react';
import { PhaserGame } from './game/PhaserGame';
import GameState from './game/classes/GameState';

function App() {
  const phaserRef = useRef(null);
  const [saveSlots, setSaveSlots] = useState(GameState.getAvailableSaveSlots());
  const [slotName, setSlotName] = useState('');

  // Save the current game state
  const handleSave = () => {
    if (phaserRef.current) {
      try {
        // Example logic for saving game state
        // const gameState = phaserRef.current.getGameState();
        // SaveManager.saveGame(slotName, gameState);
        // setSaveSlots(SaveManager.getSaveSlots());

        alert(`Game saved successfully to slot "${slotName}"`);
      } catch (error) {
        console.error('Error saving game:', error);
        alert('Failed to save the game state.');
      }
    } else {
      alert('Game instance not available.');
    }
  };

  // Load a saved game state
  const handleLoad = (slot) => {
    console.log('Loading game from slot:', slot);
    // if (phaserRef.current) {
    //   try {
    //     const savedState = SaveManager.loadGame(slot);
    //     if (savedState) {
    //       savedState.restoreState(savedState.getCurrentState());
    //       alert(`Game loaded from slot "${slot}"`);
    //     }
    //   } catch (error) {
    //     console.error('Error loading game:', error);
    //     alert('Failed to load the game state.');
    //   }
    // } else {
    //   alert('Game instance not available.');
    // }
  };

  // Delete a save slot
  const handleDelete = (slot) => {
    console.log('Deleting save slot:', slot);
    // Example logic for deleting a save slot
    // SaveManager.deleteSave(slot);
    // setSaveSlots(SaveManager.getSaveSlots());
    // alert(`Save slot "${slot}" deleted.`);
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
      <div>
        <h2>Save Slots</h2>
        <ul>
          {saveSlots.map((slot) => (
            <li key={slot}>
              {slot}
              <button onClick={() => handleLoad(slot)}>Load</button>
              <button onClick={() => handleDelete(slot)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <PhaserGame ref={phaserRef} />
    </div>
  );
}

export default App;
