export async function nQueens(
  n,
  setBoard,
  setCurrentRow,
  setCurrentCol,
  setConflictCells,
  setSolutions,
  setMessage,
  getDelay,
  isPausedRef,
  isStoppedRef
) {
 
  // ── Board and solution counter ─────────────────
  let board     = Array.from({ length: n }, () => Array(n).fill(0));
  let solutionCount = 0;
 
  // ── Wait for delay + pause support ────────────
  async function wait() {
    await new Promise(res => setTimeout(res, getDelay()));
    while (isPausedRef.current && !isStoppedRef.current) {
      await new Promise(res => setTimeout(res, 100));
    }
  }
 
  // ── Check if placing a queen at (row, col) is safe ──
  function isSafe(row, col) {
 
    // Check same column above
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) return false;
    }
 
    // Check upper-left diagonal
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }
 
    // Check upper-right diagonal
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 1) return false;
    }
 
    return true;
  }
 
  // ── Find which existing queens conflict with (row, col) ──
  function getConflicts(row, col) {
    let conflicts = [];
 
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) conflicts.push({ r: i, c: col });
    }
 
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) conflicts.push({ r: i, c: j });
    }
 
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 1) conflicts.push({ r: i, c: j });
    }
 
    return conflicts;
  }
 
  // ── Copy the board so React re-renders it ─────
  function updateBoard() {
    setBoard(board.map(row => [...row]));
  }
 
  // ── Main backtracking function ─────────────────
  async function solve(row) {
 
    if (isStoppedRef.current) return;
 
    // All rows filled — solution found!
    if (row === n) {
      solutionCount++;
      setSolutions(solutionCount);
      setMessage(`Solution #${solutionCount} found!`);
      updateBoard();
      await wait();
      return;
    }
 
    // Try placing a queen in each column of this row
    for (let col = 0; col < n; col++) {
 
      if (isStoppedRef.current) return;
 
      // Show which cell we are trying
      setCurrentRow(row);
      setCurrentCol(col);
      setMessage(`Trying Queen at row ${row}, col ${col}...`);
      await wait();
      if (isStoppedRef.current) return;
 
      if (isSafe(row, col)) {
 
        // Place the queen
        board[row][col] = 1;
        updateBoard();
        setConflictCells([]);
        setMessage(`Placed Queen at row ${row}, col ${col}`);
        await wait();
        if (isStoppedRef.current) return;
 
        // Move to next row
        await solve(row + 1);
        if (isStoppedRef.current) return;
 
        // Backtrack — remove the queen
        board[row][col] = 0;
        updateBoard();
        setMessage(`Backtracking from row ${row}, col ${col}`);
        await wait();
 
      } else {
 
        // Show the conflicting queens in red
        setConflictCells(getConflicts(row, col));
        setMessage(`Conflict at row ${row}, col ${col} — backtracking`);
        await wait();
        if (isStoppedRef.current) return;
        setConflictCells([]);
 
      }
    }
  }
 
  // ── Kick off the algorithm ─────────────────────
  setMessage(`Solving ${n}-Queens problem...`);
  await wait();
  if (isStoppedRef.current) return;
 
  await solve(0);
 
  // ── Show final result ──────────────────────────
  if (!isStoppedRef.current) {
    setCurrentRow(null);
    setCurrentCol(null);
    setConflictCells([]);
    if (solutionCount === 0) {
      setMessage(`No solution exists for ${n}-Queens.`);
    } else {
      setMessage(`Done! Found ${solutionCount} solution(s) for ${n}-Queens.`);
    }
  }
 
}