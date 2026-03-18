import InsertionSortVisualizer from "../components/InsertionSortVisualizer";

function InsertionSortPage() {

  return (

    <div className="insertionSortPage">

      <h1>Insertion Sort</h1>

      <p>
        Insertion Sort is a simple sorting algorithm that builds the sorted array
        one element at a time. It picks each element from the unsorted portion and
        inserts it into its correct position in the sorted portion by shifting
        larger elements one step to the right.
      </p>

      <h3>Time Complexity</h3>

      <ul>
        <li>Best Case: O(n)</li>
        <li>Average Case: O(n²)</li>
        <li>Worst Case: O(n²)</li>
      </ul>

      <h3>Space Complexity</h3>

      <ul>
        <li>O(1) — In-place sorting</li>
      </ul>

      <InsertionSortVisualizer />

    </div>

  );

}

export default InsertionSortPage;
