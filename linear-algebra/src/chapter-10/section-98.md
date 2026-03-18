### 98. PageRank and Random Walks (Ranking with Eigenvectors)

PageRank, the algorithm that once powered Google's search engine dominance, is a striking example of how linear algebra and eigenvectors can measure importance in a network. At its core, it models the web as a graph and asks a simple question: if you randomly surf the web forever, which pages will you visit most often?

#### The Web as a Graph

- Each web page is a node.
- Each hyperlink is a directed edge.
- The adjacency matrix $A$ encodes which pages link to which:

$$
A_{ij} = 1 \quad \text{if page \(j\) links to page \(i\)}.
$$

Why columns instead of rows? Because links flow from source to destination, and PageRank naturally arises when analyzing column-stochastic transition matrices.

#### Transition Matrix

To model random surfing, we define a column-stochastic matrix $P$:

$$
P_{ij} = \frac{1}{\text{outdeg}(j)} \quad \text{if \(j \to i\)}.
$$

- Each column sums to 1.
- $P_{ij}$ is the probability of moving from page $j$ to page $i$.
- This defines a Markov chain: a random process where the next state depends only on the current one.

If a user is on page $j$, they pick one outgoing link uniformly at random.

#### Random Walk Interpretation

Imagine a web surfer moving page by page according to $P$. After many steps, the fraction of time spent on each page converges to a steady-state distribution vector $\pi$:

$$
\pi = P \pi.
$$

This is an eigenvector equation: $\pi$ is the stationary eigenvector of $P$ with eigenvalue 1.

- $\pi_i$ is the long-run probability of being on page $i$.
- A higher $\pi_i$ means greater importance.

#### The PageRank Adjustment: Teleportation

The pure random walk has problems:

1. Dead ends: Pages with no outgoing links trap the surfer.
2. Spider traps: Groups of pages linking only to each other hoard probability mass.

Solution: add a teleportation mechanism:

- With probability $\alpha$ (say 0.85), follow a link.
- With probability $1-\alpha$, jump to a random page.

This defines the PageRank matrix:

$$
M = \alpha P + (1-\alpha)\frac{1}{n} ee^T,
$$

where $e$ is the all-ones vector.

- $M$ is stochastic, irreducible, and aperiodic.
- By the Perron–Frobenius theorem, it has a unique stationary distribution $\pi$.

#### Solving the Eigenproblem

The PageRank vector $\pi$ satisfies:

$$
M \pi = \pi.
$$

- Computing $\pi$ directly via eigen-decomposition is infeasible for billions of pages.
- Instead, use power iteration: repeatedly multiply a vector by $M$ until convergence.

This works because the largest eigenvalue is 1, and the method converges to its eigenvector.

#### Worked Example: A Tiny Web

Suppose 3 pages with links:

- Page 1 → Page 2
- Page 2 → Page 3
- Page 3 → Page 1 and Page 2

Adjacency matrix (columns = source):

$$
A = \begin{bmatrix} 
0 & 0 & 1 \\ 
1 & 0 & 1 \\ 
0 & 1 & 0 
\end{bmatrix}.
$$

Transition matrix:

$$
P = \begin{bmatrix} 
0 & 0 & 1/2 \\ 
1 & 0 & 1/2 \\ 
0 & 1 & 0 
\end{bmatrix}.
$$

With teleportation ($\alpha=0.85$), we form $M$. Power iteration quickly converges to $\pi = [0.37, 0.34, 0.29]^T$. Page 1 is ranked highest.

#### Beyond the Web

Although born in search engines, PageRank's mathematics applies broadly:

- Social networks: Rank influential users by their connections.
- Citation networks: Rank scientific papers by how they are referenced.
- Biology: Identify key proteins in protein–protein interaction networks.
- Recommendation systems: Rank products or movies via link structures.

In each case, importance is defined not by how many connections a node has, but by the importance of the nodes that point to it.

#### Computational Challenges

- Scale: Billions of pages mean $M$ cannot be stored fully; sparse matrix techniques are essential.
- Convergence: Power iteration may take hundreds of steps; preconditioning and parallelization speed it up.
- Personalization: Instead of uniform teleportation, adjust probabilities to bias toward user interests.

#### Why It Matters

PageRank illustrates a deep principle: importance emerges from connectivity. Linear algebra captures this by identifying the dominant eigenvector of a transition matrix. This idea-ranking nodes in a network by stationary distributions-has transformed search engines, social media, and science itself.

#### Try It Yourself

1. Construct a 4-page web graph and compute its PageRank manually with $\alpha = 0.85$.
2. Implement power iteration in Python or MATLAB for a small adjacency matrix.
3. Compare PageRank to simple degree counts. Notice how PageRank rewards links from important nodes more heavily.
4. Modify teleportation to bias toward a subset of pages (personalized PageRank). Observe how rankings change.

PageRank is not only a milestone in computer science history-it is a living example of how eigenvectors can capture global importance from local structure.

