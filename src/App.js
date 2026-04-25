import { BrowserRouter as Router } from "react-router-dom";

import BubbleSortPage from "./Pages/BubbleSortPage";
import BinarySearchPage from "./Pages/BinarySearchPage";
import DFSPage from "./Pages/DFSPage";
import KnapsackPage from "./Pages/KnapsackPage";
import TowerOfHanoiPage from "./Pages/TowerPage";
import React, { useState } from "react";
import "./App.css";
import NQueensPage from "./Pages/NQueensPage";
import BFSPage from "./Pages/BFSPage";
import KruskalPage from "./Pages/KruskalPage";
import HeapSortPage from "./Pages/HeapSortPage";
import InsertionSortPage from "./Pages/InsertionSortPage";
import QuickSortPage from "./Pages/QuickSortPage";
import PrimsPage from "./Pages/PrimsPage";
import LinearSearchPage from "./Pages/LinearSearchPage"
import CoinChangePage from "./Pages/CoinChangePage"
import SudokuPage from "./Pages/SudokuPage";


function App() {
  const [page, setPage] = useState("home");

  const algorithms = [
    "Quick Sort", "Linear Search", "Prim's Algorithm", "Coin Change Problem", "Sudoku Solver",
    "Bubble Sort", "Binary Search", "Depth-First Search", "0/1 Knapsack Problem", "Tower of Hanoi",
    "Merge Sort", "Selection Sort", "Dijkstra's Algorithm", "Bucket Sort", "Tree Traversal",
    "Insertion Sort", "Heap Sort", "Breadth-First Search", "Kruskal's Algorithm", "N-Queens Problem"
  ];

  const algorithmPages = {
    "Bubble Sort": <BubbleSortPage />,
    "Binary Search": <BinarySearchPage />,
    "Depth-First Search": <DFSPage />,
    "0/1 Knapsack Problem": <KnapsackPage />,
    "Tower of Hanoi": <TowerOfHanoiPage />,
    "N-Queens Problem": <NQueensPage />,
    "Kruskal's Algorithm": <KruskalPage />,
    "Insertion Sort": <InsertionSortPage />,
    "Breadth-First Search": <BFSPage />,
    "Heap Sort": <HeapSortPage />,
    "Quick Sort": <QuickSortPage />,
    "Prim's Algorithm": <PrimsPage />,
    "Linear Search": <LinearSearchPage />,
    "Coin Change Problem": <CoinChangePage />,
    "Sudoku Solver": <SudokuPage />,

  };

  return (
    <Router>
      <div>
        {/* NAVBAR */}
        <nav className="navbar">
          <div className="logo">Algorithm Visualizer</div>
          <ul className="nav-links">
            <li onClick={() => setPage("home")}>Home</li>

            <li className="dropdown">
              Algorithms ▾
              <div className="dropdown-menu">
                {algorithms.map((algo, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      if (algorithmPages[algo]) {
                        setPage(algo);
                      }
                    }}
                  >
                    {algo}
                  </div>
                ))}
              </div>
            </li>

            <li onClick={() => setPage("compare")}>Compare</li>
          </ul>
        </nav>

        {/* HOME PAGE */}
        {page === "home" && (
          <div>
            {/* HERO SECTION */}
            <section className="hero">
              <h1>Algorithm Visualizer</h1>
              <p>
                Understand algorithms through step-by-step interactive
                visualizations.
              </p>
              <div className="hero-buttons">
                <button className="secondary">Compare Algorithms</button>
              </div>
            </section>

            {/* POPULAR ALGORITHMS */}
            <section className="cards">
              <h2>Popular Algorithms</h2>
              <div className="card-grid">
                <div className="card">Quick Sort</div>
                <div className="card">Merge Sort</div>
                <div className="card">Bubble Sort</div>
                <div className="card">Binary Search</div>
                <div className="card">Dijkstra's Algorithm</div>
                <div className="card">Breadth First Search</div>

              </div>
            </section>
          </div>
        )}

        {/* COMPARE PAGE */}
        {page === "compare" && (
          <div className="compare-page">
            <h1>Compare Algorithms</h1>
            <p>make table of time complexity and space complexity(to do)</p>
          </div>
        )}

        {/* ALGORITHM PAGES */}
        {Object.keys(algorithmPages).map((algo) => {
          return page === algo ? <div key={algo}>{algorithmPages[algo]}</div> : null;
        })}
      </div>
    </Router>
  );
}

export default App;
