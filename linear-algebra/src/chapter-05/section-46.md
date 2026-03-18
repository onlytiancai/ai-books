### 46. Similarity and Conjugation

In linear algebra, different matrices can represent the same underlying transformation when written in different coordinate systems. This relationship is captured by the idea of similarity. Two matrices are similar if one is obtained from the other by a conjugation with an invertible change-of-basis matrix. This concept is central to understanding canonical forms, eigenvalue decompositions, and the deep structure of linear operators.

#### Definition of Similarity

Two $n \times n$ matrices $A$ and $B$ are called similar if there exists an invertible matrix $P$ such that:

$$
B = P^{-1}AP.
$$

- Here, $P$ represents a change of basis.
- $A$ and $B$ describe the same linear transformation, but expressed relative to different bases.

#### Conjugation as Change of Basis

Suppose $T: V \to V$ is a linear transformation and $A$ is its matrix in basis $B$. If we switch to a new basis $C$, the matrix becomes $B$. The conversion is:

$$
B = P^{-1}AP,
$$

where $P$ is the change-of-basis matrix from basis $B$ to basis $C$.

This shows that similarity is not just algebraic coincidence-it's geometric: the operator is the same, but our perspective (basis) has changed.

#### Properties Preserved Under Similarity

If $A$ and $B$ are similar, they share many key properties:

1. Determinant: $\det(A) = \det(B)$.
2. Trace: $\text{tr}(A) = \text{tr}(B)$.
3. Rank: $\text{rank}(A) = \text{rank}(B)$.
4. Eigenvalues: Same set of eigenvalues (with multiplicity).
5. Characteristic polynomial: Identical.
6. Minimal polynomial: Identical.

These invariants define the "skeleton" of a linear operator, unaffected by coordinate changes.

#### Examples

1. Rotation in the plane:
   The matrix for rotation by 90° is

   $$
   A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}.
   $$

   In another basis, the rotation might be represented by a more complicated-looking matrix, but all such matrices are similar to $A$.

2. Diagonalization:
   A matrix $A$ is diagonalizable if it is similar to a diagonal matrix $D$. That is,

   $$
   A = PDP^{-1}.
   $$

   Here, similarity reduces $A$ to its simplest form.

3. Shear transformation:
   A shear matrix $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$ is not diagonalizable, but it may be similar to a Jordan block.

#### Geometric Interpretation

- Similarity says: two matrices may look different, but they are "the same" transformation seen from different coordinate systems.
- Conjugation is the mathematical act of relabeling coordinates.
- Think of shifting your camera angle: the scene hasn't changed, only the perspective has.

#### Everyday Analogies

- Translations of stories: The same plot can be told in different languages (bases). The words differ (matrices), but the story remains identical (transformation).
- Maps and coordinates: The shape of a mountain range doesn't depend on whether we use latitude/longitude or UTM coordinates.
- Software code: The same algorithm can be written in Python or C++-different symbols, same behavior.

#### Applications

1. Diagonalization: Reducing a matrix to diagonal form (when possible) uses similarity. This simplifies powers, exponentials, and iterative analysis.
2. Jordan canonical form: Every square matrix is similar to a Jordan form, giving a complete structural classification.
3. Quantum mechanics: Operators on state spaces often change representation, but similarity guarantees invariance of spectra.
4. Control theory: Canonical forms simplify analysis of system stability and controllability.
5. Numerical methods: Eigenvalue algorithms rely on repeated similarity transformations (e.g., QR algorithm).

#### Why It Matters

1. Similarity reveals the true identity of a linear operator, independent of coordinates.
2. It allows simplification: many problems become easier in the right basis.
3. It preserves invariants, giving us tools to classify and compare operators.
4. It connects abstract algebra with concrete computations in geometry, physics, and engineering.

#### Try It Yourself

1. Show that $\begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}$ is similar to $\begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$. Why or why not?
2. Compute $P^{-1}AP$ for $A = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$ and $P = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$. Interpret the result.
3. Prove that if two matrices are similar, they must have the same trace.
4. Challenge: Show that if $A$ and $B$ are similar, then $A^k$ and $B^k$ are also similar for all integers $k \geq 0$.

Similarity and conjugation elevate linear algebra from mere calculation to structural understanding. They tell us when two seemingly different matrices are just different "faces" of the same underlying transformation.

