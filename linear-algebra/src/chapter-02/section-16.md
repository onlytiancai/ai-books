### 16. Identity, Inverse, and Transpose

With addition, scalar multiplication, and matrix multiplication in place, we now introduce three special operations and objects that form the backbone of matrix algebra: the identity matrix, the inverse of a matrix, and the transpose of a matrix. Each captures a fundamental principle-neutrality, reversibility, and symmetry-and together they provide the algebraic structure that makes linear algebra so powerful.

#### The Identity Matrix

The identity matrix is the matrix equivalent of the number 1 in multiplication.

- Definition: The identity matrix $I_n$ is the $n \times n$ matrix with 1's on the diagonal and 0's everywhere else.

Example (3×3):

$$
I_3 = \begin{bmatrix} 
1 & 0 & 0 \\ 
0 & 1 & 0 \\ 
0 & 0 & 1 
\end{bmatrix}.
$$

- Property: For any $n \times n$ matrix $A$,

  $$
  AI_n = I_nA = A.
  $$

- Machine view: $I$ does nothing-it maps every vector to itself.

#### The Inverse of a Matrix

The inverse is the matrix equivalent of the reciprocal of a number.

- Definition: For a square matrix $A$, its inverse $A^{-1}$ is the matrix such that

  $$
  AA^{-1} = A^{-1}A = I.
  $$

- Not all matrices have inverses. A matrix is invertible if and only if it is square and its determinant is nonzero.

Example:

$$
A = \begin{bmatrix} 
2 & 1 \\ 
1 & 1 
\end{bmatrix}, 
\quad 
A^{-1} = \begin{bmatrix} 
1 & -1 \\ 
-1 & 2 
\end{bmatrix}.
$$

Check:

$$
AA^{-1} = \begin{bmatrix} 
2 & 1 \\ 
1 & 1 
\end{bmatrix}
\begin{bmatrix} 
1 & -1 \\ 
-1 & 2 
\end{bmatrix}
=
\begin{bmatrix} 
1 & 0 \\ 
0 & 1 
\end{bmatrix} = I.
$$

- Machine view: Applying $A$ transforms a vector. Applying $A^{-1}$ undoes that transformation, restoring the original input.

#### Non-Invertible Matrices

Some matrices cannot be inverted. These are called singular.

- Example:

  $$
  B = \begin{bmatrix} 
  2 & 4 \\ 
  1 & 2 
  \end{bmatrix}.
  $$

  Here, the second column is a multiple of the first. The transformation squashes vectors into a line, losing information-so it cannot be reversed.

This ties invertibility to geometry: a transformation that collapses dimensions cannot be undone.

#### The Transpose of a Matrix

The transpose reflects a matrix across its diagonal.

- Definition: For $A = [a_{ij}]$,

  $$
  A^T = [a_{ji}].
  $$

- In words: rows become columns, columns become rows.

Example:

$$
A = \begin{bmatrix} 
1 & 2 & 3 \\ 
4 & 5 & 6 
\end{bmatrix}, 
\quad 
A^T = \begin{bmatrix} 
1 & 4 \\ 
2 & 5 \\ 
3 & 6 
\end{bmatrix}.
$$

- Properties:

  - $(A^T)^T = A$.
  - $(A + B)^T = A^T + B^T$.
  - $(cA)^T = cA^T$.
  - $(AB)^T = B^T A^T$ (note the reversed order!).

#### Symmetric and Orthogonal Matrices

Two important classes emerge from the transpose:

- Symmetric matrices: $A = A^T$. Example:

  $$
  \begin{bmatrix} 
  2 & 3 \\ 
  3 & 5 
  \end{bmatrix}.
  $$

  These have beautiful properties: real eigenvalues and orthogonal eigenvectors.

- Orthogonal matrices: $Q^TQ = I$. Their columns form an orthonormal set, and they represent pure rotations/reflections.

#### Everyday Analogies

- Identity: A mirror that doesn't distort your reflection-it leaves everything unchanged.
- Inverse: A "reverse recipe"-if one step mixes, the inverse unmixed (where possible).
- Transpose: Reorganizing a spreadsheet by flipping rows and columns.

#### Why It Matters

1. The identity guarantees a neutral element for multiplication.
2. The inverse provides a way to solve equations $A\mathbf{x} = \mathbf{b}$ via $\mathbf{x} = A^{-1}\mathbf{b}$.
3. The transpose ties matrices to geometry, inner products, and symmetry.
4. Together, they form the algebraic foundation for deeper topics: determinants, eigenvalues, factorizations, and numerical methods.

Without these tools, matrix algebra would lack structure and reversibility.

#### Try It Yourself

1. Compute the transpose of

$$
\begin{bmatrix} 
1 & 0 & 2 \\ 
-3 & 4 & 5 
\end{bmatrix}.
$$

2. Verify that $(AB)^T = B^TA^T$ for

$$
A = \begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}, \quad 
B = \begin{bmatrix} 4 & 0 \\ 5 & 6 \end{bmatrix}.
$$

3. Find the inverse of

$$
\begin{bmatrix} 
3 & 2 \\ 
1 & 1 
\end{bmatrix}.
$$

4. Challenge: Show that if $Q$ is orthogonal, then $Q^{-1} = Q^T$. Interpret this geometrically as saying "rotations can be undone by transposing."

Through these exercises, you'll see how identity, inverse, and transpose anchor the structure of linear algebra, providing neutrality, reversibility, and symmetry in every calculation.

