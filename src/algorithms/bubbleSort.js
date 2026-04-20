
export async function bubbleSort(
  array,
  setArray,
  setActive,
  delay,
  pauseRef,
  stopRef,
  setMessage
) {
  let arr = [...array];

  // ✅ pause BEFORE starting
  while (pauseRef.current) {
    if (stopRef.current) return "stopped";
    await new Promise(r => setTimeout(r, 100));
  }

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {

      // Stop check
      if (stopRef.current) return "stopped";

      // Highlight current elements
      setActive([j, j + 1]);
      setMessage(`Comparing ${arr[j]} and ${arr[j + 1]}`);

      // Pause handling
      while (pauseRef.current) {
        if (stopRef.current) return "stopped";
        await new Promise(r => setTimeout(r, 100));
      }

      // Delay step
      let result = await delay();
      if (result === "stopped") return "stopped";

      // Swap if needed
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        setArray([...arr]);
        setMessage(`Swapped ${arr[j]} and ${arr[j + 1]}`);

        result = await delay();
        if (result === "stopped") return "stopped";
      }
    }
  }

  setActive([]);
  return "done";
}