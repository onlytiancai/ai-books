### 69. Markov Chains and Steady States

Markov chains are one of the most direct and beautiful applications of eigenvalues in probability and statistics. They describe systems that evolve step by step, where the next state depends only on the current one, not on the past. The mathematics of steady states-the long-term behavior of such chains-rests firmly on eigenvalues and eigenvectors of the transition matrix.

#### Transition Matrices

A Markov chain is defined by a transition matrix $P \in \mathbb{R}^{n \times n}$ with the following properties:

1. All entries are nonnegative: $p_{ij} \geq 0$.
2. Each row sums to 1: $\sum_j p_{ij} = 1$.

If the chain is in state $i$ at time $k$, then $p_{ij}$ is the probability of moving to state $j$ at time $k+1$.

#### Evolution of States

If the probability distribution at time $k$ is a row vector $\pi^{(k)}$, then

$$
\pi^{(k+1)} = \pi^{(k)} P.
$$

After $k$ steps:

$$
\pi^{(k)} = \pi^{(0)} P^k.
$$

So understanding the long-term behavior requires analyzing $P^k$.

#### Eigenvalue Structure of Transition Matrices

- Every transition matrix $P$ has eigenvalue $\lambda = 1$.
- All other eigenvalues satisfy $|\lambda| \leq 1$.
- If the chain is irreducible (all states communicate) and aperiodic (no cyclic locking), then:

  - $\lambda=1$ is a simple eigenvalue (AM=GM=1).
  - All other eigenvalues have magnitude strictly less than 1.

This ensures convergence to a unique steady state.

#### Steady States as Eigenvectors

A steady state distribution $\pi$ satisfies:

$$
\pi = \pi P.
$$

This is equivalent to:

$$
\pi^T \text{ is a right eigenvector of } P^T \text{ with eigenvalue } 1.
$$

- The steady state vector lies in the eigenspace of eigenvalue 1.
- Since probabilities must sum to 1, normalization gives a unique steady state.

#### Example: A 2-State Markov Chain

$$
P = \begin{bmatrix} 0.7 & 0.3 \\ 0.4 & 0.6 \end{bmatrix}.
$$

- Eigenvalues: solve $\det(P-\lambda I) = 0$.

  $$
  \lambda_1 = 1, \quad \lambda_2 = 0.3.
  $$
- The steady state is found from $\pi = \pi P$:

  $$
  \pi = \bigg(\frac{4}{7}, \frac{3}{7}\bigg).
  $$
- As $k \to \infty$, any initial distribution $\pi^{(0)}$ converges to this steady state.

#### Example: Random Walk on a Graph

Take a simple graph: 3 nodes in a line, where each node passes to neighbors equally.

Transition matrix:

$$
P = \begin{bmatrix} 
0 & 1 & 0 \\ 
0.5 & 0 & 0.5 \\ 
0 & 1 & 0 
\end{bmatrix}.
$$

- Eigenvalues: $\{1, 0, -1\}$.
- The steady state corresponds to eigenvalue 1.
- After many steps, the distribution converges to $(0.25, 0.5, 0.25)$.

#### Geometric Meaning

- Eigenvalue 1: the fixed "direction" of probabilities that does not change under transitions.
- Eigenvalues < 1 in magnitude: transient modes that vanish as $k \to \infty$.
- The dominant eigenvector (steady state) is like the "center of gravity" of the system.

So powers of $P$ filter out all but the eigenvector of eigenvalue 1.

#### Everyday Analogies

- Board games: After many moves, the distribution of where players end up (like Monopoly squares) stabilizes, regardless of start.
- Web surfing: The Google PageRank algorithm is based on eigenvalue 1 of a huge transition matrix.
- Shuffling cards: With enough shuffles, the probability distribution becomes uniform-a steady state.
- Weather models: Even if today's weather matters, in the long run the system converges to a stable climate distribution.

#### Applications

1. Google PageRank: Steady state eigenvectors rank webpages.
2. Economics: Input-output models evolve like Markov chains.
3. Epidemiology: Spread of diseases can be modeled as Markov processes.
4. Machine Learning: Hidden Markov models (HMMs) underpin speech recognition and bioinformatics.
5. Queuing Theory: Customer arrivals and service evolve according to Markov dynamics.

#### Why It Matters

- The concept of steady states shows how randomness can lead to predictability.
- Eigenvalues explain why convergence happens, and at what rate.
- The link between linear algebra and probability provides one of the clearest real-world uses of eigenvectors.

#### Try It Yourself

1. For

   $$
   P = \begin{bmatrix} 0.9 & 0.1 \\ 0.5 & 0.5 \end{bmatrix},
   $$

   compute its eigenvalues and steady state.
2. Show that for any transition matrix, the largest eigenvalue is always 1.
3. Prove that if a chain is irreducible and aperiodic, the steady state is unique.
4. Challenge: Construct a 3-state transition matrix with a cycle (periodic) and show why it doesn't converge to a steady distribution until perturbed.

Markov chains and steady states are the meeting point of probability and linear algebra: randomness, when multiplied many times, is tamed by the calm persistence of eigenvalue 1.

