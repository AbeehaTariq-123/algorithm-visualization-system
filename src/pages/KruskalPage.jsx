import KruskalVisualizer from "../components/KruskalVisualizer";

function KruskalPage() {

  return (

    <div className="insertionSortPage">

      <h1>Kruskal's Algorithm</h1>

      <p>
        Kruskal's Algorithm finds the Minimum Spanning Tree (MST) of a weighted
        undirected graph. It works by sorting all edges by weight and greedily
        adding the smallest edge that does not form a cycle, using a Union-Find
        data structure to detect cycles efficiently.
      </p>

      <h3>Time Complexity</h3>

      <ul>
        <li>Best Case: O(E log E)</li>
        <li>Average Case: O(E log E)</li>
        <li>Worst Case: O(E log E)</li>
      </ul>

      <h3>Space Complexity</h3>

      <ul>
        <li>O(V + E) — Union-Find structure</li>
      </ul>

      <p style={{ fontSize: "0.85rem", color: "#888", marginTop: "-8px" }}>
        V = vertices, E = edges
      </p>

      <KruskalVisualizer />

    </div>

  );

}

export default KruskalPage;
