### 81. Singular Values and SVD

The Singular Value Decomposition (SVD) is one of the most powerful tools in linear algebra. It generalizes eigen-decomposition, works for all rectangular matrices (not just square ones), and provides deep insights into geometry, computation, and data analysis. At its core, the SVD tells us that every matrix can be factored into three pieces: rotations/reflections, scaling, and rotations/reflections again.

#### Definition of SVD

For any real $m \times n$ matrix $A$, the SVD is:

$$
A = U \Sigma V^T,
$$

where:

- $U$ is an $m \times m$ orthogonal matrix (columns = left singular vectors).
- $\Sigma$ is an $m \times n$ diagonal matrix with nonnegative entries $\sigma_1 \geq \sigma_2 \geq \dots \geq 0$ (singular values).
- $V$ is an $n \times n$ orthogonal matrix (columns = right singular vectors).

Even if $A$ is rectangular or not diagonalizable, this factorization always exists.

#### Geometric Meaning

The SVD describes how $A$ transforms space:

1. First rotation/reflection: Multiply by $V^T$ to rotate or reflect coordinates into the right singular vector basis.
2. Scaling: Multiply by $\Sigma$, stretching/shrinking each axis by a singular value.
3. Second rotation/reflection: Multiply by $U$ to reorient into the output space.

Thus, $A$ acts as a rotation, followed by scaling, followed by another rotation.

#### Singular Values

- The singular values $\sigma_i$ are the square roots of the eigenvalues of $A^T A$.
- They measure how much $A$ stretches space in particular directions.
- The largest singular value $\sigma_1$ is the operator norm of $A$: the maximum stretch factor.
- If some singular values are zero, they correspond to directions collapsed by $A$.

#### Example in $\mathbb{R}^2$

Let

$$
A = \begin{bmatrix} 3 & 1 \\ 0 & 2 \end{bmatrix}.
$$

1. Compute $A^T A = \begin{bmatrix} 9 & 3 \\ 3 & 5 \end{bmatrix}$.
2. Find its eigenvalues: $\lambda_1, \lambda_2 = 10 \pm \sqrt{10}$.
3. Singular values: $\sigma_i = \sqrt{\lambda_i}$.
4. The corresponding eigenvectors form the right singular vectors $V$.
5. Left singular vectors $U$ are obtained by $U = AV/\Sigma$.

This decomposition reveals how $A$ reshapes circles into ellipses.

#### Links to Eigen-Decomposition

- Eigen-decomposition works only for square, diagonalizable matrices.
- SVD works for all matrices, square or rectangular, diagonalizable or not.
- Instead of eigenvalues (which may be complex or negative), we get singular values (always real and nonnegative).
- Eigenvectors can fail to exist in a full basis; singular vectors always form orthonormal bases.

#### Applications

1. Data Compression: Truncate small singular values to approximate matrices with fewer dimensions (used in JPEG).
2. Principal Component Analysis (PCA): SVD on centered data finds principal components, directions of maximum variance.
3. Least Squares Problems: SVD provides stable solutions, even for ill-conditioned or singular systems.
4. Noise Filtering: Discard small singular values to remove noise in signals and images.
5. Numerical Stability: SVD helps diagnose conditioning-how sensitive solutions are to input errors.

#### Everyday Analogies

- Music mixing: Any complex sound can be broken into independent "tracks" with different strengths.
- Clothing store: A pile of clothes can be organized along principal directions (shirts, pants, jackets), with singular values measuring how much each dominates.
- Maps: A geographic map distorts distances differently along different directions; singular values quantify those distortions.

#### Why It Matters

- SVD is the "Swiss army knife" of linear algebra: versatile, always applicable, and rich in interpretation.
- It provides geometric, algebraic, and computational clarity.
- It is indispensable for modern applications in machine learning, statistics, engineering, and physics.

#### Try It Yourself

1. Compute the SVD of

   $$
   A = \begin{bmatrix}1 & 0 \\ 0 & 2 \\ 0 & 0\end{bmatrix}.
   $$

   Interpret the scaling and rotations.

2. Show that for any vector $x$, $\|Ax\| \leq \sigma_1 \|x\|$.

3. Use SVD to approximate the matrix

   $$
   \begin{bmatrix}1 & 1 & 1 \\ 1 & 1 & 1 \\ 1 & 1 & 1\end{bmatrix}
   $$

   with rank 1.

4. Challenge: Prove that the Frobenius norm of $A$ is the square root of the sum of squares of its singular values.

The singular value decomposition is universal: every matrix can be dissected into rotations and scalings, revealing its structure and enabling powerful techniques across mathematics and applied sciences.

