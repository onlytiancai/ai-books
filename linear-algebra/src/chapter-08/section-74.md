### 74. Projections onto Subspaces

Projections are a natural extension of orthogonality: they describe how to "drop" a vector onto a subspace in the most natural way, minimizing the distance. Understanding projections is crucial for solving least squares problems, decomposing vectors, and interpreting data in terms of simpler, lower-dimensional structures.

#### Projection onto a Vector

Start with the simplest case: projecting a vector $x$ onto a nonzero vector $u$.

1. The projection is the component of $x$ that lies in the direction of $u$.
2. Formula:

   $$
   \text{proj}_u(x) = \frac{\langle x, u \rangle}{\langle u, u \rangle} u.
   $$

   If $u$ is normalized ($\|u\|=1$), this simplifies to

   $$
   \text{proj}_u(x) = \langle x, u \rangle u.
   $$

Geometrically, this is the foot of the perpendicular from $x$ onto the line spanned by $u$.

#### Projection onto an Orthonormal Basis

Suppose we have an orthonormal basis $\{u_1, u_2, \dots, u_k\}$ for a subspace $W$. Then the projection of $x$ onto $W$ is:

$$
\text{proj}_W(x) = \sum_{i=1}^k \langle x, u_i \rangle u_i.
$$

This formula is powerful:

- Each coefficient $\langle x, u_i \rangle$ captures how much of $x$ aligns with $u_i$.
- The sum reconstructs the best approximation of $x$ inside $W$.

#### Projection Matrix

When working in coordinates, projections can be represented by matrices.

- If $U$ is the $n \times k$ matrix with orthonormal columns $\{u_1, \dots, u_k\}$, then

  $$
  P = UU^T
  $$

  is the projection matrix onto $W$.

Properties of $P$:

1. Idempotence: $P^2 = P$.
2. Symmetry: $P^T = P$.
3. Best approximation: For any $x$, $\|x - Px\|$ is minimized.

#### Projection and Orthogonal Complements

If $W$ is a subspace of $V$, then every vector $x \in V$ can be decomposed uniquely as

$$
x = \text{proj}_W(x) + \text{proj}_{W^\perp}(x),
$$

where $W^\perp$ is the orthogonal complement of $W$.

This decomposition is the orthogonal decomposition theorem. It says: space splits cleanly into "in" and "out of" components relative to a subspace.

#### Example in $\mathbb{R}^2$

Let $u = (2,1)$, and project $x = (3,4)$ onto span$\{u\}$.

1. Compute inner product: $\langle x,u\rangle = 3\cdot 2 + 4\cdot 1 = 10$.
2. Compute norm squared: $\langle u,u\rangle = 2^2 + 1^2 = 5$.
3. Projection:

   $$
   \text{proj}_u(x) = \frac{10}{5}(2,1) = 2(2,1) = (4,2).
   $$
4. Orthogonal error:

   $$
   x - \text{proj}_u(x) = (3,4) - (4,2) = (-1,2).
   $$

Notice: $(4,2)$ lies on the line through $u$, and the error vector $(-1,2)$ is orthogonal to $u$.

#### Everyday Analogies

- Casting shadows: A projection is like shining a light; the shadow is the projection onto the floor or wall.
- Work in physics: The projection of a force onto a direction gives the effective force doing work in that direction.
- Budget allocation: Projecting expenses onto categories shows how much belongs to each category.
- Simplified models: Projecting data onto a lower-dimensional space gives the closest "simplified" version.

#### Applications

1. Least Squares Regression: The regression line is the projection of data onto the subspace spanned by predictor variables.
2. Dimensionality Reduction: Principal Component Analysis (PCA) projects data onto the subspace of top eigenvectors.
3. Computer Graphics: 3D objects are projected onto 2D screens.
4. Numerical Methods: Projections solve equations approximately when exact solutions don't exist.
5. Physics: Work and energy are computed via projections of forces and velocities.

#### Why It Matters

- Projections are the essence of approximation: they give the "best possible" version of a vector inside a chosen subspace.
- They formalize independence: the error vector is always orthogonal to the subspace.
- They provide geometric intuition for statistics, machine learning, and numerical computation.

#### Try It Yourself

1. Compute the projection of $x = (2,3,4)$ onto $u = (1,1,1)$.
2. Verify that the residual $x - \text{proj}_u(x)$ is orthogonal to $u$.
3. Write the projection matrix for the subspace spanned by $\{(1,0,0),(0,1,0)\}$ in $\mathbb{R}^3$.
4. Challenge: Prove that projection matrices are idempotent and symmetric.

Projections turn vector spaces into cleanly split components: what lies "inside" a subspace and what lies "outside." This idea, simple yet profound, runs through geometry, data analysis, and physics alike.

