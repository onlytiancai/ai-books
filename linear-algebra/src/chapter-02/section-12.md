### 12. Matrix Shapes, Indexing, and Block Views

Matrices come in many shapes and sizes, and the way we label their entries matters. This section is about learning how to read and write matrices carefully, how to work with rows and columns, and how to use block structure to simplify problems. These seemingly simple ideas are what allow us to manipulate large systems with precision and efficiency.

#### Shapes of Matrices

The shape of a matrix is given by its number of rows and columns:

- A m×n matrix has m rows and n columns.
- Rows run horizontally, columns run vertically.
- Square matrices have m = n; rectangular matrices have m ≠ n.

Examples:

- A 2×3 matrix:

  $$
  \begin{bmatrix} 
  1 & 2 & 3 \\ 
  4 & 5 & 6 
  \end{bmatrix}
  $$
- A 3×2 matrix:

  $$
  \begin{bmatrix} 
  7 & 8 \\ 
  9 & 10 \\ 
  11 & 12 
  \end{bmatrix}
  $$

Shape matters because it determines whether certain operations (like multiplication) are possible.

#### Indexing: The Language of Entries

Each entry in a matrix has two indices: one for its row, one for its column.

- $a_{ij}$ = entry in row i, column j.
- The first index always refers to the row, the second to the column.

For example, in

$$
A = \begin{bmatrix} 
1 & 4 & 7 \\ 
2 & 5 & 8 \\ 
3 & 6 & 9 
\end{bmatrix},
$$

we have:

- $a_{11} = 1$, $a_{23} = 8$, $a_{32} = 6$.

Indexing is the grammar of matrix language. Without it, we can't specify positions or write formulas clearly.

#### Rows and Columns as Vectors

Every row and every column of a matrix is itself a vector.

- The i-th row is written as $A_{i,*}$.
- The j-th column is written as $A_{*,j}$.

Example:
From the matrix above,

- First row: (1, 4, 7).
- Second column: (4, 5, 6).

This duality is powerful: rows often represent constraints or equations, while columns represent directions or features. Later, when we interpret matrix–vector products, we'll see that multiplying A·x means combining columns, while multiplying yᵀ·A means combining rows.

#### Submatrices

Sometimes we want just part of a matrix. A submatrix is formed by selecting certain rows and columns.

Example:
From

$$
B = \begin{bmatrix} 
2 & 4 & 6 \\ 
1 & 3 & 5 \\ 
7 & 8 & 9 
\end{bmatrix},
$$

the submatrix of the first two rows and last two columns is:

$$
\begin{bmatrix} 
4 & 6 \\ 
3 & 5 
\end{bmatrix}.
$$

Submatrices allow us to zoom in and isolate parts of a problem.

#### Block Matrices: Dividing to Conquer

Large matrices can often be broken into blocks, which are smaller submatrices arranged inside. This is like dividing a spreadsheet into quadrants.

For example:

$$
C = \begin{bmatrix} 
A_{11} & A_{12} \\ 
A_{21} & A_{22} 
\end{bmatrix},
$$

where each $A_{ij}$ is itself a smaller matrix.

This structure is useful in:

- Computation: Algorithms often process blocks instead of individual entries.
- Theory: Many proofs and factorizations rely on viewing a matrix in blocks (e.g., LU, QR, Schur decomposition).
- Applications: Partitioning data tables into logical sections.

Example: Splitting a 4×4 matrix into four 2×2 blocks helps us treat it as a "matrix of matrices."

#### Special Shapes

Some shapes of matrices are so common they deserve names:

- Row vector: 1×n matrix.
- Column vector: n×1 matrix.
- Diagonal matrix: Nonzero entries only on the diagonal.
- Identity matrix: Square diagonal matrix with 1's on the diagonal.
- Zero matrix: All entries are 0.

Recognizing these shapes saves time and clarifies reasoning.

#### Everyday Analogies

- Spreadsheets: A matrix is like a grid of cells, each with a row and column label. Indexing lets you specify exactly which cell you mean.
- Maps: Cities on a map can be located by coordinates (row, column). The same logic applies to entries in a matrix.
- Lego blocks: Just as large Lego structures are built from smaller blocks, large matrices are often analyzed by splitting into submatrices.

#### Why It Matters

Careful attention to matrix shapes, indexing, and block views ensures:

1. Precision: We can describe positions unambiguously.
2. Structure awareness: Recognizing patterns (diagonal, triangular, block) leads to more efficient computations.
3. Scalability: Block partitioning is the foundation of modern numerical linear algebra libraries, where matrices are too large to handle entry by entry.
4. Geometry: Rows and columns as vectors connect matrix structure to span, basis, and dimension.

These basic tools prepare us for multiplication, transformations, and factorization.

#### Try It Yourself

1. Write a 3×4 matrix and label the entry in row 2, column 3.
2. Extract a 2×2 submatrix from the corners of a 4×4 matrix of your choice.
3. Break a 6×6 matrix into four 3×3 blocks. How would you represent it compactly?
4. Challenge: Given

   $$
   D = \begin{bmatrix} 
   1 & 2 & 3 & 4 \\ 
   5 & 6 & 7 & 8 \\ 
   9 & 10 & 11 & 12 
   \end{bmatrix},
   $$

   write it as a block matrix with a 2×2 block in the top-left, a 2×2 block in the top-right, and a 1×4 block in the bottom row.

By practicing with shapes, indexing, and blocks, you'll develop the ability to navigate matrices not just as raw grids of numbers but as structured objects ready for deeper algebraic and geometric insights.

