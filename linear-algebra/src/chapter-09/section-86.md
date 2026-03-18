### 86. Pseudoinverse (Moore–Penrose) and Solving Ill-Posed Systems

In linear algebra, the inverse of a matrix is a powerful tool: if $A$ is invertible, then solving $Ax = b$ is as simple as $x = A^{-1}b$. But what happens when $A$ is not square, or not invertible? In practice, this is the norm: many problems involve rectangular matrices (more equations than unknowns, or more unknowns than equations), or square matrices that are singular. The Moore–Penrose pseudoinverse, usually denoted $A^+$, generalizes the idea of an inverse to all matrices, providing a systematic way to find solutions-or best approximations-when ordinary inversion fails.

#### Why Ordinary Inverses Fail

- Non-square matrices: If $A$ is $m \times n$ with $m \neq n$, no standard inverse exists.
- Singular matrices: Even if $A$ is square, if $\det(A) = 0$, it has no inverse.
- Ill-posed problems: In real-world data, exact solutions may not exist (inconsistent systems) or may not be unique (underdetermined systems).

Despite these obstacles, we still want a systematic way to solve or approximate $Ax = b$.

#### Definition of the Pseudoinverse

The Moore–Penrose pseudoinverse $A^+$ is defined as the unique matrix that satisfies four properties:

1. $AA^+A = A$.
2. $A^+AA^+ = A^+$.
3. $(AA^+)^T = AA^+$.
4. $(A^+A)^T = A^+A$.

These conditions ensure $A^+$ acts as an "inverse" in the broadest consistent sense.

#### Constructing the Pseudoinverse with SVD

Given the SVD of $A$:

$$
A = U \Sigma V^T,
$$

where $\Sigma$ is diagonal with singular values $\sigma_1, \dots, \sigma_r$, the pseudoinverse is:

$$
A^+ = V \Sigma^+ U^T,
$$

where $\Sigma^+$ is formed by inverting nonzero singular values and transposing the matrix. Specifically:

- If $\sigma_i \neq 0$, replace it with $1/\sigma_i$.
- If $\sigma_i = 0$, leave it as 0.

This definition works for all matrices, square or rectangular.

#### Solving Linear Systems with $A^+$

1. Overdetermined systems ($m > n$, more equations than unknowns):

   - Often no exact solution exists.
   - The pseudoinverse gives the least-squares solution:

     $$
     x = A^+ b,
     $$

     which minimizes $\|Ax - b\|$.

2. Underdetermined systems ($m < n$, more unknowns than equations):

   - Infinitely many solutions exist.
   - The pseudoinverse chooses the solution with the smallest norm:

     $$
     x = A^+ b,
     $$

     which minimizes $\|x\|$ among all solutions.

3. Square but singular systems:

   - Some solutions exist, but not uniquely.
   - The pseudoinverse again picks the least-norm solution.

#### Example 1: Overdetermined

Suppose we want to solve:

$$
\begin{bmatrix}1 & 1 \\ 1 & -1 \\ 1 & 0\end{bmatrix} x = \begin{bmatrix}2 \\ 0 \\ 1\end{bmatrix}.
$$

This $3 \times 2$ system has no exact solution. Using the pseudoinverse, we obtain the least-squares solution that best fits all three equations simultaneously.

#### Example 2: Underdetermined

For

$$
\begin{bmatrix}1 & 0 & 0 \\ 0 & 1 & 0\end{bmatrix} x = \begin{bmatrix}3 \\ 4\end{bmatrix},
$$

the system has infinitely many solutions because $x_3$ is free. The pseudoinverse gives:

$$
x = \begin{bmatrix}3 \\ 4 \\ 0\end{bmatrix},
$$

choosing the solution with minimum norm.

#### Geometric Interpretation

- The pseudoinverse acts like projecting onto subspaces.
- For overdetermined systems, it projects $b$ onto the column space of $A$, then finds the closest $x$.
- For underdetermined systems, it picks the point in the solution space closest to the origin.

So $A^+$ embodies the principle of "best possible inverse" under the circumstances.

#### Everyday Analogies

- GPS triangulation: If multiple satellites give inconsistent measurements, the pseudoinverse provides the location that minimizes total error.
- Fitting clothes: If a shirt doesn't fit perfectly, you pick the size that is closest overall; that's least squares in action.
- Balancing a scale: When too many constraints pull in different directions, the pseudoinverse finds the compromise that balances them best.

#### Applications

1. Least-Squares Regression: Solving $\min_x \|Ax - b\|^2$ via $A^+$.
2. Signal Processing: Reconstructing signals from incomplete or noisy data.
3. Control Theory: Designing inputs when exact control is impossible.
4. Machine Learning: Training models with non-invertible design matrices.
5. Statistics: Computing generalized inverses of covariance matrices.

#### Limitations

- Sensitive to very small singular values: numerical instability may occur.
- Regularization (like ridge regression) is often preferred in noisy settings.
- Computationally expensive for very large matrices, though truncated SVD can help.

#### Why It Matters

The pseudoinverse is a unifying idea: it handles inconsistent, underdetermined, or singular problems with one formula. It ensures we always have a principled answer, even when classical algebra says "no solution" or "infinitely many solutions." In real data analysis, almost every problem is ill-posed to some degree, making the pseudoinverse a practical cornerstone of modern applied linear algebra.

#### Try It Yourself

1. Compute the pseudoinverse of a simple $2 \times 2$ singular matrix by hand using SVD.
2. Solve both an overdetermined ($3 \times 2$) and underdetermined ($2 \times 3$) system using $A^+$. Compare with intuitive expectations.
3. Explore what happens numerically when singular values are very small. Try truncating them-this connects to regularization.

The Moore–Penrose pseudoinverse shows that even when linear systems are "broken," linear algebra still provides a systematic way forward.

