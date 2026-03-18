### 47. Projections and Reflections

Among the many transformations in linear algebra, two stand out for their geometric clarity and practical importance: projections and reflections. These operations reshape vectors in simple but powerful ways, and they form the building blocks of algorithms in statistics, optimization, graphics, and physics.

#### Projection: Flattening onto a Subspace

A projection is a linear transformation that takes a vector and drops it onto a subspace, like casting a shadow.

Formally, if $W$ is a subspace of $V$, the projection of a vector $v$ onto $W$ is the unique vector $w \in W$ that is closest to $v$.

In $\mathbb{R}^2$: projecting onto the x-axis takes $(x,y)$ and produces $(x,0)$.

##### Orthogonal Projection Formula

Suppose $u$ is a nonzero vector. The projection of $v$ onto the line spanned by $u$ is:

$$
\text{proj}_u(v) = \frac{v \cdot u}{u \cdot u} u.
$$

This formula works in any dimension. It uses the dot product to measure how much of $v$ points in the direction of $u$.

Example:
Project $(2,3)$ onto $u=(1,1)$:

$$
\text{proj}_u(2,3) = \frac{(2,3)\cdot(1,1)}{(1,1)\cdot(1,1)} (1,1) = \frac{5}{2}(1,1) = (2.5,2.5).
$$

The vector $(2,3)$ splits into $(2.5,2.5)$ along the line plus $(-0.5,0.5)$ orthogonal to it.

##### Projection Matrices

For unit vector $u$:

$$
P = uu^T
$$

is the projection matrix onto the span of $u$.

For a general subspace with orthonormal basis columns in matrix $Q$:

$$
P = QQ^T
$$

projects any vector onto that subspace.

Properties:

1. $P^2 = P$ (idempotent).
2. $P^T = P$ (symmetric, for orthogonal projections).

#### Reflection: Flipping Across a Subspace

A reflection takes a vector and flips it across a line or plane. Geometrically, it's like a mirror.

Reflection across a line spanned by unit vector $u$:

$$
R(v) = 2\text{proj}_u(v) - v.
$$

Matrix form:

$$
R = 2uu^T - I.
$$

Example:
Reflect $(2,3)$ across the line $y=x$. With $u=(1/\sqrt{2},1/\sqrt{2})$:

$$
R = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}.
$$

So reflection swaps coordinates: $(2,3) \mapsto (3,2)$.

#### Geometric Insight

- Projection shortens vectors by removing components orthogonal to the subspace.
- Reflection preserves length but flips orientation relative to the subspace.
- Projection is about approximation ("closest point"), reflection is about symmetry.

#### Everyday Analogies

- Projection: A flashlight casts the 3D shape of your hand onto a 2D wall.
- Reflection: A mirror flips your left and right sides.
- Statistics: Projection corresponds to regression-finding the best linear approximation of data.
- Design: Reflection symmetry is everywhere in art and architecture.

#### Applications

1. Statistics & Machine Learning: Least-squares regression is projection of data onto the span of predictor variables.
2. Computer Graphics: Projection transforms 3D scenes into 2D screen images. Reflections simulate mirrors and shiny surfaces.
3. Optimization: Projections enforce constraints by bringing guesses back into feasible regions.
4. Physics: Reflections describe wave behavior, optics, and particle interactions.
5. Numerical Methods: Projection operators are key to iterative algorithms (like Krylov subspace methods).

#### Why It Matters

1. Projection captures the essence of approximation: keeping what fits, discarding what doesn't.
2. Reflection embodies symmetry and invariance, key to geometry and physics.
3. Both are linear, with elegant matrix representations.
4. They combine easily with other transformations, making them versatile in computation.

#### Try It Yourself

1. Find the projection matrix onto the line spanned by $(3,4)$. Verify it is idempotent.
2. Compute the reflection of $(1,2)$ across the x-axis.
3. Show that reflection matrices are orthogonal ($R^T R = I$).
4. Challenge: For subspace $W$ with orthonormal basis $Q$, derive the reflection matrix $R = 2QQ^T - I$.

Projections and reflections are two of the purest examples of how linear transformations embody geometric ideas. One approximates, the other symmetrizes-but both expose the deep structure of space through the lens of linear algebra.

