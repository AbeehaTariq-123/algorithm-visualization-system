import { useState, useRef } from "react";
import { bfs } from "../algorithms/bfs";

// ── Default graph data ─────────────────────────
const DEFAULT_GRAPH = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0, 5, 6],
  3: [1],
  4: [1],
  5: [2],
  6: [2],
};

const DEFAULT_POSITIONS = {
  0: { x: 300, y: 40  },
  1: { x: 150, y: 130 },
  2: { x: 450, y: 130 },
  3: { x: 70,  y: 230 },
  4: { x: 230, y: 230 },
  5: { x: 370, y: 230 },
  6: { x: 530, y: 230 },
};

function BFSVisualizer() {

  // ── State ──────────────────────────────────────
  const [graph, setGraph]             = useState(DEFAULT_GRAPH);
  const [positions, setPositions]     = useState(DEFAULT_POSITIONS);
  const [graphInput, setGraphInput]   = useState("");
  const [startInput, setStartInput]   = useState("0");

  const [visitedNodes, setVisitedNodes] = useState([]);
  const [currentNode, setCurrentNode]   = useState(null);
  const [queueNodes, setQueueNodes]     = useState([]);

  const [message, setMessage]   = useState("");
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused]   = useState(false);
  const [speed, setSpeed]         = useState(500);

  // ── Refs (used inside async algorithm) ────────
  const isPausedRef  = useRef(false);
  const isStoppedRef = useRef(false);
  const speedRef     = useRef(500);

  function getDelay() {
    return speedRef.current;
  }

  // ── Reset all highlights ───────────────────────
  function resetVisuals() {
    setVisitedNodes([]);
    setCurrentNode(null);
    setQueueNodes([]);
    setMessage("");
  }

  // ── Load the built-in example graph ───────────
  function loadDefaultGraph() {
    stopBFS();
    setGraph(DEFAULT_GRAPH);
    setPositions(DEFAULT_POSITIONS);
    setStartInput("0");
    resetVisuals();
    setMessage("Default graph loaded. Press Start BFS.");
  }

  // ── Load a graph typed by the user ────────────
  // Expected format: "0:1,2 | 1:0,3 | 2:0"
  function loadUserGraph() {
    stopBFS();

    // Split input by "|" to get each node entry
    let entries = graphInput.split("|").map(s => s.trim()).filter(Boolean);

    if (entries.length === 0) {
      setMessage("Invalid format. Use: 0:1,2 | 1:0,3 | 2:0");
      return;
    }

    // Build the graph object from each entry
    let newGraph = {};
    entries.forEach(entry => {
      let [node, neighbors] = entry.split(":").map(s => s.trim());
      let nodeNum = parseInt(node);
      let neighborNums = neighbors
        ? neighbors.split(",").map(n => parseInt(n.trim())).filter(n => !isNaN(n))
        : [];
      newGraph[nodeNum] = neighborNums;
    });

    // Place nodes in a circle layout automatically
    let nodeList = Object.keys(newGraph).map(Number);
    let total = nodeList.length;
    let centerX = 300, centerY = 150, radius = 120;
    let newPositions = {};

    nodeList.forEach((node, i) => {
      let angle = (2 * Math.PI * i) / total - Math.PI / 2;
      newPositions[node] = {
        x: Math.round(centerX + radius * Math.cos(angle)),
        y: Math.round(centerY + radius * Math.sin(angle)),
      };
    });

    setGraph(newGraph);
    setPositions(newPositions);
    resetVisuals();
    setMessage("Graph loaded. Press Start BFS.");
  }

  // ── Start BFS ─────────────────────────────────
  async function startBFS() {

    let start = parseInt(startInput);

    if (!(start in graph)) {
      setMessage("Invalid start node");
      return;
    }

    // Reset refs and state before starting
    isStoppedRef.current = false;
    isPausedRef.current  = false;
    setIsPaused(false);
    setIsSorting(true);
    resetVisuals();

    await bfs(
      graph, start,
      setVisitedNodes, setCurrentNode, setQueueNodes,
      setMessage, getDelay, isPausedRef, isStoppedRef
    );

    setIsSorting(false);
    setIsPaused(false);
  }

  // ── Pause ──────────────────────────────────────
  function pauseBFS() {
    isPausedRef.current = true;
    setIsPaused(true);
    setMessage("Paused...");
  }

  // ── Resume ─────────────────────────────────────
  function resumeBFS() {
    isPausedRef.current = false;
    setIsPaused(false);
    setMessage("Resuming...");
  }

  // ── Stop ───────────────────────────────────────
  function stopBFS() {
    isStoppedRef.current = true;
    isPausedRef.current  = false;
    setIsSorting(false);
    setIsPaused(false);
    setCurrentNode(null);
    setQueueNodes([]);
    setVisitedNodes([]);
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

  // ── Node color logic ───────────────────────────
  function getNodeColor(node) {
    if (node === currentNode)        return "#f5a623"; // orange — currently visiting
    if (visitedNodes.includes(node)) return "#2ecc71"; // green  — already visited
    if (queueNodes.includes(node))   return "#e74c3c"; // red    — waiting in queue
    return "#0f3460";                                  // blue   — not yet reached
  }

  function getNodeTextColor(node) {
    if (node === currentNode)        return "#1a1a2e";
    if (visitedNodes.includes(node)) return "#1a1a2e";
    return "#e0e0e0";
  }

  // ── Build edge list (no duplicates) ───────────
  let nodeList = Object.keys(graph).map(Number);
  let edges = [];
  let seen = new Set();

  nodeList.forEach(node => {
    (graph[node] || []).forEach(neighbor => {
      let edgeKey = [Math.min(node, neighbor), Math.max(node, neighbor)].join("-");
      if (!seen.has(edgeKey) && positions[node] && positions[neighbor]) {
        seen.add(edgeKey);
        edges.push([node, neighbor]);
      }
    });
  });

  // ── Render ─────────────────────────────────────
  return (

    <div className="visualizer">

      <h2>Breadth-First Search Visualization</h2>

      {/* Row 1 — Graph input */}
      <div className="controls">
        <input
          type="text"
          placeholder='Custom graph e.g. "0:1,2 | 1:0,3 | 2:0"'
          value={graphInput}
          onChange={(e) => setGraphInput(e.target.value)}
        />
        <button onClick={loadUserGraph} disabled={isSorting}>
          Add Your Graph
        </button>
        <button onClick={loadDefaultGraph} disabled={isSorting}>
          Load Default Graph
        </button>
      </div>

      {/* Row 2 — Start node + BFS controls */}
      <div className="controls">
        <input
          type="number"
          placeholder="Start Node"
          value={startInput}
          onChange={(e) => setStartInput(e.target.value)}
          style={{ minWidth: "100px" }}
        />
        <button onClick={startBFS} disabled={isSorting}>
          Start BFS
        </button>
        {!isPaused ? (
          <button onClick={pauseBFS} disabled={!isSorting}>Pause</button>
        ) : (
          <button onClick={resumeBFS}>Resume</button>
        )}
        <button onClick={stopBFS} disabled={!isSorting && !isPaused}>
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

      {/* Graph SVG */}
      <div className="bfs-graph-container">
        <svg width="600" height="300" className="bfs-svg">

          {/* Draw edges */}
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={positions[a].x} y1={positions[a].y}
              x2={positions[b].x} y2={positions[b].y}
              stroke="#444" strokeWidth="2"
            />
          ))}

          {/* Draw nodes */}
          {nodeList.map(node => (
            positions[node] && (
              <g key={node}>
                <circle
                  cx={positions[node].x}
                  cy={positions[node].y}
                  r={24}
                  fill={getNodeColor(node)}
                  style={{ transition: "fill 0.3s ease" }}
                />
                <text
                  x={positions[node].x}
                  y={positions[node].y + 5}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={getNodeTextColor(node)}
                >
                  {node}
                </text>
              </g>
            )
          ))}

        </svg>
      </div>

      {/* Queue display */}
      {queueNodes.length > 0 && (
        <div className="bfs-queue">
          <span className="bfs-queue-label">Queue:</span>
          {queueNodes.map((node, i) => (
            <div key={i} className="binary-box bfs-queue-box">{node}</div>
          ))}
        </div>
      )}

      {/* Visited order */}
      {visitedNodes.length > 0 && (
        <div className="bfs-queue">
          <span className="bfs-queue-label">Visited:</span>
          {visitedNodes.map((node, i) => (
            <div key={i} className="binary-box binary-right bfs-queue-box">{node}</div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="bfs-legend">
        <span><span className="bfs-dot" style={{ background: "#f5a623" }} /> Current</span>
        <span><span className="bfs-dot" style={{ background: "#e74c3c" }} /> In Queue</span>
        <span><span className="bfs-dot" style={{ background: "#2ecc71" }} /> Visited</span>
        <span><span className="bfs-dot" style={{ background: "#0f3460" }} /> Unvisited</span>
      </div>

      <p className="binary-message">{message}</p>

    </div>

  );

}

export default BFSVisualizer;
