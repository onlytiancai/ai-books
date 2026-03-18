### 63. Algebraic vs. Geometric Multiplicity

When studying eigenvalues, it's not enough to just find the roots of the characteristic polynomial. Each eigenvalue can appear multiple times, and this "multiplicity" can be understood in two distinct but related ways: algebraic multiplicity (how many times it appears as a root) and geometric multiplicity (the dimension of its eigenspace). These two multiplicities capture both the algebraic and geometric richness of eigenvalues.

#### Algebraic Multiplicity

The algebraic multiplicity (AM) of an eigenvalue $\lambda$ is the number of times it appears as a root of the characteristic polynomial $p_A(\lambda)$.

- If $(\lambda - \lambda_0)^k$ divides $p_A(\lambda)$, then the algebraic multiplicity of $\lambda_0$ is $k$.
- The sum of all algebraic multiplicities equals the size of the matrix ($n$).

Example:
If

$$
p_A(\lambda) = (\lambda-2)^3(\lambda+1)^2,
$$

then eigenvalue $\lambda=2$ has AM = 3, and $\lambda=-1$ has AM = 2.

#### Geometric Multiplicity

The geometric multiplicity (GM) of an eigenvalue $\lambda$ is the dimension of the eigenspace corresponding to $\lambda$:

$$
\text{GM}(\lambda) = \dim(\ker(A - \lambda I)).
$$

- This counts how many linearly independent eigenvectors correspond to $\lambda$.
- Always satisfies:

  $$
  1 \leq \text{GM}(\lambda) \leq \text{AM}(\lambda).
  $$

Example:
If

$$
A = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix},
$$

then $p_A(\lambda) = (\lambda-2)^2$.

- AM of $\lambda=2$ is 2.
- Solve $(A-2I)v=0$:

  $$
  \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} v = 0 \quad \Rightarrow \quad v = \begin{bmatrix} 1 \\ 0 \end{bmatrix}.
  $$

  Only 1 independent eigenvector.
- GM of $\lambda=2$ is 1.

#### Relationship Between the Two

- Always: $\text{GM}(\lambda) \leq \text{AM}(\lambda)$.
- If they are equal for all eigenvalues, the matrix is diagonalizable.
- If GM < AM for some eigenvalue, the matrix is defective, meaning it cannot be diagonalized, though it may still have a Jordan canonical form.

#### Geometric Meaning

- AM measures how strongly the eigenvalue is "encoded" in the polynomial.
- GM measures how much geometric freedom the eigenvalue's eigenspace provides.
- If AM > GM, the eigenvalue "wants" more independent directions than the space allows.

Think of AM as the *theoretical demand* for eigenvectors, and GM as the *actual supply*.

#### Example: Diagonalizable vs. Defective

1. Diagonalizable case:

   $$
   B = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}.
   $$

   - $p_B(\lambda) = (\lambda-2)^2$.
   - AM = 2 for eigenvalue 2.
   - GM = 2, since the eigenspace is all of $\mathbb{R}^2$.
   - Enough eigenvectors to diagonalize.

2. Defective case:
   The earlier example

   $$
   A = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}
   $$

   had AM = 2, GM = 1.

   - Not enough eigenvectors.
   - Cannot be diagonalized.

#### Everyday Analogies

- Seats vs. people: Algebraic multiplicity is the number of seats reserved for an eigenvalue; geometric multiplicity is how many actual people show up. If fewer people arrive, the system is defective.
- Promises vs. reality: AM is the theoretical promise given by the polynomial; GM is the reality of independent directions.
- Musical notes: AM is how many times a note is written in the score; GM is how many distinct instruments actually play it.

#### Applications

1. Diagonalization: Only possible when GM = AM for all eigenvalues.
2. Jordan form: Defective matrices require Jordan blocks, governed by the gap between AM and GM.
3. Differential equations: The solution form depends on multiplicity; repeated eigenvalues with fewer eigenvectors require generalized solutions.
4. Stability analysis: Multiplicities reveal degeneracies in dynamical systems.
5. Quantum mechanics: Degeneracy of eigenvalues (AM vs. GM) encodes physical symmetry.

#### Why It Matters

- Multiplicities separate algebraic roots from geometric structure.
- They decide whether diagonalization is possible.
- They reveal hidden constraints in systems with repeated eigenvalues.
- They form the basis for advanced concepts like Jordan canonical form and generalized eigenvectors.

#### Try It Yourself

1. Find AM and GM for
   $\begin{bmatrix} 3 & 1 \\ 0 & 3 \end{bmatrix}$.
2. Find AM and GM for
   $\begin{bmatrix} 3 & 0 \\ 0 & 3 \end{bmatrix}$.
   Compare with the first case.
3. Show that AM always equals the multiplicity of a root of the characteristic polynomial.
4. Challenge: Prove that for any eigenvalue, GM ≥ 1.

Algebraic and geometric multiplicity together tell the full story: the algebra tells us how many times an eigenvalue appears, while the geometry tells us how much room it really occupies in the vector space.

