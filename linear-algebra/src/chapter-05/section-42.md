### 42. Matrix Representation of a Linear Map

Every linear transformation can be expressed concretely as a matrix. This is one of the most powerful bridges in mathematics: it translates abstract functional rules into arrays of numbers that can be calculated, manipulated, and visualized.

#### From Abstract Rule to Concrete Numbers

Suppose $T: V \to W$ is a linear transformation between two finite-dimensional vector spaces. To represent $T$ as a matrix, we first select bases:

- $B = \{v_1, v_2, \dots, v_n\}$ for the domain $V$.
- $C = \{w_1, w_2, \dots, w_m\}$ for the codomain $W$.

For each basis vector $v_j$, compute $T(v_j)$. Each image $T(v_j)$ is a vector in $W$, so it can be written as a combination of the basis $C$:

$$
T(v_j) = a_{1j}w_1 + a_{2j}w_2 + \dots + a_{mj}w_m.
$$

The coefficients $(a_{1j}, a_{2j}, \dots, a_{mj})$ become the j-th column of the matrix representing $T$.

Thus, the matrix of $T$ relative to bases $B$ and $C$ is

$$
[T]_{B \to C} = \begin{bmatrix} a_{11} & a_{12} & \dots & a_{1n} \\ a_{21} & a_{22} & \dots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \dots & a_{mn} \end{bmatrix}.
$$

This guarantees that for any vector $x$ in coordinates relative to $B$,

$$
[T(x)]_C = [T]_{B \to C}[x]_B.
$$

#### Standard Basis Case

When both $B$ and $C$ are the standard bases, the process simplifies:

- Take $T(e_1), T(e_2), \dots, T(e_n)$.
- Place them as columns in a matrix.

That matrix directly represents $T$.

Example:
Let $T(x,y) = (2x+y, x-y)$.

- $T(e_1) = (2,1)$.
- $T(e_2) = (1,-1)$.

So the standard matrix is

$$
A = \begin{bmatrix} 2 & 1 \\ 1 & -1 \end{bmatrix}.
$$

For any vector $\begin{bmatrix} x \\ y \end{bmatrix}$,

$$
T(x,y) = A \begin{bmatrix} x \\ y \end{bmatrix}.
$$

#### Multiple Perspectives

- Columns-as-images: Each column shows where a basis vector goes.
- Row view: Each row encodes how to compute one coordinate of the output.
- Operator view: The matrix acts like a machine: input vector → multiply → output vector.

#### Geometric Insight

Matrices reshape space. In $\mathbb{R}^2$:

- The first column shows where the x-axis goes.
- The second column shows where the y-axis goes.
  The entire grid is determined by these two images.

In $\mathbb{R}^3$, the three columns are the images of the unit coordinate directions, defining how the whole space twists, rotates, or compresses.

#### Everyday Analogies

- Translation dictionary: The abstract transformation is like a language teacher; the matrix is the bilingual dictionary that makes every translation calculable.
- Blueprint: The linear rule is the design; the matrix is the instruction sheet that workers can follow step by step.
- Mixing recipe: Each column tells you exactly how much of each "ingredient" (basis vector) contributes to the new mixture.

#### Applications

1. Computer graphics: Rotations, scaling, and projections are represented by small matrices.
2. Robotics: Coordinate changes between joints and workspaces rely on transformation matrices.
3. Data science: Linear maps such as PCA are implemented with matrices that project data into lower dimensions.
4. Physics: Linear operators like rotations, boosts, and stress tensors are matrix representations.

#### Why It Matters

1. Matrices are computational tools: we can add, multiply, invert them.
2. They let us use algorithms like Gaussian elimination, LU/QR/SVD to study transformations.
3. They link abstract vector space theory to hands-on numerical calculation.
4. They reveal the structure of transformations at a glance, just by inspecting columns and rows.

#### Try It Yourself

1. Find the matrix for the transformation $T(x,y,z) = (x+2y, y+z, x+z)$ in the standard basis.
2. Compute the matrix of $T: \mathbb{R}^2 \to \mathbb{R}^2$, where $T(x,y) = (x-y, x+y)$.
3. Using the basis $B=\{(1,1), (1,-1)\}$ for $\mathbb{R}^2$, find the matrix of $T(x,y) = (2x, y)$ relative to $B$.
4. Challenge: Show that matrix multiplication corresponds to composition of transformations, i.e. $[S \circ T] = [S][T]$.

Matrix representations are the practical form of linear transformations, turning elegant definitions into something we can compute, visualize, and apply across science and engineering.

