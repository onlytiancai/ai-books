### 83. Relation to Eigen-Decompositions

The Singular Value Decomposition (SVD) is often introduced as something entirely new, but it is deeply tied to eigen-decomposition. In fact, singular values and singular vectors emerge from the eigen-decomposition of certain symmetric matrices constructed from $A$. Understanding this connection shows why SVD always exists, why singular values are nonnegative, and how it generalizes eigen-analysis to all matrices, even rectangular ones.

#### Eigen-Decomposition Recap

For a square matrix $M \in \mathbb{R}^{n \times n}$, an eigen-decomposition is:

$$
M = X \Lambda X^{-1},
$$

where $\Lambda$ is a diagonal matrix of eigenvalues and the columns of $X$ are eigenvectors.

However:

- Not all matrices are diagonalizable.
- Eigenvalues may be complex.
- Rectangular matrices don't have eigenvalues at all.

This is where SVD provides a universal framework.

#### From $A^T A$ to Singular Values

For any $m \times n$ matrix $A$:

1. Consider the symmetric, positive semidefinite matrix $A^T A \in \mathbb{R}^{n \times n}$.

   - Symmetry ensures all eigenvalues are real.
   - Positive semidefiniteness ensures they are nonnegative.

2. The eigenvalues of $A^T A$ are squares of the singular values of $A$:

   $$
   \lambda_i(A^T A) = \sigma_i^2.
   $$

3. The eigenvectors of $A^T A$ are the right singular vectors $v_i$.

4. Similarly, for $AA^T$, eigenvalues are the same $\sigma_i^2$, and eigenvectors are the left singular vectors $u_i$.

Thus:

$$
Av_i = \sigma_i u_i, \quad A^T u_i = \sigma_i v_i.
$$

This pair of relationships binds eigen-decomposition and SVD together.

#### Why Eigen-Decomposition Is Not Enough

- Eigen-decomposition requires a square matrix. SVD works for rectangular matrices.
- Eigenvalues can be negative or complex; singular values are always real and nonnegative.
- Eigenvectors may not exist as a complete basis; singular vectors always form orthonormal bases.

In short, SVD provides the robustness that eigen-decomposition lacks.

#### Example

Let

$$
A = \begin{bmatrix}3 & 0 \\ 4 & 0 \\ 0 & 5\end{bmatrix}.
$$

1. Compute $A^T A = \begin{bmatrix}25 & 0 \\ 0 & 25\end{bmatrix}$.

   - Eigenvalues: $25, 25$.
   - Singular values: $\sigma_1 = \sigma_2 = 5$.

2. Right singular vectors are eigenvectors of $A^T A$. Here, they form the standard basis.

3. Left singular vectors come from $Av_i / \sigma_i$.

So the geometry of SVD is fully encoded in eigen-analysis of $A^T A$ and $AA^T$.

#### Geometric Picture

- Eigenvectors of $A^T A$ describe directions in input space where $A$ stretches without mixing directions.
- Eigenvectors of $AA^T$ describe the corresponding directions in output space.
- Singular values tell us how much stretching occurs.

Thus, SVD is essentially eigen-decomposition in disguise-but applied to the right symmetric companions.

#### Everyday Analogies

- Echo in a room: Eigen-decomposition studies how vibrations behave within the room's geometry. SVD studies both the input (sound waves) and output (what you hear) by linking them with matching directions.
- Teamwork analogy: Eigen-decomposition tells you about the strengths of a team internally. SVD tells you how those strengths show up when tasks are actually performed.
- Projection screens: Eigen-decomposition shows the internal stability of the projector lens; SVD shows how the input image translates into a stretched or compressed projection on the wall.

#### Applications of the Connection

1. PCA: Data covariance matrix $X^T X$ uses eigen-decomposition, but PCA is implemented with SVD directly.
2. Numerical Methods: Algorithms for SVD rely on eigen-analysis of $A^T A$.
3. Stability Analysis: The relationship ensures singular values are reliable measures of conditioning.
4. Signal Processing: Power in signals (variance) is explained by eigenvalues of covariance, which connect to singular values.
5. Machine Learning: Kernel PCA and related methods depend on this link to handle nonlinear features.

#### Why It Matters

- SVD explains every matrix transformation in terms of orthogonal bases and scalings.
- Its relationship with eigen-decomposition ensures that SVD is not an alien tool, but a generalization.
- The eigenview shows why SVD is guaranteed to exist and why singular values are always real and nonnegative.

#### Try It Yourself

1. Prove that if $v$ is an eigenvector of $A^T A$ with eigenvalue $\lambda$, then $Av$ is either zero or a left singular vector of $A$ with singular value $\sqrt{\lambda}$.
2. For the matrix

   $$
   A = \begin{bmatrix}1 & 2 \\ 2 & 1\end{bmatrix},
   $$

   compute both eigen-decomposition and SVD. Compare the results.
3. Show that $A^T A$ and $AA^T$ always share the same nonzero eigenvalues.
4. Challenge: Explain why an orthogonal diagonalization of $A^T A$ is enough to guarantee existence of the full SVD of $A$.

The relationship between SVD and eigen-decomposition unifies two of linear algebra's deepest ideas: every matrix transformation is built from eigen-geometry, stretched into a form that always exists and always makes sense.

