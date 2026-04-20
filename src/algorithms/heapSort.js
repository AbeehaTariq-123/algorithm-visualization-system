export async function heapSort(
  array,
  setArray,
  setCurrentIndex,
  setCompareIndex,
  setSortedIndices,
  setMessage,
  getDelay,
  isPausedRef,
  isStoppedRef
) {
 
  let arr = [...array];
  let n = arr.length;
  let sorted = [];
 
  // Waits for current delay, then blocks while paused
  async function wait() {
    await new Promise(res => setTimeout(res, getDelay()));
    while (isPausedRef.current && !isStoppedRef.current) {
      await new Promise(res => setTimeout(res, 100));
    }
  }
 
  // Heapify a subtree rooted at index i, with heap size n
  async function heapify(arr, n, i) {
 
    if (isStoppedRef.current) return;
 
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
 
    setCurrentIndex(i);
    setMessage(`Heapifying at index ${i}...`);
    await wait();
    if (isStoppedRef.current) return;
 
    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
 
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }
 
    if (largest !== i) {
 
      setCompareIndex(largest);
      setMessage(`Swapping ${arr[i]} and ${arr[largest]}`);
      await wait();
      if (isStoppedRef.current) return;
 
      // Swap
      let temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
 
      setArray([...arr]);
      await wait();
      if (isStoppedRef.current) return;
 
      await heapify(arr, n, largest);
 
    }
 
  }
 
  // Phase 1 — Build Max Heap
  setMessage("Phase 1: Building Max Heap...");
  await wait();
  if (isStoppedRef.current) return;
 
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (isStoppedRef.current) return;
    await heapify(arr, n, i);
  }
 
  setMessage("Max Heap built! Starting extraction...");
  setCurrentIndex(null);
  setCompareIndex(null);
  await wait();
  if (isStoppedRef.current) return;
 
  // Phase 2 — Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
 
    if (isStoppedRef.current) return;
 
    setCurrentIndex(0);
    setCompareIndex(i);
    setMessage(`Moving largest element ${arr[0]} to position ${i}`);
    await wait();
    if (isStoppedRef.current) return;
 
    // Swap root (largest) with last element
    let temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
 
    setArray([...arr]);
 
    sorted.unshift(i);
    setSortedIndices([...sorted]);
 
    setCurrentIndex(null);
    setCompareIndex(null);
    await wait();
    if (isStoppedRef.current) return;
 
    // Heapify the reduced heap
    await heapify(arr, i, 0);
    if (isStoppedRef.current) return;
 
  }
 
  // Mark all as sorted
  setSortedIndices(arr.map((_, index) => index));
  setCurrentIndex(null);
  setCompareIndex(null);
  setMessage("Array is fully sorted!");
 
}