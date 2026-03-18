import { useState, useRef } from "react";
import { heapSort } from "../algorithms/heapSort";

function HeapSortVisualizer() {

  // ── State ──────────────────────────────────────
  const [array, setArray]               = useState([]);
  const [arrayInput, setArrayInput]     = useState("");

  const [currentIndex, setCurrentIndex] = useState(null);  // orange box
  const [compareIndex, setCompareIndex] = useState(null);  // red box
  const [sortedIndices, setSortedIndices] = useState([]);  // green boxes

  const [message, setMessage]     = useState("");
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused]   = useState(false);
  const [speed, setSpeed]         = useState(500);

  // ── Refs (readable inside async algorithm) ─────
  const isPausedRef  = useRef(false);
  const isStoppedRef = useRef(false);
  const speedRef     = useRef(500);

  function getDelay() {
    return speedRef.current;
  }

  // ── Reset highlights ───────────────────────────
  function resetVisuals() {
    setCurrentIndex(null);
    setCompareIndex(null);
    setSortedIndices([]);
    setMessage("");
  }

  // ── Generate a random array ────────────────────
  function generateRandomArray() {
    stopSort();
    let arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(Math.floor(Math.random() * 90) + 10);
    }
    setArray(arr);
    resetVisuals();
  }

  // ── Load array typed by user ───────────────────
  function loadUserArray() {
    stopSort();
    let arr = arrayInput
      .split(",")
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));
    setArray(arr);
    resetVisuals();
  }

  // ── Start sorting ──────────────────────────────
  async function startSort() {

    if (array.length === 0) {
      setMessage("Please generate or add array first");
      return;
    }

    isStoppedRef.current = false;
    isPausedRef.current  = false;
    setIsPaused(false);
    setIsSorting(true);
    resetVisuals();

    await heapSort(
      array,
      setArray,
      setCurrentIndex,
      setCompareIndex,
      setSortedIndices,
      setMessage,
      getDelay,
      isPausedRef,
      isStoppedRef
    );

    setIsSorting(false);
    setIsPaused(false);
  }

  // ── Pause ──────────────────────────────────────
  function pauseSort() {
    isPausedRef.current = true;
    setIsPaused(true);
    setMessage("Paused...");
  }

  // ── Resume ─────────────────────────────────────
  function resumeSort() {
    isPausedRef.current = false;
    setIsPaused(false);
    setMessage("Resuming...");
  }

  // ── Stop ───────────────────────────────────────
  function stopSort() {
    isStoppedRef.current = true;
    isPausedRef.current  = false;
    setIsSorting(false);
    setIsPaused(false);
    resetVisuals();
    setMessage("Stopped.");
  }

  // ── Speed label ────────────────────────────────
  function getSpeedLabel() {
    if (speed <= 200) return "Fast";
    if (speed <= 600) return "Medium";
    return "Slow";
  }

  function handleSpeedChange(e) {
    const val = Number(e.target.value);
    setSpeed(val);
    speedRef.current = val;
  }

  // ── Box color logic ────────────────────────────
  function getBoxClass(index) {
    if (index === currentIndex)          return "binary-box binary-mid";   // orange
    if (index === compareIndex)          return "binary-box binary-left";  // red
    if (sortedIndices.includes(index))   return "binary-box binary-right"; // green
    return "binary-box";                                                   // default
  }

  // ── Render ─────────────────────────────────────
  return (

    <div className="visualizer">

      <h2>Heap Sort Visualization</h2>

      {/* Row 1 — Array input */}
      <div className="controls">
        <input
          type="text"
          placeholder="Enter array (e.g. 40,10,30,20)"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
        />
        <button onClick={loadUserArray} disabled={isSorting}>
          Add Your Array
        </button>
        <button onClick={generateRandomArray} disabled={isSorting}>
          Generate Random Array
        </button>
      </div>

      {/* Row 2 — Sort controls */}
      <div className="controls">
        <button onClick={startSort} disabled={isSorting}>
          Start Sort
        </button>
        {!isPaused ? (
          <button onClick={pauseSort} disabled={!isSorting}>Pause</button>
        ) : (
          <button onClick={resumeSort}>Resume</button>
        )}
        <button onClick={stopSort} disabled={!isSorting && !isPaused}>
          Stop
        </button>
      </div>

      {/* Row 3 — Speed slider */}
      <div className="controls">
        <div className="speed-label">
          <span>Speed: <strong>{getSpeedLabel()}</strong></span>
          <div className="speed-row">
            <span>Fast</span>
            <input
              type="range" min="100" max="1000" step="100"
              value={speed}
              onChange={handleSpeedChange}
            />
            <span>Slow</span>
          </div>
        </div>
      </div>

      {/* Array boxes */}
      <div className="binary-container">
        {array.map((value, index) => (
          <div key={index} className={getBoxClass(index)}>
            {value}
          </div>
        ))}
      </div>

      <p className="binary-message">{message}</p>

    </div>

  );

}

export default HeapSortVisualizer;
