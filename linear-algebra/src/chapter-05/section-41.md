### 41. Linear Transformations

A linear transformation is the heart of linear algebra. It is the rule that connects two vector spaces in a way that respects their linear structure: addition and scalar multiplication. Instead of thinking of vectors as static objects, linear transformations let us study how vectors move, stretch, rotate, project, or reflect. They give linear algebra its dynamic power and are the bridge between abstract theory and concrete applications.

#### Definition

A function $T: V \to W$ between vector spaces is called a linear transformation if for all $u, v \in V$ and scalars $a, b \in \mathbb{R}$ (or another field),

$$
T(au + bv) = aT(u) + bT(v).
$$

This single condition encodes two rules:

1. Additivity: $T(u+v) = T(u) + T(v)$.
2. Homogeneity: $T(av) = aT(v)$.

If both are satisfied, the transformation is linear.

#### Examples of Linear Transformations

1. Scaling:
   $T(x) = 3x$ in $\mathbb{R}$. Every number is stretched threefold.

2. Rotation in the plane:
   $T(x,y) = (x\cos\theta - y\sin\theta, \, x\sin\theta + y\cos\theta)$.

3. Projection:
   Projecting $(x,y,z)$ onto the $xy$-plane:
   $T(x,y,z) = (x,y,0)$.

4. Differentiation:
   On the space of polynomials, $T(p(x)) = p'(x)$.

5. Integration:
   On continuous functions, $T(f)(x) = \int_0^x f(t) \, dt$.

All these are linear because they preserve addition and scaling.

#### Non-Examples

- $T(x) = x^2$ is not linear, because $(x+y)^2 \neq x^2 + y^2$.
- $T(x,y) = (x+1, y)$ is not linear, because it fails homogeneity: scaling doesn't preserve the "+1."

Nonlinear rules break the structure of vector spaces.

#### Matrix Representation

Every linear transformation from $\mathbb{R}^n$ to $\mathbb{R}^m$ can be represented by a matrix.

If $T: \mathbb{R}^n \to \mathbb{R}^m$, then there exists an $m \times n$ matrix $A$ such that:

$$
T(x) = Ax.
$$

The columns of $A$ are simply $T(e_1), T(e_2), \dots, T(e_n)$, where $e_i$ are the standard basis vectors.

Example:
Let $T(x,y) = (2x+y, x-y)$.

- $T(e_1) = T(1,0) = (2,1)$.
- $T(e_2) = T(0,1) = (1,-1)$.
  So

$$
A = \begin{bmatrix} 2 & 1 \\ 1 & -1 \end{bmatrix}.
$$

Then $T(x,y) = A \begin{bmatrix} x \\ y \end{bmatrix}$.

#### Properties of Linear Transformations

1. The image of the zero vector is always zero: $T(0) = 0$.
2. The image of a line through the origin is again a line (or collapsed to a point).
3. Composition of linear transformations is linear.
4. Every linear transformation preserves the structure of subspaces.

#### Kernel and Image (Preview)

For $T: V \to W$:

- The kernel (or null space) is all vectors mapped to zero: $\ker T = \{v \in V : T(v) = 0\}$.
- The image (or range) is all outputs that can be achieved: $\text{im}(T) = \{T(v) : v \in V\}$.
  The rank–nullity theorem applies here:

$$
\dim(\ker T) + \dim(\text{im}(T)) = \dim(V).
$$

#### Geometric Interpretation

Linear transformations reshape space:

- Scaling stretches space uniformly in one direction.
- Rotation spins space while preserving lengths.
- Projection flattens space onto lower dimensions.
- Reflection flips space across a line or plane.

The key feature: straight lines remain straight, and the origin stays fixed.

#### Everyday Analogies

- Maps and coordinates: A GPS system transforms geographic positions (lat/long) into screen positions (x,y).
- Shadows: Projecting a 3D object onto the ground is a linear transformation.
- Economics: A matrix that takes production levels (inputs) and outputs profits is a linear transformation of data.
- Music: An equalizer linearly adjusts different frequencies: the structure of the sound is preserved but reshaped.

#### Applications

1. Computer graphics: Scaling, rotating, projecting 3D objects onto 2D screens.
2. Robotics: Transformations between joint coordinates and workspace positions.
3. Data science: Linear mappings represent dimensionality reduction and feature extraction.
4. Differential equations: Solutions often involve linear operators acting on function spaces.
5. Machine learning: Weight matrices in neural networks are stacked linear transformations, interspersed with nonlinearities.

#### Why It Matters

1. Linear transformations generalize matrices to any vector space.
2. They unify geometry, algebra, and applications under one concept.
3. They provide the natural framework for studying eigenvalues, eigenvectors, and decompositions.
4. They model countless real-world processes: physical, computational, and abstract.

#### Try It Yourself

1. Prove that $T(x,y,z) = (x+2y, z, x-y+z)$ is linear.
2. Find the matrix representation of the transformation that reflects vectors in $\mathbb{R}^2$ across the line $y=x$.
3. Show why $T(x,y) = (x^2,y)$ is not linear.
4. Challenge: For the differentiation operator $D: P_3 \to P_2$ on polynomials of degree ≤ 3, find its matrix relative to the basis $\{1,x,x^2,x^3\}$ in the domain and $\{1,x,x^2\}$ in the codomain.

Linear transformations are the language of linear algebra. They capture the essence of symmetry, motion, and structure in spaces of any kind, making them indispensable for both theory and practice.

