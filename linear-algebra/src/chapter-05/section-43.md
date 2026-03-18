### 43. Kernel and Image

Every linear transformation hides two essential structures: the set of vectors that collapse to zero, and the set of all possible outputs. These are called the kernel and the image. They are the DNA of a linear map, revealing its internal structure, its strengths, and its limitations.

#### The Kernel

The kernel (or null space) of a linear transformation $T: V \to W$ is defined as:

$$
\ker(T) = \{ v \in V : T(v) = 0 \}.
$$

- It is the set of all vectors that the transformation sends to the zero vector.
- It measures how much information is "lost" under the transformation.
- The kernel is always a subspace of the domain $V$.

Examples:

1. For $T: \mathbb{R}^2 \to \mathbb{R}^2$, $T(x,y) = (x,0)$.

   - Kernel: all vectors of the form $(0,y)$. This is the y-axis.
2. For $T: \mathbb{R}^3 \to \mathbb{R}^2$, $T(x,y,z) = (x,y)$.

   - Kernel: all vectors of the form $(0,0,z)$. This is the z-axis.

The kernel tells us which directions in the domain vanish under $T$.

#### The Image

The image (or range) of a linear transformation is defined as:

$$
\text{im}(T) = \{ T(v) : v \in V \}.
$$

- It is the set of all vectors that can actually be reached by applying $T$.
- It describes the "output space" of the transformation.
- The image is always a subspace of the codomain $W$.

Examples:

1. For $T(x,y) = (x,0)$:

   - Image: all vectors of the form $(a,0)$. This is the x-axis.
2. For $T(x,y,z) = (x+y, y+z)$:

   - Image: all of $\mathbb{R}^2$. Any vector $(u,v)$ can be achieved by solving equations for $(x,y,z)$.

#### Kernel and Image Together

These two subspaces reflect two aspects of $T$:

- The kernel measures the collapse in dimension.
- The image measures the preserved and transmitted directions.

A central result is the Rank–Nullity Theorem:

$$
\dim(\ker T) + \dim(\text{im }T) = \dim(V).
$$

- $\dim(\ker T)$ is the nullity.
- $\dim(\text{im }T)$ is the rank.

This theorem guarantees a perfect balance: the domain splits into lost directions (kernel) and active directions (image).

#### Matrix View

For a matrix $A$, the linear map is $T(x) = Ax$.

- The kernel is the solution set of $Ax = 0$.
- The image is the column space of $A$.

Example:

$$
A = \begin{bmatrix} 1 & 2 & 3 \\ 0 & 1 & 1 \end{bmatrix}.
$$

- Image: span of the columns

$$
\text{im}(A) = \text{span}\{ (1,0), (2,1), (3,1) \}.
$$

- Kernel: solve

$$
\begin{bmatrix} 1 & 2 & 3 \\ 0 & 1 & 1 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}.
$$

This leads to solutions like $x=-y-2z$. So the kernel is 1-dimensional, the image is 2-dimensional, and the domain (3D) splits as $1+2=3$.

#### Geometric Intuition

- The kernel is the set of invisible directions, like shadows disappearing in projection.
- The image is the set of all shadows that can appear.
- Together they describe projection, flattening, stretching, or collapsing.

Example:
Projecting $\mathbb{R}^3$ onto the xy-plane:

- Kernel: the z-axis (all points collapsed to zero height).
- Image: the entire xy-plane (all possible shadows).

#### Everyday Analogies

- Camera lens: The kernel is the lost depth when turning 3D scenes into 2D images; the image is the actual picture captured.
- Compression: A lossy file compressor sends some details (kernel) to oblivion, but keeps the rest (image).
- Business: A company's hiring system transforms applicants into employees. The kernel is rejected candidates; the image is those who make it through.

#### Applications

1. Solving equations: Kernel describes all solutions to $Ax=0$. Image describes what right-hand sides $b$ make $Ax=b$ solvable.
2. Data science: Nullity corresponds to redundant features; rank corresponds to useful independent features.
3. Physics: In mechanics, symmetries often form the kernel of a transformation, while observable quantities form the image.
4. Control theory: The kernel and image determine controllability and observability of systems.

#### Why It Matters

1. Kernel and image classify transformations into invertible or not.
2. They give a precise language to describe dimension changes.
3. They are the foundation of rank, nullity, and invertibility.
4. They generalize far beyond matrices: to polynomials, functions, operators, and differential equations.

#### Try It Yourself

1. Compute the kernel and image of $T(x,y,z) = (x+y, y+z)$.
2. For the projection $T(x,y,z) = (x,y,0)$, identify kernel and image.
3. Show that if the kernel is trivial ($\{0\}$), then the transformation is injective.
4. Challenge: Prove the rank–nullity theorem for a $3\times 3$ matrix by working through examples.

The kernel and image are the twin lenses through which linear transformations are understood. One tells us what disappears, the other what remains. Together, they give the clearest picture of a transformation's essence.

