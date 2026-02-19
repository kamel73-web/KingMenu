// src/App.tsx
import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash.split('=')[1]; // Extract the token from the hash
      setSession(token); // Set the session without reloading
      window.history.replaceState({}, document.title, window.location.pathname); // Remove hash from URL
    }
  }, []);

  const setSession = (token) => {
    // Your logic to set the session
    console.log('Session set with token:', token);
  };

  return (
    <div>
      <h1>Welcome to the KingMenu!</h1>
    </div>
  );
};

export default App;