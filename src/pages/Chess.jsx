import React, { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useNavigate } from "react-router-dom";

const API_URL = "https://chess-api-vxd3.onrender.com/bot_move";

export default function ChessPage() {

  const navigate = useNavigate();

  const [game, setGame] = useState(new Chess());
  const [playerTime, setPlayerTime] = useState(600); // 10 minutes
  const [aiTime, setAiTime] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(true);
  const playerTimer = useRef();
  const aiTimer = useRef();

  useEffect(() => {
    if (!isPlaying) return;
    if (game.isGameOver()) return;

    if (playerTurn) {
      playerTimer.current = setInterval(() => {
        setPlayerTime((t) => t - 1);
      }, 1000);
    } else {
      aiTimer.current = setInterval(() => {
        setAiTime((t) => t - 1);
      }, 1000);

      // send FEN to backend
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fen: game.fen() })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.move) {
            const newGame = new Chess(game.fen());
            newGame.move(data.move);
            setGame(newGame);
            setPlayerTurn(true);
          }
        });
    }

    return () => {
      clearInterval(playerTimer.current);
      clearInterval(aiTimer.current);
    };
  }, [isPlaying, playerTurn]);

  const handleMove = (sourceSquare, targetSquare) => {
    if (!playerTurn || !isPlaying) return false;
    const move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    if (move) {
      setGame(new Chess(game.fen()));
      setPlayerTurn(false);
      return true;
    }
    return false;
  };

  const startGame = () => {
    setGame(new Chess());
    setPlayerTime(600);
    setAiTime(600);
    setIsPlaying(true);
    setPlayerTurn(true);
  };

  return (
    <div className="min-h-screen bg-fixed bg-center bg-cover text-white"
         style={{ backgroundImage: "url('/images/piece_shadow.jpg')" }}>

        {/* Static Top Navigation */}
        <div className="static top-0 left-0 w-full bg-black bg-opacity-70 p-6 text-center z-50">
            <button
            className="text-lg font-semibold hover:text-white transition"
            onClick={() => navigate("/")}
            >
            Home
            </button>
      </div>    
    
      <div className="bg-black bg-opacity-70 p-6 text-center">
        <h1 className="text-4xl font-bold">Play Me!</h1>
        <p className="text-gray-300 mt-2">Chess.com ~2000</p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-10 p-8">
        <div className="text-center">
          <p className="text-lg mb-2">You</p>
          <div className="text-2xl font-mono bg-black bg-opacity-50 p-2 rounded">
            {Math.floor(playerTime / 60)}:{(playerTime % 60).toString().padStart(2, "0")}
          </div>
        </div>

        <div className="static justify-center items-center">
            <Chessboard
                position={game.fen()}
                onPieceDrop={handleMove}
                arePiecesDraggable={isPlaying && playerTurn}
                boardWidth={400}
                customDarkSquareStyle={{ backgroundColor: '#2c2c2c' }}
                customLightSquareStyle={{ backgroundColor: '#666666' }}
            />  
        </div>

        <div className="text-center">
          <p className="text-lg mb-2">Shanaman</p>
          <div className="text-2xl font-mono bg-black bg-opacity-50 p-2 rounded">
            {Math.floor(aiTime / 60)}:{(aiTime % 60).toString().padStart(2, "0")}
          </div>
        </div>
      </div>

      <div className="flex justify-center py-6">
        <button
          onClick={startGame}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded text-white text-lg"
        >
          {isPlaying ? "Restart" : "Play"}
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-black bg-opacity-80 text-gray-400 text-center py-6 border-t border-gray-700">
        <p>eshanaha@stevens.edu | github.com/ERShanahan | linkedin.com/in/eshanaha</p>
        <p>© {new Date().getFullYear()} Ethan Shanahan. All rights reserved.</p>
      </footer>
    </div>
  );
}
