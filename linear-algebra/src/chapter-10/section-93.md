### 93. Graphs, Adjacency, and Laplacians (Networks via Matrices)

Linear algebra provides a powerful language for studying graphs-networks of nodes connected by edges. From social networks to electrical circuits, from the internet's structure to biological pathways, graphs appear everywhere. Matrices give graphs a numerical form, making it possible to analyze their structure using algebraic techniques.

#### Graph Basics Recap

- A graph $G = (V, E)$ has a set of vertices $V$ (nodes) and edges $E$ (connections).
- Graphs may be undirected or directed, weighted or unweighted.
- Many graph properties-connectivity, flow, clusters-can be studied through matrices.

#### The Adjacency Matrix

For a graph with $n$ vertices, the adjacency matrix $A \in \mathbb{R}^{n \times n}$ encodes connections:

$$
A_{ij} = \begin{cases} 
w_{ij}, & \text{if there is an edge from node \(i\) to node \(j\)} \\ 
0, & \text{otherwise}
\end{cases}
$$

- Unweighted graphs: entries are 0 or 1.
- Weighted graphs: entries are edge weights (distances, costs, capacities).
- Undirected graphs: $A$ is symmetric.
- Directed graphs: $A$ may be asymmetric.

The adjacency matrix is the algebraic fingerprint of the graph.

#### Powers of the Adjacency Matrix

The entry $(A^k)_{ij}$ counts the number of walks of length $k$ from node $i$ to node $j$.

- $A^2$ tells how many two-step connections exist.
- This property is used in algorithms for detecting paths, clustering, and network flow.

#### The Degree Matrix

The degree of a vertex is the number of edges connected to it (or the sum of weights in weighted graphs).

The degree matrix $D$ is diagonal:

$$
D_{ii} = \sum_j A_{ij}.
$$

This matrix measures how "connected" each node is.

#### The Graph Laplacian

The combinatorial Laplacian is defined as:

$$
L = D - A.
$$

Key properties:

- $L$ is symmetric (for undirected graphs).
- Each row sums to zero.
- The smallest eigenvalue is always 0, with eigenvector $[1, 1, \dots, 1]^T$.

The Laplacian encodes connectivity: if the graph splits into $k$ connected components, then $L$ has exactly $k$ zero eigenvalues.

#### Normalized Laplacians

Two common normalized versions are:

$$
L_{sym} = D^{-1/2} L D^{-1/2}, \quad L_{rw} = D^{-1} L.
$$

These rescale the Laplacian for applications like spectral clustering.

#### Spectral Graph Theory

Eigenvalues and eigenvectors of $A$ or $L$ reveal structure:

- Algebraic connectivity: The second-smallest eigenvalue of $L$ measures how well connected the graph is.
- Spectral clustering: Eigenvectors of $L$ partition graphs into communities.
- Random walks: Transition probabilities relate to $D^{-1}A$.

#### Example: A Simple Graph

Take a triangle graph with 3 nodes, each connected to the other two.

$$
A = \begin{bmatrix} 
0 & 1 & 1 \\ 
1 & 0 & 1 \\ 
1 & 1 & 0 
\end{bmatrix}, \quad 
D = \begin{bmatrix} 
2 & 0 & 0 \\ 
0 & 2 & 0 \\ 
0 & 0 & 2 
\end{bmatrix}, \quad 
L = \begin{bmatrix} 
2 & -1 & -1 \\ 
-1 & 2 & -1 \\ 
-1 & -1 & 2 
\end{bmatrix}.
$$

- Eigenvalues of $L$: $0, 3, 3$.
- The single zero eigenvalue confirms the graph is connected.

#### Everyday Analogies

- Social networks: Adjacency matrices track friendships; Laplacians reveal communities.
- Transportation: Nodes are cities, edges are roads; eigenvalues measure robustness of connectivity.
- Electric circuits: Laplacians act like conductance matrices, governing current flow.
- Internet links: Adjacency captures hyperlinks; spectral analysis finds central hubs.

#### Applications

1. Community Detection: Spectral clustering finds natural divisions in social or biological networks.
2. Graph Drawing: Eigenvectors of $L$ provide coordinates for visually embedding graphs.
3. Random Walks & PageRank: Transition matrices from adjacency define importance scores.
4. Physics: Laplacians appear in discrete versions of diffusion and vibration problems.
5. Machine Learning: Graph neural networks (GNNs) use Laplacians to propagate signals across graph structure.

#### Why It Matters

Graphs and matrices are two sides of the same coin: one combinatorial, one algebraic. By turning a network into a matrix, linear algebra gives us access to the full toolbox of eigenvalues, norms, and factorizations, enabling deep insights into connectivity, flow, and structure.

#### Try It Yourself

1. Compute adjacency, degree, and Laplacian matrices for a square graph (4 nodes in a cycle). Find eigenvalues of $L$.
2. Prove that the Laplacian always has at least one zero eigenvalue.
3. Show that if a graph has $k$ components, then the multiplicity of zero as an eigenvalue is exactly $k$.
4. For a random walk on a graph, derive the transition matrix $P = D^{-1}A$. Interpret its eigenvectors.

Graphs demonstrate how linear algebra stretches beyond geometry and data tables-it becomes a universal language for networks, from molecules to megacities.

