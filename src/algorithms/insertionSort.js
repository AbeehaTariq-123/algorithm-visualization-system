export async function insertionSort(
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
  let sorted = [];
 
  // Waits for current delay, then blocks while paused
  async function wait() {
    await new Promise(res => setTimeout(res, getDelay()));
    while (isPausedRef.current && !isStoppedRef.current) {
      await new Promise(res => setTimeout(res, 100));
    }
  }
 
  setMessage("Starting Insertion Sort...");
  await wait();
  if (isStoppedRef.current) return;
 
  for (let i = 1; i < arr.length; i++) {
 
    if (isStoppedRef.current) return;
 
    let key = arr[i];
    let j = i - 1;
 
    setCurrentIndex(i);
    setMessage(`Picking up element: ${key}`);
    await wait();
    if (isStoppedRef.current) return;
 
    while (j >= 0 && arr[j] > key) {
 
      if (isStoppedRef.current) return;
 
      setCompareIndex(j);
      setMessage(`Comparing ${arr[j]} > ${key}, shifting ${arr[j]} to the right`);
      await wait();
      if (isStoppedRef.current) return;
 
      arr[j + 1] = arr[j];
      j--;
 
      setArray([...arr]);
      await wait();
      if (isStoppedRef.current) return;
 
    }
 
    arr[j + 1] = key;
    setArray([...arr]);
 
    sorted.push(j + 1);
    setSortedIndices([...sorted]);
 
    setCurrentIndex(null);
    setCompareIndex(null);
    setMessage(`Inserted ${key} at position ${j + 1}`);
    await wait();
    if (isStoppedRef.current) return;
 
  }
 
  // Mark all as sorted
  setSortedIndices(arr.map((_, index) => index));
  setCurrentIndex(null);
  setCompareIndex(null);
  setMessage("Array is fully sorted!");
 
}