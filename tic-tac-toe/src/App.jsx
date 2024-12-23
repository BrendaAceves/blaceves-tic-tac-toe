import './App.css';
import Board from './Components/Board/Board';
import { useState } from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup, signOut } from "firebase/auth";
import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore";

async function saveGameToFirestore(history) {
  try {
    if (!auth.currentUser) return;
    const gamesCollection = collection(db, "games");
    await addDoc(gamesCollection, {
      userId: auth.currentUser.uid,
      history,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error saving game data:", error.message);
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Login handler
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  
    // Save game after each play
    saveGameToFirestore(nextHistory);
  }
  
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      {user ? (
        <>
          <div className="container">
          <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            <button className='logout' onClick={handleLogout}>Logout</button>
          </div>
          </div>
          <div className="game-info">
            <h2>Previous Moves:</h2>
            <ol>{moves}</ol>
          </div>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}

export default App;
