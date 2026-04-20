import BFSVisualizer from "../components/BFSVisualizer";

function BFSPage() {

  return (

    <div className="insertionSortPage">

      <h1>Breadth-First Search</h1>

      <p>
        Breadth-First Search (BFS) is a graph traversal algorithm that explores
        all nodes level by level. Starting from a source node, it visits all
        immediate neighbors first, then their neighbors, and so on. It uses a
        queue to keep track of the next nodes to visit.
      </p>

      <h3>Time Complexity</h3>

      <ul>
        <li>Best Case: O(V + E)</li>
        <li>Average Case: O(V + E)</li>
        <li>Worst Case: O(V + E)</li>
      </ul>

      <h3>Space Complexity</h3>

      <ul>
        <li>O(V) — Queue stores at most V nodes</li>
      </ul>

      <p style={{ fontSize: "0.85rem", color: "#888", marginTop: "-8px" }}>
        V = number of vertices, E = number of edges
      </p>

      <BFSVisualizer />

    </div>

  );

}

export default BFSPage;
