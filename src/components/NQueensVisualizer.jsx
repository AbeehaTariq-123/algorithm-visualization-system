import { useState, useRef } from "react";
import { nQueens } from "../algorithms/nQueens";

function NQueensVisualizer() {

  // ── State ──────────────────────────────────────
  const [n, setN]           = useState(6);         // board size
  const [board, setBoard]   = useState([]);         // 2D array of 0s and 1s
  const [solutions, setSolutions] = useState(0);   // how many solutions found

  const [currentRow, setCurrentRow]       = useState(null); // cell being tried
  const [currentCol, setCurrentCol]       = useState(null);
  const [conflictCells, setConflictCells] = useState([]);   // cells causing conflict

  const [message, setMessage]     = useState("");
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused]   = useState(false);
  const [speed, setSpeed]         = useState(300);

  // ── Refs (readable inside async algorithm) ─────
  const isPausedRef  = useRef(false);
  const isStoppedRef = useRef(false);
  const speedRef     = useRef(300);

  function getDelay() {
    return speedRef.current;
  }

  // ── Reset board highlights ─────────────────────
  function resetVisuals() {
    setBoard(Array.from({ length: n }, () => Array(n).fill(0)));
    setSolutions(0);
    setCurrentRow(null);
    setCurrentCol(null);
    setConflictCells([]);
    setMessage("");
  }

  // ── Start the algorithm ────────────────────────
  async function startAlgo() {

    isStoppedRef.current = false;
    isPausedRef.current  = false;
    setIsPaused(false);
    setIsSorting(true);
    resetVisuals();

    await nQueens(
      n,
      setBoard,
      setCurrentRow,
      setCurrentCol,
      setConflictCells,
      setSolutions,
      setMessage,
      getDelay,
      isPausedRef,
      isStoppedRef
    );

    setIsSorting(false);
    setIsPaused(false);
  }

  // ── Pause ──────────────────────────────────────
  function pauseAlgo() {
    isPausedRef.current = true;
    setIsPaused(true);
    setMessage("Paused...");
  }

  // ── Resume ─────────────────────────────────────
  function resumeAlgo() {
    isPausedRef.current = false;
    setIsPaused(false);
    setMessage("Resuming...");
  }

  // ── Stop ───────────────────────────────────────
  function stopAlgo() {
    isStoppedRef.current = true;
    isPausedRef.current  = false;
    setIsSorting(false);
    setIsPaused(false);
    setCurrentRow(null);
    setCurrentCol(null);
    setConflictCells([]);
    setMessage("Stopped.");
  }

  // ── Board size changed ─────────────────────────
  function handleBoardSizeChange(e) {
    stopAlgo();
    setN(Number(e.target.value));
    setBoard([]);
    setSolutions(0);
    setMessage("");
  }

  // ── Speed label ────────────────────────────────
  function getSpeedLabel() {
    if (speed <= 100) return "Fast";
    if (speed <= 400) return "Medium";
    return "Slow";
  }

  function handleSpeedChange(e) {
    const val = Number(e.target.value);
    setSpeed(val);
    speedRef.current = val;
  }

  // ── Cell CSS class ─────────────────────────────
  function getCellClass(r, c) {
    let isQueen    = board[r] && board[r][c] === 1;
    let isCurrent  = r === currentRow && c === currentCol;
    let isConflict = conflictCells.some(cc => cc.r === r && cc.c === c);
    let isDark     = (r + c) % 2 === 1;

    if (isCurrent)  return "nq-cell nq-current";
    if (isConflict) return "nq-cell nq-conflict";
    if (isQueen)    return "nq-cell nq-queen";
    return `nq-cell ${isDark ? "nq-dark" : "nq-light"}`;
  }

  // Cell size shrinks for bigger boards
  let cellSize = Math.min(54, Math.floor(420 / n));

  // ── Render ─────────────────────────────────────
  return (

    <div className="visualizer">

      <h2>N-Queens Visualization</h2>

      {/* Row 1 — Board size slider */}
      <div className="controls">
        <div className="speed-label">
          <span>Board Size (N): <strong>{n}</strong></span>
          <div className="speed-row">
            <span>4</span>
            <input
              type="range" min="4" max="10" step="1"
              value={n}
              onChange={handleBoardSizeChange}
              disabled={isSorting}
            />
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Row 2 — Start / Pause / Stop */}
      <div className="controls">
        <button onClick={startAlgo} disabled={isSorting}>Start</button>
        {!isPaused ? (
          <button onClick={pauseAlgo} disabled={!isSorting}>Pause</button>
        ) : (
          <button onClick={resumeAlgo}>Resume</button>
        )}
        <button onClick={stopAlgo} disabled={!isSorting && !isPaused}>Stop</button>
      </div>

      {/* Row 3 — Speed slider */}
      <div className="controls">
        <div className="speed-label">
          <span>Speed: <strong>{getSpeedLabel()}</strong></span>
          <div className="speed-row">
            <span>Fast</span>
            <input
              type="range" min="50" max="800" step="50"
              value={speed}
              onChange={handleSpeedChange}
            />
            <span>Slow</span>
          </div>
        </div>
      </div>

      {/* Solutions counter — only shows when at least 1 found */}
      {solutions > 0 && (
        <div className="nq-solutions">
          Solutions found so far: <strong>{solutions}</strong>
        </div>
      )}

      {/* Chess board */}
      <div className="nq-board-wrapper">
        <div
          className="nq-board"
          style={{ gridTemplateColumns: `repeat(${n}, ${cellSize}px)` }}
        >
          {board.length === n && board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={getCellClass(r, c)}
                style={{ width: cellSize, height: cellSize, fontSize: cellSize * 0.5 }}
              >
                {cell === 1 ? "♛" : ""}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bfs-legend">
        <span><span className="bfs-dot" style={{ background: "#f5a623" }} /> Trying</span>
        <span><span className="bfs-dot" style={{ background: "#4a90d9" }} /> Queen Placed</span>
        <span><span className="bfs-dot" style={{ background: "#e74c3c" }} /> Conflict</span>
      </div>

      <p className="binary-message">{message}</p>

    </div>

  );

}

export default NQueensVisualizer;
