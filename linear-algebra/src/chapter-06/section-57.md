### 57. Cofactor Expansion

While elimination gives a practical way to compute determinants, the cofactor expansion (also called Laplace expansion) offers a recursive definition that works for all square matrices. It expresses the determinant of an $n \times n$ matrix in terms of determinants of smaller $(n-1) \times (n-1)$ matrices. This method reveals the internal structure of determinants and serves as a bridge between theory and computation.

#### Minors and Cofactors

- The minor $M_{ij}$ of an entry $a_{ij}$ is the determinant of the submatrix obtained by deleting the $i$-th row and $j$-th column from $A$.
- The cofactor $C_{ij}$ adds a sign factor:

  $$
  C_{ij} = (-1)^{i+j} M_{ij}.
  $$

Thus each entry contributes to the determinant through its cofactor, with alternating signs arranged in a checkerboard pattern:

$$
\begin{bmatrix} 
+ & - & + & - & \cdots \\ 
- & + & - & + & \cdots \\ 
+ & - & + & - & \cdots \\ 
\vdots & \vdots & \vdots & \vdots & \ddots 
\end{bmatrix}.
$$

#### The Expansion Formula

For any row $i$:

$$
\det(A) = \sum_{j=1}^n a_{ij} C_{ij}.
$$

Or for any column $j$:

$$
\det(A) = \sum_{i=1}^n a_{ij} C_{ij}.
$$

That is, the determinant can be computed by expanding along any row or column.

#### Example: 3×3 Case

Let

$$
A = \begin{bmatrix} 
a & b & c \\ 
d & e & f \\ 
g & h & i 
\end{bmatrix}.
$$

Expanding along the first row:

$$
\det(A) = a \cdot \det \begin{bmatrix} e & f \\ h & i \end{bmatrix} 
- b \cdot \det \begin{bmatrix} d & f \\ g & i \end{bmatrix} 
+ c \cdot \det \begin{bmatrix} d & e \\ g & h \end{bmatrix}.
$$

Simplify each 2×2 determinant:

$$
= a(ei - fh) - b(di - fg) + c(dh - eg).
$$

This matches the familiar expansion formula for 3×3 determinants.

#### Why It Works

Cofactor expansion follows directly from the multilinearity and alternating rules of determinants:

- Only one element per row and per column contributes to each term.
- Signs alternate because swapping rows/columns reverses orientation.
- Recursive expansion reduces the problem size until reaching 2×2 determinants, where the formula is simple.

#### Computational Complexity

- For $n=2$, expansion is immediate.
- For $n=3$, expansion is manageable.
- For large $n$, expansion is very inefficient: computing $\det(A)$ via cofactors requires $O(n!)$ operations.

That's why in practice, elimination or LU decomposition is preferred. Cofactor expansion is best for theory, proofs, and small matrices.

#### Geometric Interpretation

Each cofactor corresponds to excluding one direction (row/column), measuring the volume of the remaining sub-parallelotope. The alternating sign keeps track of orientation. Thus the determinant is a weighted combination of contributions from all entries along a chosen row or column.

#### Everyday Analogies

- Voting system: Each candidate (matrix entry) contributes a weighted score (cofactor) to the final outcome.
- Team project: Removing one member (row/column) still leaves a sub-team whose structure influences the whole.
- Recipe adjustments: Leaving out one ingredient and adjusting the others changes the flavor, but the original dish can be reconstructed from these partial contributions.

#### Applications

1. Theoretical proofs: Cofactor expansion underlies many determinant identities.
2. Adjugate matrix: Cofactors form the adjugate used in the explicit formula for matrix inverses.
3. Eigenvalues: Characteristic polynomials use cofactor expansion.
4. Geometry: Cofactors describe signed volumes of faces of higher-dimensional shapes.

#### Why It Matters

- Cofactor expansion connects determinants across dimensions.
- It provides a universal definition independent of row operations.
- It explains why determinants behave consistently with volume, orientation, and algebraic rules.

#### Try It Yourself

1. Expand the determinant of

   $$
   \begin{bmatrix} 
   2 & 1 & 3 \\ 
   0 & -1 & 4 \\ 
   1 & 2 & 0 
   \end{bmatrix}
   $$

   along the first row.

2. Compute the same determinant by expanding along the second column. Verify the result matches.

3. Show that expanding along two different rows gives the same determinant.

4. Challenge: Prove by induction that cofactor expansion works for all $n \times n$ matrices.

Cofactor expansion is not the fastest method, but it reveals the recursive structure of determinants and explains why they hold their rich algebraic and geometric meaning.

