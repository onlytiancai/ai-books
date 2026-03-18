### 64. Diagonalization

Diagonalization is one of the most powerful ideas in linear algebra. It takes a complicated matrix and, when possible, rewrites it in a simple form where its action is completely transparent. A diagonal matrix is easy to understand: it just stretches or compresses each coordinate axis by a fixed factor. If we can transform a matrix into a diagonal one, many calculations-like computing powers or exponentials-become almost trivial.

#### The Core Concept

A square matrix $A \in \mathbb{R}^{n \times n}$ is diagonalizable if there exists an invertible matrix $P$ and a diagonal matrix $D$ such that

$$
A = P D P^{-1}.
$$

- The diagonal entries of $D$ are the eigenvalues of $A$.
- The columns of $P$ are the corresponding eigenvectors.

In words: $A$ can be "rewritten" in a coordinate system made of its eigenvectors, where its action reduces to simple scaling along independent directions.

#### Why Diagonalization Matters

1. Simplifies Computations:

   - Computing powers:

     $$
     A^k = P D^k P^{-1}, \quad D^k \text{ is trivial to compute}.
     $$
   - Matrix exponential:

     $$
     e^A = P e^D P^{-1}.
     $$

     Critical in solving differential equations.

2. Clarifies Dynamics:

   - Long-term behavior of iterative processes depends directly on eigenvalues.
   - Stable vs. unstable systems can be read off from $D$.

3. Reveals Structure:

   - Tells us whether the system can be understood through independent modes.
   - Connects algebraic structure with geometry.

#### Conditions for Diagonalization

A matrix $A$ is diagonalizable if and only if it has enough linearly independent eigenvectors to form a basis for $\mathbb{R}^n$.

- Equivalently: For each eigenvalue, geometric multiplicity = algebraic multiplicity.
- Distinct eigenvalues guarantee diagonalizability, since their eigenvectors are linearly independent.

#### Example: Diagonalizable Case

Let

$$
A = \begin{bmatrix} 4 & 0 \\ 1 & 3 \end{bmatrix}.
$$

- Characteristic polynomial:

  $$
  p_A(\lambda) = (4-\lambda)(3-\lambda).
  $$

  Eigenvalues: $\lambda_1=4, \lambda_2=3$.
- Eigenvectors:

  - For $\lambda=4$: $(1,1)^T$.
  - For $\lambda=3$: $(0,1)^T$.
- Build $P = \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix}$, $D = \begin{bmatrix} 4 & 0 \\ 0 & 3 \end{bmatrix}$.
- Then $A = P D P^{-1}$.

Now, computing $A^{10}$ is easy: just compute $D^{10}$ and conjugate.

#### Example: Defective (Non-Diagonalizable) Case

$$
B = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}.
$$

- Characteristic polynomial: $(\lambda - 2)^2$.
- AM of eigenvalue 2 is 2, but GM = 1 (only one eigenvector).
- Not diagonalizable. Needs Jordan form instead.

#### Geometric Meaning

Diagonalization means we can rotate into a basis of eigenvectors where the transformation acts simply: scale each axis by its eigenvalue.

- Think of a room where the floor stretches more in one direction than another. In the right coordinate system (aligned with eigenvectors), the stretch is purely along axes.
- Without diagonalization, stretching mixes directions and is harder to describe.

#### Everyday Analogies

- Musical notes: A chord can be decomposed into independent notes. Diagonalization isolates each "note" of a transformation.
- Recipe ingredients: A dish may look complex, but diagonalization breaks it into pure ingredients.
- Business growth: A company might expand differently in separate divisions. In the right basis, each division grows independently, with its own multiplier.

#### Applications

1. Differential Equations: Solving systems of linear ODEs relies on diagonalization or Jordan form.
2. Markov Chains: Transition matrices are analyzed through diagonalization to study steady states.
3. Quantum Mechanics: Operators are diagonalized to reveal measurable states.
4. PCA (Principal Component Analysis): A covariance matrix is diagonalized to extract independent variance directions.
5. Computer Graphics: Diagonalization simplifies rotation-scaling transformations.

#### Why It Matters

Diagonalization transforms complexity into simplicity. It exposes the fundamental action of a matrix: scaling along preferred axes. Without it, understanding or computing repeated transformations would be intractable.

#### Try It Yourself

1. Diagonalize

   $$
   C = \begin{bmatrix} 1 & 1 \\ 0 & 2 \end{bmatrix}.
   $$

   Compute $C^5$ using $P D^5 P^{-1}$.
2. Show why

   $$
   \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}
   $$

   cannot be diagonalized.
3. Challenge: Prove that any symmetric real matrix is diagonalizable with an orthogonal basis.

Diagonalization is like finding the natural "language" of a matrix: once we listen in its native basis, everything becomes clear, elegant, and simple.

