// import { useState, useRef } from "react";
// import { bubbleSort } from "../algorithms/bubbleSort";

// function BubbleSortVisualizer() {
//   const [array, setArray] = useState([50, 30, 80, 20, 60, 10]);
//   const [arrayInput, setArrayInput] = useState("");
//   const [active, setActive] = useState([]);

//   const [isPaused, setIsPaused] = useState(false);
//   const [isStopped, setIsStopped] = useState(false);

//   const pauseRef = useRef(isPaused);
//   const stopRef = useRef(isStopped);

//   function delay(ms = 400) {
//     return new Promise(res => setTimeout(res, ms));
//   }

//   function generateRandomArray() {
//     let arr = [];
//     for (let i = 0; i < 10; i++) arr.push(Math.floor(Math.random() * 200) + 20);
//     setArray(arr);
//   }

//   function loadUserArray() {
//     let arr = arrayInput
//       .split(",")
//       .map(num => parseInt(num.trim()))
//       .filter(num => !isNaN(num));
//     setArray(arr);
//   }

//   async function startSort() {
//     setIsPaused(false);
//     setIsStopped(false);
//     pauseRef.current = false;
//     stopRef.current = false;

//     setMessage("Starting Bubble Sort...");
//     await bubbleSort(array, setArray, setActive, delay, pauseRef, stopRef, setMessage);
//     if (!stopRef.current) setMessage("Sorting completed!");
//     else setMessage("Sorting stopped");
//   }

//   const handlePauseResume = () => {
//     setIsPaused(prev => {
//       pauseRef.current = !prev;
//       return !prev;
//     });
//   };

//   const handleStop = () => {
//     setIsStopped(true);
//     stopRef.current = true;
//   };

//   return (
//     <div className="visualizer">
//       <h2>Bubble Sort Visualization</h2>

//       <div className="controls">
//         <input
//           type="text"
//           placeholder="Enter array (e.g. 50,30,80,20)"
//           value={arrayInput}
//           onChange={e => setArrayInput(e.target.value)}
//         />
//         <button onClick={loadUserArray}>Add Your Array</button>
//         <button onClick={generateRandomArray}>Generate Random Array</button>
//       </div>


//       <div className="array-container"> 
//         {array.map((value, index) => (
//           <div
//             key={index}
//             className={`bar ${active.includes(index) ? "active" : ""}`}
//             style={{
//               height: `${value}px`,
//               width: "40px",
//               backgroundColor: active.includes(index) ? "#f39c12" : "#3498db",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",  // <-- center the number vertically
//               color: "#fff",
//               fontWeight: "bold",
//               borderRadius: "4px",
//             }}
//           >
//             {value}
//           </div>
//         ))}
//       </div>

//       <div className="controls">
//         <button onClick={startSort}>Start Sort</button>
//         <button onClick={handlePauseResume}>{isPaused ? "Resume" : "Pause"}</button>
//         <button onClick={handleStop}>Stop</button>
//       </div>
//     </div>
//   );
// }

// export default BubbleSortVisualizer;




// 





// 








import { useState, useRef } from "react";
import { bubbleSort } from "../algorithms/bubbleSort";

function BubbleSortVisualizer() {

  const [array, setArray] = useState([50, 30, 80, 20, 60, 10]);
  const [arrayInput, setArrayInput] = useState("");
  const [active, setActive] = useState([]);
  const [message, setMessage] = useState("");

  const [isPaused, setIsPaused] = useState(false);

  const pauseRef = useRef(false);
  const stopRef = useRef(false);

  // Smart delay
  function delay(ms = 400) {
    return new Promise((res) => {
      const start = Date.now();

      const check = () => {
        if (stopRef.current) return res("stopped");

        if (pauseRef.current) return setTimeout(check, 50);

        if (Date.now() - start >= ms) return res();

        setTimeout(check, 50);
      };

      check();
    });
  }

  function generateRandomArray() {
    let arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(Math.floor(Math.random() * 200) + 20);
    }
    setArray(arr);
    setMessage("Random array generated");
  }

  function loadUserArray() {
    let arr = arrayInput
      .split(",")
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));

    setArray(arr);
    setMessage("User array loaded");
  }

  async function startSort() {
    if (array.length === 0) {
      setMessage("Array is empty");
      return;
    }

    pauseRef.current = false;
    stopRef.current = false;
    setIsPaused(false);

    setMessage("Starting Bubble Sort...");

    const result = await bubbleSort(
      array,
      setArray,
      setActive,
      delay,
      pauseRef,
      stopRef,
      setMessage
    );

    if (result === "stopped") {
      setMessage("Sorting stopped");
    } else {
      setMessage("Sorting completed!");
    }
  }

  const handlePauseResume = () => {
    setIsPaused(prev => {
      pauseRef.current = !prev;
      return !prev;
    });
  };

  const handleStop = () => {
    stopRef.current = true;
  };

  const maxValue = Math.max(...array, 1);

  return (
    <div className="visualizer">

      <h2>Bubble Sort Visualization</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Enter array (e.g. 50,30,80)"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
        />

        <button onClick={loadUserArray}>Add Your Array</button>
        <button onClick={generateRandomArray}>Generate Random Array</button>
      </div>

      {/* ✅ BARS */}
      <div className="array-container">
        {array.map((value, index) => {

          const height = Math.max((value / maxValue) * 250, 20);

          return (
            <div key={index} className="bar-wrapper">

              <div
                className={`bubble-bar ${active.includes(index) ? "active" : ""}`}
                style={{ height: `${height}px` }}
              ></div>

              <div className="bar-value">{value}</div>

            </div>
          );
        })}
      </div>

      <div className="controls">
        <button onClick={startSort}>Start</button>
        <button onClick={handlePauseResume}>
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button onClick={handleStop}>Stop</button>
      </div>

      <p className="message">{message}</p>

    </div>
  );
}

export default BubbleSortVisualizer;