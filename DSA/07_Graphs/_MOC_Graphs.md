---
title: "Graphs — Map of Content"
tags: [MOC, DSA, graphs]
domain: DSA
created: 2026-07-26
---

# 🕸️ Graphs — Map of Content

> [!abstract] What This Section Covers
> Graphs are the most general data structure in DSA — any relationship between entities can be modelled as a graph. This section moves from representation choices (adjacency list vs matrix) through traversal (BFS, DFS, grid/island traversal, Eulerian paths), connectivity (Union-Find, strongly connected components, articulation points & bridges), shortest paths (Dijkstra, Bellman-Ford, Floyd-Warshall, A*), ordering and spanning trees (topological sort, MST), tree queries (lowest common ancestor), and the flow/matching family (network flow, bipartite matching). Together these seventeen notes cover the algorithm families that appear most often in interviews and competitive programming graph problems.

## Concept Map

```mermaid
graph TD
    G["🕸️ Graphs"]

    G --> REP["Representation"]
    G --> TRAV["Traversal"]
    G --> CONN["Connectivity"]
    G --> SP["Shortest Path"]
    G --> ORD["Ordering + MST"]
    G --> ADV["Flow, Matching & Trees"]

    REP --> GR["[[Graph_Representation]]"]

    TRAV --> BFS["[[BFS]]"]
    TRAV --> DFS["[[DFS]]"]
    TRAV --> ISL["[[Island_Traversal]]"]
    TRAV --> EUL["[[Eulerian_Path_and_Circuit]]"]

    CONN --> UF["[[Union_Find]]"]
    CONN --> SCC["[[Strongly_Connected_Components]]"]
    CONN --> APB["[[Articulation_Points_and_Bridges]]"]

    SP --> DIJ["[[Dijkstra]]"]
    SP --> BF["[[Bellman_Ford]]"]
    SP --> FW["[[Floyd_Warshall]]"]
    SP --> AST["[[A_Star_Search]]"]

    ORD --> TS["[[Topological_Sort]]"]
    ORD --> MST["[[Minimum_Spanning_Tree]]"]

    ADV --> NF["[[Network_Flow]]"]
    ADV --> BPM["[[Bipartite_Matching]]"]
    ADV --> LCA["[[Lowest_Common_Ancestor]]"]
```

## Learning Path

1. [[Graph_Representation]] — Adjacency list vs matrix; directed vs undirected; weighted vs unweighted
2. [[BFS]] — Level-order traversal, shortest path in unweighted graphs, visited tracking
3. [[DFS]] — Recursive and iterative DFS, cycle detection, connected components
4. [[Union_Find]] — Disjoint set union with path compression and union by rank
5. [[Dijkstra]] — Greedy single-source shortest path for non-negative weights
6. [[Topological_Sort]] — Kahn's BFS-based algorithm and DFS post-order for DAGs
7. [[Bellman_Ford]] — Dynamic programming SSSP; handles negative weights, detects negative cycles
8. [[Floyd_Warshall]] — All-pairs shortest path via DP in O(V³)
9. [[Minimum_Spanning_Tree]] — Prim's and Kruskal's algorithms; spanning tree cost minimisation
10. [[Island_Traversal]] — Grid-as-graph BFS/DFS; connected components / flood fill on matrices
11. [[Eulerian_Path_and_Circuit]] — Degree conditions; Hierholzer's algorithm to walk every edge once
12. [[Strongly_Connected_Components]] — Tarjan's and Kosaraju's algorithms; condensation DAG
13. [[Articulation_Points_and_Bridges]] — DFS low-link values to find cut vertices and critical edges
14. [[A_Star_Search]] — Heuristic-guided shortest path; admissibility/consistency; Dijkstra generalised
15. [[Lowest_Common_Ancestor]] — Binary lifting and Euler-tour + RMQ for O(log n) / O(1) LCA queries
16. [[Network_Flow]] — Max-flow/min-cut; Ford-Fulkerson, Edmonds-Karp, Dinic's algorithm
17. [[Bipartite_Matching]] — Maximum bipartite matching via augmenting paths (Hungarian / Hopcroft-Karp)

## All Notes at a Glance

| Note | Summary | Difficulty |
|------|---------|------------|
| [[Graph_Representation]] | Adjacency list / matrix tradeoffs, edge list | Beginner |
| [[BFS]] | Queue-based level traversal, SSSP in unweighted graphs | Beginner |
| [[DFS]] | Stack/recursion traversal, cycle detection, components | Beginner |
| [[Union_Find]] | DSU with path compression; O(α) operations | Intermediate |
| [[Dijkstra]] | Priority-queue greedy SSSP; O((V+E) log V) | Intermediate |
| [[Bellman_Ford]] | Relax-all-edges V-1 times; O(VE) | Intermediate |
| [[Floyd_Warshall]] | DP matrix for all-pairs shortest paths; O(V³) | Intermediate |
| [[Topological_Sort]] | Linear ordering of DAG nodes; cycle detection | Intermediate |
| [[Minimum_Spanning_Tree]] | Prim (greedy) + Kruskal (Union-Find) | Intermediate |
| [[Island_Traversal]] | Grid-as-graph BFS/DFS; flood fill; connected components on a matrix | Intermediate |
| [[Eulerian_Path_and_Circuit]] | Degree conditions + Hierholzer's algorithm to traverse every edge once | Intermediate |
| [[Strongly_Connected_Components]] | Tarjan / Kosaraju; condensation DAG | Advanced |
| [[Articulation_Points_and_Bridges]] | DFS low-link cut vertices and critical bridges | Advanced |
| [[A_Star_Search]] | Heuristic-guided shortest path; admissible/consistent heuristics | Advanced |
| [[Lowest_Common_Ancestor]] | Binary lifting / Euler tour + RMQ; O(log n)–O(1) queries | Advanced |
| [[Network_Flow]] | Max-flow/min-cut; Ford-Fulkerson, Edmonds-Karp, Dinic | Advanced |
| [[Bipartite_Matching]] | Augmenting-path matching; Hungarian / Hopcroft-Karp | Advanced |

## Key Questions This Section Answers

- When should you use BFS vs DFS — what problem property decides it?
- Why does Dijkstra fail with negative-weight edges, and how does Bellman-Ford fix this?
- When is Union-Find preferable to a DFS connectivity check?
- What property of the graph makes topological sort possible, and what breaks it?
- How do Prim's and Kruskal's algorithms differ in implementation and best use case?
- What is the complexity tradeoff between adjacency list and adjacency matrix?

## Related Sections

- [[_MOC_DSA_Master|↑ DSA Master MOC]]
- [[_MOC_Trees]] — Trees are a special case of graphs (acyclic connected)
- [[_MOC_Heaps]] — Heaps power Dijkstra's priority queue
- [[_MOC_Competitive_Programming]] — Advanced graph techniques (Fenwick Tree, Segment Tree on graphs)

#MOC #DSA #graphs
