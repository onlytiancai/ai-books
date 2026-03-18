### 68. Stability and Spectral Radius

When a matrix is applied repeatedly-through iteration, recursion, or dynamical systems-its long-term behavior is governed not by individual entries, but by its eigenvalues. The key measure here is the spectral radius, which tells us whether repeated applications lead to convergence, oscillation, or divergence.

#### The Spectral Radius

The spectral radius of a matrix $A$ is defined as

$$
\rho(A) = \max \{ |\lambda| : \lambda \text{ is an eigenvalue of } A \}.
$$

- It is the largest absolute value among all eigenvalues.
- If $|\lambda| > 1$, the eigenvalue leads to exponential growth along its eigenvector.
- If $|\lambda| < 1$, it leads to exponential decay.
- If $|\lambda| = 1$, behavior depends on whether the eigenvalue is simple or defective.

#### Stability in Iterative Systems

Consider a recursive process:

$$
x_{k+1} = A x_k.
$$

- If $\rho(A) < 1$, then $A^k \to 0$ as $k \to \infty$. All trajectories converge to the origin.
- If $\rho(A) > 1$, then $A^k$ grows without bound along the dominant eigenvector.
- If $\rho(A) = 1$, trajectories neither vanish nor diverge but may oscillate or stagnate.

#### Example: Convergence with Small Spectral Radius

$$
A = \begin{bmatrix} 0.5 & 0 \\ 0 & 0.8 \end{bmatrix}.
$$

- Eigenvalues: $0.5, 0.8$.
- $\rho(A) = 0.8 < 1$.
- Powers $A^k$ shrink vectors to zero → stable system.

#### Example: Divergence with Large Spectral Radius

$$
B = \begin{bmatrix} 2 & 0 \\ 0 & 0.5 \end{bmatrix}.
$$

- Eigenvalues: $2, 0.5$.
- $\rho(B) = 2 > 1$.
- Powers $B^k$ explode along the eigenvector $(1,0)$.

#### Example: Oscillation with Complex Eigenvalues

$$
C = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}.
$$

- Eigenvalues: $\pm i$, both with modulus 1.
- $\rho(C) = 1$.
- System is neutrally stable: vectors rotate forever without shrinking or growing.

#### Beyond Simple Stability: Defective Cases

If a matrix has eigenvalues with $|\lambda|=1$ and is defective, extra polynomial terms in $k$ appear in $A^k$, leading to slow divergence even though $\rho(A)=1$.

Example:

$$
D = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}.
$$

- Eigenvalue: $\lambda=1$ (AM=2, GM=1).
- $\rho(D)=1$.
- Powers grow linearly with $k$:

  $$
  D^k = \begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix}.
  $$
- System is unstable, despite spectral radius equal to 1.

#### Geometric Meaning

The spectral radius measures the dominant mode of a transformation:

- Imagine stretching and rotating a rubber sheet. After many repetitions, the sheet aligns with the direction corresponding to the largest eigenvalue.
- If the stretching is less than 1, everything shrinks.
- If greater than 1, everything expands.
- If exactly 1, the system is balanced on the edge of stability.

#### Everyday Analogies

- Population dynamics: If the reproduction factor (largest eigenvalue) is below 1, a species dies out; above 1, it grows; at 1, it balances.
- Bank interest: Interest rate < 1 shrinks your balance; > 1 grows it; = 1 keeps it steady.
- Echoes in a hall: Each echo fades if $\rho<1$, persists if $\rho=1$, and grows chaotic if $\rho>1$.

#### Applications

1. Numerical Methods: Convergence of iterative solvers (e.g., Jacobi, Gauss–Seidel) depends on spectral radius < 1.
2. Markov Chains: Long-term distributions exist if the largest eigenvalue = 1 and others < 1 in magnitude.
3. Control Theory: System stability is judged by eigenvalues inside the unit circle ($|\lambda| < 1$).
4. Economics: Input-output models remain bounded only if spectral radius < 1.
5. Epidemiology: Basic reproduction number $R_0$ is essentially the spectral radius of a next-generation matrix.

#### Why It Matters

- The spectral radius condenses the entire spectrum of a matrix into a single stability criterion.
- It predicts the fate of iterative processes, from financial growth to disease spread.
- It draws a sharp boundary between decay, balance, and explosion in linear systems.

#### Try It Yourself

1. Compute the spectral radius of
   $\begin{bmatrix} 0.6 & 0.3 \\ 0.1 & 0.8 \end{bmatrix}$.
   Does the system converge?
2. Show that for any matrix norm $\|\cdot\|$,

   $$
   \rho(A) \leq \|A\|.
   $$

   (Hint: use Gelfand's formula.)
3. For
   $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$, explain why it diverges even though $\rho=1$.
4. Challenge: Prove Gelfand's formula:

   $$
   \rho(A) = \lim_{k\to\infty} \|A^k\|^{1/k}.
   $$

The spectral radius is the compass of linear dynamics: it points to stability, oscillation, or divergence, guiding us across disciplines wherever repeated transformations shape the future.

