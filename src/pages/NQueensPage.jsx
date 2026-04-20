import NQueensVisualizer from "../components/NQueensVisualizer";

function NQueensPage() {

  return (

    <div className="insertionSortPage">

      <h1>N-Queens Problem</h1>

      <p>
        The N-Queens problem asks: how can N chess queens be placed on an N×N
        chessboard so that no two queens threaten each other? No two queens can
        share the same row, column, or diagonal. It is solved using backtracking —
        placing queens row by row and backtracking whenever a conflict is found.
      </p>

      <h3>Time Complexity</h3>

      <ul>
        <li>Worst Case: O(N!)</li>
        <li>With pruning it is significantly faster in practice</li>
      </ul>

      <h3>Space Complexity</h3>

      <ul>
        <li>O(N²) — the board</li>
      </ul>

      <NQueensVisualizer />

    </div>

  );

}

export default NQueensPage;
