### 75. Orthogonal Decomposition Theorem

One of the cornerstones of linear algebra is the orthogonal decomposition theorem, which states that every vector in an inner product space can be uniquely split into two parts: one lying inside a subspace and the other lying in its orthogonal complement. This gives us a clear way to organize information, separate influences, and simplify computations.

#### Statement of the Theorem

Let $V$ be an inner product space and $W$ a subspace of $V$. Then for every vector $x \in V$, there exist unique vectors $w \in W$ and $z \in W^\perp$ such that

$$
x = w + z.
$$

Here:

- $w = \text{proj}_W(x)$, the projection of $x$ onto $W$.
- $z = x - \text{proj}_W(x)$, the orthogonal component.

This decomposition is unique: no other pair of vectors from $W$ and $W^\perp$ adds up to $x$.

#### Example in $\mathbb{R}^2$

Take $W$ to be the line spanned by $u = (1,2)$. For $x = (4,1)$:

1. Projection:

   $$
   \text{proj}_u(x) = \frac{\langle x,u \rangle}{\langle u,u \rangle} u.
   $$

   Compute: $\langle x,u\rangle = 4\cdot 1 + 1\cdot 2 = 6$, and $\langle u,u\rangle = 1^2+2^2=5$.
   So

   $$
   \text{proj}_u(x) = \frac{6}{5}(1,2) = \left(\tfrac{6}{5}, \tfrac{12}{5}\right).
   $$

2. Orthogonal component:

   $$
   z = x - \text{proj}_u(x) = (4,1) - \left(\tfrac{6}{5}, \tfrac{12}{5}\right) = \left(\tfrac{14}{5}, -\tfrac{7}{5}\right).
   $$

3. Verify: $\langle u, z\rangle = 1\cdot \tfrac{14}{5} + 2\cdot (-\tfrac{7}{5}) = 0$.
   Thus, $z \in W^\perp$.

So we have

$$
x = \underbrace{\left(\tfrac{6}{5}, \tfrac{12}{5}\right)}_{\in W} + \underbrace{\left(\tfrac{14}{5}, -\tfrac{7}{5}\right)}_{\in W^\perp}.
$$

#### Geometric Meaning

- The decomposition splits $x$ into its "in-subspace" part and its "out-of-subspace" part.
- $w$ is the closest point in $W$ to $x$.
- $z$ is the leftover "error," always perpendicular to $W$.

Geometrically, the shortest path from $x$ to a subspace is always orthogonal.

#### Orthogonal Complements

- The orthogonal complement $W^\perp$ contains all vectors orthogonal to every vector in $W$.
- Dimensional relationship:

  $$
  \dim(W) + \dim(W^\perp) = \dim(V).
  $$
- Together, $W$ and $W^\perp$ partition the space $V$.

#### Projection Matrices and Decomposition

If $P$ is the projection matrix onto $W$:

$$
x = Px + (I-P)x,
$$

where $Px \in W$ and $(I-P)x \in W^\perp$.

This formulation is used constantly in numerical linear algebra.

#### Everyday Analogies

- Work-life balance: Splitting your time into "work" and "non-work," where the two categories do not overlap.
- Noise filtering: A signal is split into the meaningful part (projection onto a signal space) and pure noise (orthogonal component).
- Budgeting: Expenses can be uniquely divided into "planned" (projection) and "unexpected" (orthogonal) categories.
- Debate: Arguments can be split into "relevant to the topic" and "off-topic" parts, independent of each other.

#### Applications

1. Least Squares Approximation: The best-fit solution is the projection; the error lies in the orthogonal complement.
2. Fourier Analysis: Any signal decomposes into a sum of components along orthogonal basis functions plus residuals.
3. Statistics: Regression decomposes data into explained variance (in the subspace of predictors) and residual variance (orthogonal).
4. Engineering: Splitting forces into parallel and perpendicular components relative to a surface.
5. Computer Graphics: Decomposing movement into screen-plane projection and depth (orthogonal direction).

#### Why It Matters

- Orthogonal decomposition gives clarity: every vector splits into "relevant" and "irrelevant" parts relative to a chosen subspace.
- It provides the foundation for least squares, regression, and signal approximation.
- It ensures uniqueness, stability, and interpretability in vector computations.

#### Try It Yourself

1. In $\mathbb{R}^3$, decompose $x = (1,2,3)$ into components in span$(1,0,0)$ and its orthogonal complement.
2. Show that if $W$ is spanned by $(1,1,0)$ and $(0,1,1)$, then any vector in $\mathbb{R}^3$ can be uniquely split into $W$ and $W^\perp$.
3. Write down the projection matrix $P$ for $W = \text{span}\{(1,0,0),(0,1,0)\}$ in $\mathbb{R}^3$. Verify that $I-P$ projects onto $W^\perp$.
4. Challenge: Prove the orthogonal decomposition theorem using projection matrices and the fact that $P^2 = P$.

The orthogonal decomposition theorem guarantees that every vector finds its closest approximation in a chosen subspace and a perfectly perpendicular remainder-an elegant structure that makes analysis and computation possible in countless domains.

