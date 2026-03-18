### 11. Matrices as Tables and as Machines

The next stage in our journey is to move from vectors to matrices. A matrix may look like just a rectangular array of numbers, but in linear algebra it plays two distinct and equally important roles:

1. As a table of numbers, storing data, coefficients, or geometric patterns in a compact form.
2. As a machine that transforms vectors into other vectors, capturing the essence of linear transformations.

Both views are valid, and learning to switch between them is crucial to building intuition.

#### Matrices as Tables

At the most basic level, a matrix is a grid of numbers arranged into rows and columns.

- A $2 \times 2$ matrix has 2 rows and 2 columns:

  $$
  A = \begin{bmatrix} 
  a_{11} & a_{12} \\ 
  a_{21} & a_{22} 
  \end{bmatrix}
  $$

- A $3 \times 2$ matrix has 3 rows and 2 columns:

  $$
  B = \begin{bmatrix} 
  b_{11} & b_{12} \\ 
  b_{21} & b_{22} \\ 
  b_{31} & b_{32} 
  \end{bmatrix}
  $$

Each entry $a_{ij}$ or $b_{ij}$ tells us the number in the i-th row and j-th column. The rows of a matrix can represent constraints, equations, or observations; the columns can represent features, variables, or directions.

In this sense, matrices are data containers, organizing information efficiently. That's why matrices show up in spreadsheets, statistics, computer graphics, and scientific computing.

#### Matrices as Machines

The deeper view of a matrix is as a function from vectors to vectors. If x is a column vector, then multiplying A·x produces a new vector.

For example:

$$
A = \begin{bmatrix} 
2 & 0 \\ 
1 & 3 
\end{bmatrix}, \quad
\mathbf{x} = \begin{bmatrix} 
4 \\ 
5 
\end{bmatrix}.
$$

Multiplying:

$$
A\mathbf{x} = \begin{bmatrix} 
2×4 + 0×5 \\ 
1×4 + 3×5 
\end{bmatrix} 
= \begin{bmatrix} 
8 \\ 
19 
\end{bmatrix}.
$$

Here, the matrix is acting as a machine that takes input (4, 5) and outputs (8, 19). The "machine rules" are encoded in the rows of A.

#### Column View of Matrix Multiplication

Another way to see it: multiplying A·x is the same as taking a linear combination of A's columns.

If

$$
A = \begin{bmatrix} 
a_1 & a_2 
\end{bmatrix}, \quad \mathbf{x} = \begin{bmatrix} 
x_1 \\ 
x_2 
\end{bmatrix},
$$

then:

$$
A\mathbf{x} = x_1 a_1 + x_2 a_2.
$$

So the vector x tells the machine "how much" of each column to mix together. This column view is critical-it connects matrices to span, dimension, and basis ideas we saw earlier.

#### The Duality of Tables and Machines

- As a table, a matrix is a static object: numbers written in rows and columns.
- As a machine, the same numbers become instructions for transforming vectors.

This duality is not just conceptual-it's the key to understanding why linear algebra is so powerful. A dataset, once stored as a table, can be interpreted as a transformation. Likewise, a transformation, once understood, can be encoded as a table.

#### Examples in Practice

1. Physics: A stress–strain matrix is a table of coefficients. But it also acts as a machine that transforms applied forces into deformations.
2. Computer Graphics: A 2D rotation matrix is a machine that spins vectors, but it can be stored in a simple 2×2 table.
3. Economics: Input–output models use matrices as tables of production coefficients. Applying them to demand vectors transforms them into resource requirements.

#### Geometric Intuition

Every 2×2 or 3×3 matrix corresponds to some linear transformation in the plane or space. Examples:

- Scaling: $\begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$ doubles lengths.
- Reflection: $\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$ flips across the x-axis.
- Rotation: $\begin{bmatrix} \cos θ & -\sin θ \\ \sin θ & \cos θ \end{bmatrix}$ rotates vectors by θ.

These are not just tables of numbers-they are precise, reusable machines.

#### Why This Matters

This section sets the stage for all matrix theory:

- Thinking of matrices as tables helps in data interpretation and organization.
- Thinking of matrices as machines helps in understanding linear transformations, eigenvalues, and decompositions.
- Most importantly, learning to switch between the two perspectives makes linear algebra both concrete and abstract-bridging computation with geometry.

#### Try It Yourself

1. Write a 2×3 matrix and identify its rows and columns. What might they represent in a real-world dataset?
2. Multiply $\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$ by $\begin{bmatrix} 2 \\ –1 \end{bmatrix}$. Interpret the result using both the row and column views.
3. Construct a matrix that scales vectors by 2 along the x-axis and reflects them across the y-axis. Test it on (1, 1).
4. Challenge: Show how the same 3×3 rotation matrix can be viewed as a data table of cosines/sines and as a machine that turns input vectors.

By mastering both perspectives, you'll see matrices not just as numbers but as dynamic objects that encode and execute transformations.

