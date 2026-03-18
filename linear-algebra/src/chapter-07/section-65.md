### 65. Powers of a Matrix

Once we know about diagonalization, one of its most powerful consequences is the ability to compute powers of a matrix efficiently. Normally, multiplying a matrix by itself repeatedly is expensive and messy. But if a matrix can be diagonalized, its powers become almost trivial to calculate. This is crucial in understanding long-term behavior of dynamical systems, Markov chains, and iterative algorithms.

#### The General Principle

If a matrix $A$ is diagonalizable, then

$$
A = P D P^{-1},
$$

where $D$ is diagonal and $P$ is invertible.

Then for any positive integer $k$:

$$
A^k = (P D P^{-1})^k = P D^k P^{-1}.
$$

Because $P^{-1}P = I$, the middle terms cancel out in the product.

- Computing $D^k$ is simple: just raise each diagonal entry to the $k$-th power.
- Thus, eigenvalues control the growth or decay of powers of the matrix.

#### Example: A Simple Diagonal Case

Let

$$
D = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}.
$$

Then

$$
D^k = \begin{bmatrix} 2^k & 0 \\ 0 & 3^k \end{bmatrix}.
$$

Each eigenvalue is raised independently to the $k$-th power.

#### Example: Using Diagonalization

Consider

$$
A = \begin{bmatrix} 4 & 0 \\ 1 & 3 \end{bmatrix}.
$$

From before, we know it diagonalizes as

$$
A = P D P^{-1}, \quad D = \begin{bmatrix} 4 & 0 \\ 0 & 3 \end{bmatrix}.
$$

So,

$$
A^k = P \begin{bmatrix} 4^k & 0 \\ 0 & 3^k \end{bmatrix} P^{-1}.
$$

Instead of multiplying $A$ by itself $k$ times, we just exponentiate the eigenvalues.

#### Long-Term Behavior

Eigenvalues reveal exactly what happens as $k \to \infty$.

- If all eigenvalues satisfy $|\lambda| < 1$, then $A^k \to 0$.
- If some eigenvalues have $|\lambda| > 1$, then $A^k$ diverges along those eigenvector directions.
- If $|\lambda| = 1$, the behavior depends on the specific structure: it may oscillate, stabilize, or remain bounded.

This explains stability in recursive systems and iterative algorithms.

#### Special Case: Markov Chains

In probability, the transition matrix of a Markov chain has eigenvalues less than or equal to 1.

- The largest eigenvalue is always $\lambda = 1$.
- As powers of the transition matrix grow, the chain converges to the eigenvector associated with $\lambda = 1$, representing the stationary distribution.

Thus, $A^k$ describes the long-run behavior of the chain.

#### Non-Diagonalizable Matrices

If a matrix is not diagonalizable, things become more complicated. Such matrices require the Jordan canonical form, where blocks can lead to terms like $k \lambda^{k-1}$.

Example:

$$
B = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}.
$$

Then

$$
B^k = \begin{bmatrix} 2^k & k 2^{k-1} \\ 0 & 2^k \end{bmatrix}.
$$

The presence of the off-diagonal entry introduces linear growth in $k$, in addition to exponential scaling.

#### Geometric Meaning

- Powers of $A$ correspond to repeated application of the linear transformation.
- Eigenvalues dictate whether directions expand, shrink, or remain steady.
- The eigenvectors mark the axes along which the repeated action is simplest to describe.

Think of stretching a rubber sheet: after each stretch, the sheet aligns more and more strongly with the dominant eigenvector.

#### Everyday Analogies

- Interest rates: If you repeatedly apply interest, the growth multiplies exponentially, just like powers of eigenvalues.
- Echoes: Each echo in a room is weaker (if eigenvalues < 1) or stronger (if eigenvalues > 1).
- Business growth: Repeated investment growth is governed by the largest eigenvalue, which dominates in the long run.

#### Applications

1. Dynamical Systems: Population models, economic growth, and iterative algorithms all rely on powers of a matrix.
2. Markov Chains: Powers reveal equilibrium behavior and mixing rates.
3. Differential Equations: Discrete-time models use matrix powers to describe state evolution.
4. Computer Graphics: Repeated transformations can be analyzed via eigenvalues.
5. Machine Learning: Convergence of iterative solvers (like gradient descent with linear updates) depends on spectral radius.

#### Why It Matters

Matrix powers are the foundation of stability analysis, asymptotic behavior, and convergence. Diagonalization turns this from a brute-force multiplication into a deep, structured understanding.

#### Try It Yourself

1. Compute $A^5$ for
   $\begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$.
2. For
   $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$, compute $A^k$. What happens as $k \to \infty$?
3. Explore what happens to $A^k$ when the largest eigenvalue has absolute value < 1, = 1, and > 1.
4. Challenge: Show that if a diagonalizable matrix has eigenvalues $|\lambda_i| < 1$, then $\lim_{k \to \infty} A^k = 0$.

Powers of a matrix reveal the story of repetition: how a transformation evolves when applied again and again. They connect linear algebra to time, growth, and stability in every system that unfolds step by step.

