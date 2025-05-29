import React, { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Header } from "../components/Header"
import { Footer } from "../components/Footer";

const API_URL = "https://chess-api-vxd3.onrender.com/bot_move";

export default function ChessPage() {

  const [game, setGame] = useState(new Chess());
  const [playerTime, setPlayerTime] = useState(600); // seconds
  const [aiTime, setAiTime] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(""); // e.g. "You win by timeout!"
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves]     = useState([]);   // ← new

  const playerTimer = useRef(null);
  const aiTimer = useRef(null);

  // Helper: end the game, stop all timers, set result
  const endGame = (message) => {
    setGameOver(true);
    setResult(message);
    clearInterval(playerTimer.current);
    clearInterval(aiTimer.current);
  };

  // Watch for clock hitting zero
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    if (playerTime <= 0) {
      endGame("Time’s up! You lose on time.");
    }
  }, [playerTime, isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    if (aiTime <= 0) {
      endGame("Shanaman’s clock ran out! You win on time.");
    }
  }, [aiTime, isPlaying, gameOver]);

  // Main game loop: handle our clock, fetch AI move, handle checkmate
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        // the side to move was just checkmated ⇒ the *other* side wins
        const loser  = game.turn() === 'w' ? 'White' : 'Black';
        const winner = loser === 'White' ? 'Black' : 'White';
        endGame(`${winner} wins by checkmate!`);
      }
      else if (game.isStalemate()) {
        endGame('Draw by stalemate.');
      }
      else if (game.isInsufficientMaterial()) {
        endGame('Draw by insufficient material.');
      }
      else if (game.isThreefoldRepetition()) {
        endGame('Draw by threefold repetition.');
      }
      else if (game.isDraw()) {
        // covers 50-move and other draw conditions
        endGame('Draw.');
      }
    }

    if (playerTurn) {
      // Player’s clock
      playerTimer.current = setInterval(() => {
        setPlayerTime((t) => t - 1);
      }, 1000);
    } else {
      // AI’s clock + move fetch
      aiTimer.current = setInterval(() => {
        setAiTime((t) => t - 1);
      }, 1000);

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fen: game.fen() }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.move && !gameOver) {
            const newGame = new Chess(game.fen());
            newGame.move(data.move);
            setGame(newGame);
            setPlayerTurn(true);
          }
        })
        .catch(console.error);
    }

    return () => {
      clearInterval(playerTimer.current);
      clearInterval(aiTimer.current);
    };
  }, [isPlaying, playerTurn, game, gameOver]);

  const handleMove = (from, to) => {
    if (!isPlaying || !playerTurn || gameOver) return false;
    const move = game.move({ from, to, promotion: "q" });
    if (move) {
      setGame(new Chess(game.fen()));
      setPlayerTurn(false);
      setSelectedSquare(null);
      setLegalMoves([]);
      return true;
    }
    return false;
  };

  const onSquareClick = (sq) => {
    if (!isPlaying || !playerTurn || gameOver) return;
  
    // 1) If you already have a piece selected:
    if (selectedSquare) {
      // 1a) clicking the same square again → deselect
      if (sq === selectedSquare) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
      // 1b) clicking another friendly piece → reselect it & show its moves
      const piece = game.get(sq);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(sq);
        setLegalMoves(
          game.moves({ square: sq, verbose: true }).map(m => m.to)
        );
        return;
      }
      // 1c) otherwise treat as a move from the previously selectedSquare → clear selection
      handleMove(selectedSquare, sq);
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }
  
    // 2) If nothing is selected yet, select only if it's your piece
    const piece = game.get(sq);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(sq);
      setLegalMoves(
        game.moves({ square: sq, verbose: true }).map(m => m.to)
      );
    }
  };

  const startGame = () => {
    // reset everything
    clearInterval(playerTimer.current);
    clearInterval(aiTimer.current);
    setGame(new Chess());
    setPlayerTime(600);
    setAiTime(600);
    setIsPlaying(true);
    setGameOver(false);
    setPlayerTurn(true);
    setResult("");
    setSelectedSquare(null);
  };

  const highlightStyle = {
    backgroundImage:
      "radial-gradient(circle at center, rgba(0,0,0,0.7) 25%, transparent 26%)",
  };
  
  // merge together the source square + every legal destination
  const customStyles = {
    // highlight the source itself
    ...(selectedSquare
      ? { [selectedSquare]: highlightStyle }
      : {}),
  
    // plus every legal move
    ...legalMoves.reduce(
      (acc, sq) => ({
        ...acc,
        [sq]: highlightStyle
      }),
      {}
    ),
  };

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover text-white"
      style={{ backgroundImage: "url('/images/piece_shadow.jpg')" }}
    >
      <Header />
  
      <div className="bg-black bg-opacity-70 p-6 text-center">
        <h1 className="text-4xl font-bold">Play Me!</h1>
        <p className="text-gray-300 mt-2">Chess.com ~2000</p>
      </div>
  
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 p-8">
        {/* Player Clock */}
        <div className="text-center">
          <p className="text-lg mb-2">You</p>
          <div className="text-2xl font-mono bg-black bg-opacity-50 p-2 rounded">
            {Math.floor(playerTime / 60)}:
            {(playerTime % 60).toString().padStart(2, "0")}
          </div>
        </div>
  
        {/* Chessboard */}
        <div className="static justify-center items-center">
          <Chessboard
            position={game.fen()}
            onPieceDrop={(from, to) => {
              const ok = handleMove(from, to);
              if (!ok) return false;
              return true;
            }}
            arePiecesDraggable={isPlaying && playerTurn && !gameOver}
            onSquareClick={onSquareClick}
            customSquareStyles={customStyles}
            boardWidth={400}
            customDarkSquareStyle={{ backgroundColor: "#2c2c2c" }}
            customLightSquareStyle={{ backgroundColor: "#666666" }}
          />
        </div>
  
        {/* AI Clock */}
        <div className="text-center">
          <p className="text-lg mb-2">Shanaman</p>
          <div className="text-2xl font-mono bg-black bg-opacity-50 p-2 rounded">
            {Math.floor(aiTime / 60)}:
            {(aiTime % 60).toString().padStart(2, "0")}
          </div>
        </div>
      </div>
  
      {/* Play / Restart Button */}
      <div className="flex justify-center py-6">
        <button
          onClick={startGame}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded text-white text-lg"
        >
          {isPlaying ? "Restart" : "Play"}
        </button>
      </div>
  
      {/* Game Over Overlay */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-center z-50 p-4">
          <h2 className="text-5xl font-bold mb-4">{result}</h2>
          <button
            className="mt-4 bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded text-white text-xl"
            onClick={startGame}
          >
            Play Again
          </button>
        </div>
      )}
  
      <Footer />
    </div>
  );
}
