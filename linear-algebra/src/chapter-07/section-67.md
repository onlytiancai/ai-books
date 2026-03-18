### 67. Defective Matrices and Jordan Form (a Glimpse)

Not every matrix can be simplified all the way into a diagonal form. Some matrices, while having repeated eigenvalues, do not have enough independent eigenvectors to span the entire space. These are called defective matrices. Understanding them requires introducing the Jordan canonical form, a generalization of diagonalization that handles these tricky cases.

#### Defective Matrices

A square matrix $A \in \mathbb{R}^{n \times n}$ is called defective if:

- It has an eigenvalue $\lambda$ with algebraic multiplicity (AM) strictly larger than its geometric multiplicity (GM).
- Equivalently, $A$ does not have enough linearly independent eigenvectors to form a full basis of $\mathbb{R}^n$.

Example:

$$
A = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}.
$$

- Characteristic polynomial: $(\lambda - 2)^2$, so AM = 2.
- Solving $(A - 2I)v = 0$:

  $$
  \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}v = 0 \quad \Rightarrow \quad v = \begin{bmatrix} 1 \\ 0 \end{bmatrix}.
  $$

  Only one independent eigenvector → GM = 1.
- Since GM < AM, this matrix is defective.

Defective matrices cannot be diagonalized.

#### Why Defective Matrices Exist

Diagonalization requires one independent eigenvector per eigenvalue copy. But sometimes the matrix "collapses" those directions together, producing fewer eigenvectors than expected.

- Think of it like having multiple musical notes written in the score (AM), but fewer instruments available to play them (GM).
- The matrix "wants" more independent directions, but the geometry of its null spaces prevents that.

#### Jordan Canonical Form (Intuition)

While defective matrices cannot be diagonalized, they can still be put into a nearly diagonal form called the Jordan canonical form (JCF):

$$
J = P^{-1} A P,
$$

where $J$ consists of Jordan blocks:

$$
J_k(\lambda) = \begin{bmatrix} 
\lambda & 1 & 0 & \cdots & 0 \\
0 & \lambda & 1 & \cdots & 0 \\
0 & 0 & \lambda & \cdots & 0 \\
\vdots & \vdots & \vdots & \ddots & 1 \\
0 & 0 & 0 & \cdots & \lambda
\end{bmatrix}.
$$

Each block corresponds to one eigenvalue $\lambda$, with 1s on the superdiagonal indicating the lack of independent eigenvectors.

- If every block is $1 \times 1$, the matrix is diagonalizable.
- If larger blocks appear, the matrix is defective.

#### Example: Jordan Block of Size 2

The earlier defective example

$$
A = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}
$$

has Jordan form

$$
J = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}.
$$

Notice it is already in Jordan form: one block of size 2 for eigenvalue 2.

#### Powers of Jordan Blocks

A key property is how powers behave. For

$$
J = \begin{bmatrix} \lambda & 1 \\ 0 & \lambda \end{bmatrix},
$$

$$
J^k = \begin{bmatrix} \lambda^k & k\lambda^{k-1} \\ 0 & \lambda^k \end{bmatrix}.
$$

- Unlike diagonal matrices, extra polynomial terms in $k$ appear.
- This explains why defective matrices produce behavior like growth proportional to $k \lambda^{k-1}$.

#### Geometric Meaning

- Eigenvectors describe invariant lines.
- When there aren't enough eigenvectors, Jordan form encodes chains of generalized eigenvectors.
- Each chain captures how the matrix transforms vectors slightly off the invariant line, nudging them along directions linked together by the Jordan block.

So while a diagonalizable matrix decomposes space into neat independent directions, a defective matrix entangles some directions together, forcing them into chains.

#### Everyday Analogies

- Orchestra analogy: A diagonalizable matrix has one instrument per note. A defective matrix has fewer instruments, so some notes must be "shared" in harmonies, represented by chains.
- River flow: Instead of independent straight channels, some currents merge and pull each other, causing dependencies.
- Office hierarchy: Instead of each manager having their own team (independent eigenvectors), some teams overlap, producing chains of influence.

#### Applications

1. Differential Equations: Jordan blocks determine the appearance of extra polynomial factors (like $t e^{\lambda t}$) in solutions.
2. Markov Chains: Non-diagonalizable transition matrices produce slower convergence to steady states.
3. Numerical Analysis: Algorithms may fail or slow down if the system matrix is defective.
4. Control Theory: Stability depends not just on eigenvalues, but on whether the matrix is diagonalizable.
5. Quantum Mechanics: Degenerate eigenvalues require Jordan analysis to fully describe states.

#### Why It Matters

- Diagonalization is not always possible, and defective matrices are the exceptions.
- Jordan form is the universal fallback: every square matrix has one, and it generalizes diagonalization.
- It introduces generalized eigenvectors, which extend the reach of spectral theory.

#### Try It Yourself

1. Verify that
   $\begin{bmatrix} 3 & 1 \\ 0 & 3 \end{bmatrix}$
   is defective. Find its Jordan form.
2. Show that for a Jordan block of size 3,

   $$
   J^k = \lambda^k I + k \lambda^{k-1} N + \frac{k(k-1)}{2}\lambda^{k-2} N^2,
   $$

   where $N$ is the nilpotent part (matrix with 1s above diagonal).
3. Compare the behavior of $A^k$ for a diagonalizable vs. a defective matrix with the same eigenvalues.
4. Challenge: Prove that every square matrix has a Jordan form over the complex numbers.

Defective matrices and Jordan form show us that even when eigenvectors are "insufficient," we can still impose structure, capturing how linear transformations behave in their most fundamental building blocks.

