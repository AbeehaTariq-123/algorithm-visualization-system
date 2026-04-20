import HeapSortVisualizer from "../components/HeapSortVisualizer";

function HeapSortPage() {

  return (

    <div className="insertionSortPage">

      <h1>Heap Sort</h1>

      <p>
        Heap Sort is a comparison-based sorting algorithm that uses a binary heap
        data structure. It works in two phases: first it builds a Max Heap from
        the array, then it repeatedly extracts the largest element from the heap
        and places it at the end of the sorted portion.
      </p>

      <h3>Time Complexity</h3>

      <ul>
        <li>Best Case: O(n log n)</li>
        <li>Average Case: O(n log n)</li>
        <li>Worst Case: O(n log n)</li>
      </ul>

      <h3>Space Complexity</h3>

      <ul>
        <li>O(1) — In-place sorting</li>
      </ul>

      <HeapSortVisualizer />

    </div>

  );

}

export default HeapSortPage;
