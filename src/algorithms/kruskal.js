// Union-Find helpers
function makeSet(n) {
  let parent = {};
  let rank = {};
  for (let i = 0; i < n; i++) {
    parent[i] = i;
    rank[i] = 0;
  }
  return { parent, rank };
}

function find(parent, x) {
  if (parent[x] !== x) {
    parent[x] = find(parent, parent[x]);
  }
  return parent[x];
}

function union(parent, rank, x, y) {
  let px = find(parent, x);
  let py = find(parent, y);
  if (px === py) return false;
  if (rank[px] < rank[py]) {
    parent[px] = py;
  } else if (rank[px] > rank[py]) {
    parent[py] = px;
  } else {
    parent[py] = px;
    rank[px]++;
  }
  return true;
}

export async function kruskal(
  nodes,
  edges,
  setMSTEdges,
  setRejectedEdges,
  setCurrentEdge,
  setSortedEdges,
  setMessage,
  getDelay,
  isPausedRef,
  isStoppedRef
) {

  async function wait() {
    await new Promise(res => setTimeout(res, getDelay()));
    while (isPausedRef.current && !isStoppedRef.current) {
      await new Promise(res => setTimeout(res, 100));
    }
  }

  // Step 1 — Sort edges by weight
  let sorted = [...edges].sort((a, b) => a.weight - b.weight);
  setSortedEdges(sorted);
  setMessage("Step 1: Edges sorted by weight. Starting to build MST...");
  await wait();
  if (isStoppedRef.current) return;

  let { parent, rank } = makeSet(nodes);
  let mst = [];
  let rejected = [];

  // Step 2 — Process each edge
  for (let edge of sorted) {

    if (isStoppedRef.current) return;

    setCurrentEdge(edge);
    setMessage(`Checking edge ${edge.from} — ${edge.to} (weight ${edge.weight})`);
    await wait();
    if (isStoppedRef.current) return;

    let canAdd = union(parent, rank, edge.from, edge.to);

    if (canAdd) {
      mst.push(edge);
      setMSTEdges([...mst]);
      setMessage(`✓ Added edge ${edge.from} — ${edge.to} (weight ${edge.weight}) to MST`);
    } else {
      rejected.push(edge);
      setRejectedEdges([...rejected]);
      setMessage(`✗ Skipped edge ${edge.from} — ${edge.to} — would create a cycle`);
    }

    await wait();
    if (isStoppedRef.current) return;

  }

  let totalWeight = mst.reduce((sum, e) => sum + e.weight, 0);
  setCurrentEdge(null);
  setMessage(`MST complete! Total edges: ${mst.length} | Total weight: ${totalWeight}`);

}
