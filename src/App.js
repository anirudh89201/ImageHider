import React, { useState } from 'react';
import './App.css'
import { Encryption } from './Components/Encryption';
import { Decryption } from './Components/Decryption';
function App() {
  const [mode,setMode] = useState('');
  const handleMode = (mode) => {
    setMode(mode);
  }
  return (
    <div className="App">
      {mode==='' &&(
        <div>
          <h1>Stegongraphy too  l</h1>
          <button type='button' onClick={() => handleMode('encryption')}>Encryption</button>
          <button type='button' onClick={() => handleMode('decryption')}>Decryption</button>
          </div>
      )}
      {mode === 'encryption' && <Encryption/>}
      {mode === 'decryption' && <Decryption/>}
    </div>
  );
}

export default App;
