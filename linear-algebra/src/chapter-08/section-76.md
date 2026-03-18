### 76. Orthogonal Projections and Least Squares

One of the deepest connections in linear algebra is between orthogonal projections and the least squares method. When equations don't have an exact solution, least squares finds the "best approximate" one. The theory behind it is entirely geometric: the best solution is the projection of a vector onto a subspace.

#### The Setup: Overdetermined Systems

Consider a system of equations $Ax = b$, where

- $A$ is an $m \times n$ matrix with $m > n$ (more equations than unknowns).
- $b \in \mathbb{R}^m$ may not lie in the column space of $A$.

This means:

- There may be no exact solution.
- Instead, we want $x$ that makes $Ax$ as close as possible to $b$.

#### Least Squares Problem

The least squares solution minimizes the error:

$$
\min_x \|Ax - b\|^2.
$$

Here:

- $Ax$ is the projection of $b$ onto the column space of $A$.
- The error vector $b - Ax$ is orthogonal to the column space.

This is exactly the orthogonal decomposition theorem applied to $b$.

#### Derivation of Normal Equations

We want $r = b - Ax$ to be orthogonal to every column of $A$:

$$
A^T (b - Ax) = 0.
$$

Rearranging:

$$
A^T A x = A^T b.
$$

This system is called the normal equations. Its solution $x$ gives the least squares approximation.

#### Projection Matrix in Least Squares

The projection of $b$ onto $\text{Col}(A)$ is

$$
\hat{b} = A(A^T A)^{-1} A^T b,
$$

assuming $A^T A$ is invertible.

Here,

- $P = A(A^T A)^{-1} A^T$ is the projection matrix onto the column space of $A$.
- The fitted vector is $\hat{b} = Pb$.
- The residual $r = b - \hat{b}$ lies in the orthogonal complement of $\text{Col}(A)$.

#### Example

Suppose $A = \begin{bmatrix}1 \\ 2 \\ 3\end{bmatrix}$, $b = \begin{bmatrix}2 \\ 2 \\ 4\end{bmatrix}$.

- Column space of $A$: span of $(1,2,3)$.
- Projection formula:

  $$
  \hat{b} = \frac{\langle b, A \rangle}{\langle A, A \rangle} A.
  $$
- Compute: $\langle b,A\rangle = 2\cdot1+2\cdot2+4\cdot3 = 18$.
  $\langle A,A\rangle = 1^2+2^2+3^2=14$.
- Projection:

  $$
  \hat{b} = \frac{18}{14}(1,2,3) = \left(\tfrac{9}{7}, \tfrac{18}{7}, \tfrac{27}{7}\right).
  $$
- Residual:

  $$
  r = b - \hat{b} = \left(\tfrac{5}{7}, -\tfrac{4}{7}, \tfrac{1}{7}\right).
  $$

Check: $\langle r,A\rangle = 0$, so it's orthogonal.

#### Geometric Meaning

- The least squares solution is the point in $\text{Col}(A)$ closest to $b$.
- The error vector is orthogonal to the subspace.
- This is like dropping a perpendicular from $b$ to the subspace $\text{Col}(A)$.

#### Everyday Analogies

- Fitting a line to data: The line won't pass through every point, but it minimizes the sum of squared vertical distances.
- Negotiation: You can't satisfy every demand, but you settle in the "closest possible" compromise.
- Budget cuts: You can't match every expense exactly, but you minimize the overall deviation.
- Image compression: You can't store every detail, but you keep the closest possible low-dimensional version.

#### Applications

1. Statistics: Linear regression uses least squares to fit models to data.
2. Engineering: Curve fitting, system identification, and calibration.
3. Computer Graphics: Best-fit transformations (e.g., Procrustes analysis).
4. Machine Learning: Optimization of linear models (before moving to nonlinear methods).
5. Numerical Methods: Solving inconsistent systems of equations.

#### Why It Matters

- Orthogonal projections explain why least squares gives the best approximation.
- They reveal the geometry behind regression: data is projected onto the model space.
- They connect linear algebra with statistics, optimization, and applied sciences.

#### Try It Yourself

1. Solve $\min_x \|Ax-b\|$ for $A = \begin{bmatrix}1 & 1 \\ 1 & 2 \\ 1 & 3\end{bmatrix}$, $b=(1,2,2)^T$. Interpret the result.
2. Derive the projection matrix $P$ for this system.
3. Show that the residual is orthogonal to each column of $A$.
4. Challenge: Prove that among all possible approximations $Ax$, the least squares solution is unique if and only if $A^T A$ is invertible.

Orthogonal projections turn the messy, unsolvable world of overdetermined equations into one of best possible approximations. Least squares is not just an algebraic trick-it is the geometric essence of "closeness" in higher-dimensional spaces.

