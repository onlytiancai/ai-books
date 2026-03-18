### 39. Change-of-Basis Matrices

Every vector space allows multiple choices of basis, and each basis provides a different way of describing the same vectors. The process of moving from one basis to another is called a change of basis. To perform this change systematically, we use a change-of-basis matrix. This matrix acts as a translator between coordinate systems: it converts the coordinates of a vector relative to one basis into coordinates relative to another.

#### Why Change Bases?

1. Simplicity of computation: Some problems are easier in certain bases. For example, diagonalizing a matrix allows us to raise it to powers more easily.
2. Geometry: Different bases can represent rotated or scaled coordinate systems.
3. Applications: In physics, computer graphics, robotics, and data science, changing bases is equivalent to switching perspectives or reference frames.

#### The Basic Setup

Let $V$ be a vector space with two bases:

- $B = \{b_1, b_2, \dots, b_n\}$
- $C = \{c_1, c_2, \dots, c_n\}$

Suppose a vector $x \in V$ has coordinates $[x]_B$ relative to $B$, and $[x]_C$ relative to $C$.

We want a matrix $P_{B \to C}$ such that:

$$
[x]_C = P_{B \to C} [x]_B.
$$

This matrix $P_{B \to C}$ is the change-of-basis matrix from $B$ to $C$.

#### Constructing the Change-of-Basis Matrix

1. Write each vector in the basis $B$ in terms of the basis $C$.
2. Place these coordinate vectors as the columns of a matrix.
3. The resulting matrix converts coordinates from $B$ to $C$.

In matrix form:

$$
P_{B \to C} = \big[ [b_1]_C \ [b_2]_C \ \dots \ [b_n]_C \big].
$$

#### Example in $\mathbb{R}^2$

Let

- $B = \{(1,0), (0,1)\}$ (standard basis).
- $C = \{(1,1), (1,-1)\}$.

To build $P_{B \to C}$:

- Express each vector of $B$ in terms of $C$.

Solve:

$$
(1,0) = a(1,1) + b(1,-1).
$$

This gives system:

$$
a+b=1, \quad a-b=0.
$$

Solution: $a=\tfrac{1}{2}, b=\tfrac{1}{2}$. So $(1,0) = \tfrac{1}{2}(1,1) + \tfrac{1}{2}(1,-1)$.

Next:

$$
(0,1) = a(1,1) + b(1,-1).
$$

System:

$$
a+b=0, \quad a-b=1.
$$

Solution: $a=\tfrac{1}{2}, b=-\tfrac{1}{2}$.

Thus:

$$
P_{B \to C} = \begin{bmatrix}  
\tfrac{1}{2} & \tfrac{1}{2} \\  
\tfrac{1}{2} & -\tfrac{1}{2}  
\end{bmatrix}.
$$

So for any vector $x$,

$$
[x]_C = P_{B \to C}[x]_B.
$$

#### Inverse Change of Basis

If $P_{B \to C}$ is the change-of-basis matrix from $B$ to $C$, then its inverse is the change-of-basis matrix in the opposite direction:

$$
P_{C \to B} = (P_{B \to C})^{-1}.
$$

This makes sense: translating back and forth between languages should undo itself.

#### General Formula with Basis Matrices

Let

$$
P_B = [b_1 \ b_2 \ \dots \ b_n], \quad P_C = [c_1 \ c_2 \ \dots \ c_n],
$$

the matrices whose columns are basis vectors written in standard coordinates.

Then the change-of-basis matrix from $B$ to $C$ is:

$$
P_{B \to C} = P_C^{-1} P_B.
$$

This formula is extremely useful because it reduces the problem to matrix multiplication.

#### Geometric Interpretation

- Changing basis is like rotating or stretching the grid lines of a coordinate system.
- The vector itself (the point in space) does not move. What changes is its description in terms of the new grid.
- The change-of-basis matrix is the tool that translates between these descriptions.

#### Applications

1. Diagonalization: Expressing a matrix in a basis of its eigenvectors makes it diagonal, simplifying analysis.
2. Computer graphics: Changing camera viewpoints requires change-of-basis matrices.
3. Robotics: Coordinate transformations connect robot arms, joints, and workspace frames.
4. Data science: PCA finds a new basis (principal components) where data is easier to analyze.

#### Everyday Analogies

- Languages: The word "dog" in English corresponds to "chien" in French. The change-of-basis matrix is the bilingual dictionary.
- Currencies: Converting from dollars to euros requires an exchange rate. The matrix is the exchange table.
- Maps: Switching between Cartesian and polar coordinates is a change of basis-different coordinates, same location.

#### Why It Matters

1. Provides a universal method to translate coordinates between bases.
2. Makes abstract transformations concrete and computable.
3. Forms the backbone of diagonalization, Jordan form, and the spectral theorem.
4. Connects algebraic manipulations with geometry and real-world reference frames.

#### Try It Yourself

1. Compute the change-of-basis matrix from the standard basis to $\{(2,1),(1,1)\}$ in $\mathbb{R}^2$.
2. Find the change-of-basis matrix from basis $\{(1,0,0),(0,1,0),(0,0,1)\}$ to $\{(1,1,0),(0,1,1),(1,0,1)\}$ in $\mathbb{R}^3$.
3. Show that applying $P_{B \to C}$ then $P_{C \to B}$ returns the original coordinates.
4. Challenge: Derive the formula $P_{B \to C} = P_C^{-1} P_B$ starting from the definition of coordinates.

Change-of-basis matrices give us the precise mechanism for switching perspectives. They ensure that although bases change, vectors remain invariant, and computations remain consistent.

