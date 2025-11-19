import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw } from './Icons';

interface TransformationGameProps {
  onComplete: (score: number) => void;
}

// --- Constants ---
const COLS = 10;
const ROWS = 15; // Slightly shorter for web UI
const BLOCK_SIZE = 24; // Pixels (visual only, logic is grid-based)
const SPEED_MS = 700;
const WIN_LINES = 5;

// --- Types ---
type Board = (string | null)[][];

interface Piece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

// --- Tetromino Definitions ---
// I, O, T, S, Z, J, L
const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]]  // L
];

const COLORS = [
  'bg-sky-500',   // I - Innovation/Tech
  'bg-amber-500', // O - Finance/Resources
  'bg-indigo-500',// T - Strategy
  'bg-emerald-500', // S - Growth
  'bg-red-500',   // Z - Crisis Mgmt
  'bg-blue-600',  // J - Academics
  'bg-orange-500' // L - Operations
];

export const TransformationGame: React.FC<TransformationGameProps> = ({ onComplete }) => {
  // --- State ---
  const [board, setBoard] = useState<Board>(createBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [linesCleared, setLinesCleared] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Refs for game loop to avoid closure staleness
  const boardRef = useRef(board);
  const pieceRef = useRef(currentPiece);
  const gameOverRef = useRef(gameOver);
  const gameWonRef = useRef(gameWon);

  // Sync refs
  useEffect(() => { boardRef.current = board; }, [board]);
  useEffect(() => { pieceRef.current = currentPiece; }, [currentPiece]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { gameWonRef.current = gameWon; }, [gameWon]);

  function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  }

  const getRandomPiece = useCallback((): Piece => {
    const idx = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[idx];
    const color = COLORS[idx];
    // Start in middle
    const x = Math.floor(COLS / 2) - Math.floor(shape[0].length / 2);
    return { shape, color, x, y: 0 };
  }, []);

  // --- Game Logic ---

  const checkCollision = (piece: Piece, moveX: number, moveY: number, rotatedShape?: number[][]) => {
    const shape = rotatedShape || piece.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newX = piece.x + c + moveX;
          const newY = piece.y + r + moveY;
          
          // Bounds check
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          
          // Block check
          if (newY >= 0 && boardRef.current[newY][newX]) return true;
        }
      }
    }
    return false;
  };

  const solidifyPiece = useCallback(() => {
    const piece = pieceRef.current;
    if (!piece) return;

    const newBoard = boardRef.current.map(row => [...row]);
    
    piece.shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val) {
          const boardY = piece.y + r;
          const boardX = piece.x + c;
          if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      });
    });

    // Check for lines
    let lines = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newBoard[r].every(cell => cell !== null)) {
        newBoard.splice(r, 1);
        newBoard.unshift(Array(COLS).fill(null));
        lines++;
        r++; // Re-check same row index since we shifted
      }
    }

    if (lines > 0) {
      const newLinesCleared = linesCleared + lines;
      setLinesCleared(newLinesCleared);
      setScore(prev => prev + (lines * 100));
      
      if (newLinesCleared >= WIN_LINES) {
        setGameWon(true);
        setIsPaused(true);
        setTimeout(() => onComplete(newLinesCleared), 1500);
        return;
      }
    }

    setBoard(newBoard);
    
    // Spawn new piece
    const nextPiece = getRandomPiece();
    if (checkCollision(nextPiece, 0, 0)) {
      setGameOver(true);
      setIsPaused(true);
    } else {
      setCurrentPiece(nextPiece);
    }
  }, [linesCleared, onComplete, getRandomPiece]); // Removed checkCollision from deps to avoid loop, defined inside

  const moveDown = useCallback(() => {
    if (gameOverRef.current || gameWonRef.current || isPaused || !pieceRef.current) return;

    if (!checkCollision(pieceRef.current, 0, 1)) {
      setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
    } else {
      solidifyPiece();
    }
  }, [isPaused, solidifyPiece]);

  // --- Controls ---

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOverRef.current || gameWonRef.current || isPaused || !pieceRef.current) return;

    if (e.key === 'ArrowLeft') {
      if (!checkCollision(pieceRef.current, -1, 0)) {
        setCurrentPiece(prev => prev ? { ...prev, x: prev.x - 1 } : null);
      }
    } else if (e.key === 'ArrowRight') {
      if (!checkCollision(pieceRef.current, 1, 0)) {
        setCurrentPiece(prev => prev ? { ...prev, x: prev.x + 1 } : null);
      }
    } else if (e.key === 'ArrowDown') {
      moveDown();
    } else if (e.key === 'ArrowUp') {
      // Rotate
      const shape = pieceRef.current.shape;
      const rotated = shape[0].map((_, index) => shape.map(row => row[index]).reverse());
      if (!checkCollision(pieceRef.current, 0, 0, rotated)) {
        setCurrentPiece(prev => prev ? { ...prev, shape: rotated } : null);
      }
    }
  }, [isPaused, moveDown]);

  // --- Effects ---

  useEffect(() => {
    if (!currentPiece && !gameOver && !gameWon) {
      setCurrentPiece(getRandomPiece());
    }
  }, [currentPiece, gameOver, gameWon, getRandomPiece]);

  useEffect(() => {
    const interval = setInterval(moveDown, SPEED_MS);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [moveDown, handleKeyDown]);

  // --- UI Render Helpers ---

  const renderCell = (r: number, c: number, cellColor: string | null) => {
    let displayColor = cellColor;
    let isGhost = false;

    // Render active piece
    if (currentPiece) {
      const { shape, x, y, color } = currentPiece;
      const localY = r - y;
      const localX = c - x;
      if (localY >= 0 && localY < shape.length && localX >= 0 && localX < shape[0].length) {
        if (shape[localY][localX]) {
          displayColor = color;
        }
      }
    }

    const baseClasses = "w-6 h-6 border border-slate-900/20 rounded-sm transition-colors duration-75";
    if (displayColor) {
      return <div key={`${r}-${c}`} className={`${baseClasses} ${displayColor} shadow-inner`} />;
    }
    return <div key={`${r}-${c}`} className={`${baseClasses} bg-slate-800/30`} />;
  };

  const restartGame = () => {
    setBoard(createBoard());
    setScore(0);
    setLinesCleared(0);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);
    setCurrentPiece(null);
  };

  // Touch Controls for Mobile
  const touchMove = (dir: 'L' | 'R' | 'D' | 'ROT') => {
    const fakeEvent = { key: dir === 'L' ? 'ArrowLeft' : dir === 'R' ? 'ArrowRight' : dir === 'D' ? 'ArrowDown' : 'ArrowUp' } as KeyboardEvent;
    handleKeyDown(fakeEvent);
  };

  return (
    <div className="flex flex-col items-center space-y-6 animate-fadeIn w-full">
      
      {/* Score Board */}
      <div className="flex justify-between w-full max-w-[300px] px-4 text-slate-300 border-b border-slate-700 pb-2">
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase tracking-widest text-slate-500">Savings</span>
          <span className="font-serif text-lg font-bold text-white">${score}k</span>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[10px] uppercase tracking-widest text-slate-500">Strategic Goals</span>
           <span className="font-serif text-lg font-bold text-amber-400">{linesCleared} / {WIN_LINES}</span>
        </div>
      </div>

      {/* Game Grid */}
      <div className="relative p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl">
        <div className="grid grid-cols-10 gap-[1px] bg-slate-900/50">
          {board.map((row, r) => row.map((cell, c) => renderCell(r, c, cell)))}
        </div>

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center p-4 z-20">
            <h3 className="text-red-500 font-serif text-xl mb-2">Gridlock Detected</h3>
            <p className="text-slate-400 text-xs mb-4">Resources were misallocated, leading to operational stagnation.</p>
            <button onClick={restartGame} className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs uppercase tracking-widest">
              <RefreshCw className="w-3 h-3" /> <span>Re-strategize</span>
            </button>
          </div>
        )}
        
        {gameWon && (
          <div className="absolute inset-0 bg-sky-950/90 flex flex-col items-center justify-center text-center p-4 z-20">
            <h3 className="text-emerald-400 font-serif text-xl mb-2">Goals Met</h3>
            <p className="text-slate-300 text-xs">Strategic alignment achieved. Preparing analysis...</p>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-[300px]">
         <button className="p-3 bg-slate-800 rounded hover:bg-slate-700 active:bg-amber-600" onClick={() => touchMove('L')}>←</button>
         <button className="p-3 bg-slate-800 rounded hover:bg-slate-700 active:bg-amber-600" onClick={() => touchMove('D')}>↓</button>
         <button className="p-3 bg-slate-800 rounded hover:bg-slate-700 active:bg-amber-600" onClick={() => touchMove('R')}>→</button>
         <button className="p-3 bg-slate-800 rounded hover:bg-slate-700 active:bg-sky-600" onClick={() => touchMove('ROT')}>↻</button>
      </div>

      <div className="max-w-md text-center text-sm text-slate-400 px-4">
        <p className="font-serif italic mb-2">"Transformation is about fitting the right pieces in the right place."</p>
        <ul className="text-[10px] text-slate-500 space-y-1 list-disc list-inside text-left max-w-[200px] mx-auto">
          <li>Align resources to clear strategic bottlenecks.</li>
          <li>Avoid piling up operational debt.</li>
          <li>Clear 5 lines to transform the institution.</li>
        </ul>
      </div>
    </div>
  );
};
