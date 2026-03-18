### 56. Invertibility and Zero Determinant

The determinant is more than a geometric scale factor-it is the ultimate test of whether a matrix is invertible. A square matrix $A \in \mathbb{R}^{n \times n}$ has an inverse if and only if its determinant is nonzero. When the determinant vanishes, the matrix collapses space into a lower dimension, losing information that no transformation can undo.

#### The Criterion

$$
A \text{ invertible } \iff \det(A) \neq 0.
$$

- If $\det(A) \neq 0$, the transformation stretches or shrinks space but never flattens it. Every output corresponds to exactly one input, so $A^{-1}$ exists.
- If $\det(A) = 0$, some directions are squashed into lower dimensions. Information is destroyed, so no inverse exists.

#### Geometric Meaning

1. In 2D:

   - A nonzero determinant means the unit square is sent to a parallelogram with nonzero area.
   - A zero determinant means the square collapses into a line segment or a point.

2. In 3D:

   - Nonzero determinant → unit cube becomes a 3D parallelepiped with volume.
   - Zero determinant → cube flattens into a sheet or a line; 3D volume is lost.

3. In Higher Dimensions:

   - Nonzero determinant preserves n-dimensional volume.
   - Zero determinant collapses dimension, destroying invertibility.

#### Algebraic Meaning

- The determinant is the product of eigenvalues:

  $$
  \det(A) = \lambda_1 \lambda_2 \cdots \lambda_n.
  $$

  If any eigenvalue is zero, then $\det(A) = 0$ and the matrix is singular (not invertible).
- Equivalently, a zero determinant means the matrix has linearly dependent columns or rows. This dependence implies redundancy: not all directions are independent, so the mapping cannot be one-to-one.

#### Connection with Linear Systems

- If $\det(A) \neq 0$:

  - The system $Ax = b$ has a unique solution for every $b$.
  - The inverse matrix $A^{-1}$ exists and satisfies $x = A^{-1}b$.

- If $\det(A) = 0$:

  - Either no solutions (inconsistent system) or infinitely many solutions (dependent equations).
  - The mapping $x \mapsto Ax$ cannot be reversed.

#### Example: Invertible vs. Singular

1.

$$
A = \begin{bmatrix} 2 & 1 \\ 1 & 3 \end{bmatrix}, \quad \det(A) = 5 \neq 0.
$$

Invertible.

2.

$$
B = \begin{bmatrix} 2 & 4 \\ 1 & 2 \end{bmatrix}, \quad \det(B) = 0.
$$

Not invertible, since the second column is just twice the first.

#### Everyday Analogies

- Shadows: Projecting a 3D object onto a 2D wall loses depth information. This is like a determinant of 0: flattening makes inversion impossible.
- Recipes: If two ingredients are exact multiples of each other, you don't really have two independent "flavors." The recipe loses uniqueness.
- Maps: A detailed city map shrunk to a single line loses all spatial information. You cannot reconstruct the city from the line.

#### Applications

1. Solving Systems: Inverse-based methods rely on nonzero determinants.
2. Numerical Methods: Detecting near-singularity warns of unstable solutions.
3. Geometry: A singular matrix corresponds to degenerate shapes (flattened, collapsed).
4. Physics: In mechanics and relativity, invertibility ensures that transformations can be reversed.
5. Computer Graphics: Non-invertible transformations crush dimensions, breaking rendering pipelines.

#### Why It Matters

- Determinants provide a single scalar test for invertibility.
- This connects geometry (volume collapse), algebra (linear dependence), and analysis (solvability of systems).
- The zero/nonzero divide is one of the sharpest and most important in all of linear algebra.

#### Try It Yourself

1. Determine whether

   $$
   \begin{bmatrix} 1 & 2 \\ 3 & 6 \end{bmatrix}
   $$

   is invertible. Explain both geometrically and algebraically.

2. For

   $$
   \begin{bmatrix} 1 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 0 \end{bmatrix},
   $$

   compute the determinant and describe the geometric transformation.

3. Challenge: Show that if $\det(A)=0$, the rows (or columns) of $A$ are linearly dependent.

The determinant acts as the ultimate yes-or-no test: nonzero means full-dimensional, reversible transformation; zero means collapse and irreversibility.

