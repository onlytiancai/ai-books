### 14. Matrix–Vector Product (Linear Combinations of Columns)

We now arrive at one of the most important operations in all of linear algebra: the matrix–vector product. This operation takes a matrix $A$ and a vector x, and produces a new vector. While the computation is straightforward, its interpretations are deep: it can be seen as combining rows, as combining columns, or as applying a linear transformation. This is the operation that connects matrices to the geometry of vector spaces.

#### The Algebraic Rule

Suppose $A$ is an $m \times n$ matrix, and x is a vector in $\mathbb{R}^n$. The product $A\mathbf{x}$ is a vector in $\mathbb{R}^m$, defined as:

$$
A = 
\begin{bmatrix} 
a_{11} & a_{12} & \cdots & a_{1n} \\ 
a_{21} & a_{22} & \cdots & a_{2n} \\ 
\vdots & \vdots & \ddots & \vdots \\ 
a_{m1} & a_{m2} & \cdots & a_{mn} 
\end{bmatrix}, 
\quad
\mathbf{x} = 
\begin{bmatrix} 
x_1 \\ x_2 \\ \vdots \\ x_n
\end{bmatrix}.
$$

Then:

$$
A\mathbf{x} =
\begin{bmatrix} 
a_{11}x_1 + a_{12}x_2 + \cdots + a_{1n}x_n \\ 
a_{21}x_1 + a_{22}x_2 + \cdots + a_{2n}x_n \\ 
\vdots \\ 
a_{m1}x_1 + a_{m2}x_2 + \cdots + a_{mn}x_n
\end{bmatrix}.
$$

Each entry of the output is a dot product between one row of $A$ and the vector x.

#### Row View: Dot Products

From the row perspective, $A\mathbf{x}$ is computed row by row:

- Take each row of $A$.
- Dot it with x.
- That result becomes one entry of the output.

Example:

$$
A =
\begin{bmatrix} 
2 & 1 \\ 
3 & 4 \\ 
-1 & 2 
\end{bmatrix}, \quad
\mathbf{x} =
\begin{bmatrix} 
5 \\ 
-1
\end{bmatrix}.
$$

- First row dot x: $2(5) + 1(-1) = 9$.
- Second row dot x: $3(5) + 4(-1) = 11$.
- Third row dot x: $(-1)(5) + 2(-1) = -7$.

So:

$$
A\mathbf{x} = 
\begin{bmatrix} 
9 \\ 11 \\ -7
\end{bmatrix}.
$$

#### Column View: Linear Combinations

From the column perspective, $A\mathbf{x}$ is a linear combination of the columns of A.

If

$$
A = 
\begin{bmatrix} 
| & | &  & | \\ 
a_1 & a_2 & \cdots & a_n \\ 
| & | &  & |
\end{bmatrix}, 
\quad
\mathbf{x} =
\begin{bmatrix} 
x_1 \\ x_2 \\ \vdots \\ x_n
\end{bmatrix},
$$

then:

$$
A\mathbf{x} = x_1 a_1 + x_2 a_2 + \cdots + x_n a_n.
$$

That is: multiply each column of $A$ by the corresponding entry in x, then add them up.

This interpretation connects directly to the idea of span: the set of all vectors $A\mathbf{x}$ as x varies is exactly the span of the columns of $A$.

#### The Machine View: Linear Transformations

The machine view ties everything together: multiplying a vector by a matrix means applying the linear transformation represented by the matrix.

- If $A$ is a 2×2 rotation matrix, then $A\mathbf{x}$ rotates the vector x.
- If $A$ is a scaling matrix, then $A\mathbf{x}$ stretches or shrinks x.
- If $A$ is a projection matrix, then $A\mathbf{x}$ projects x onto a line or plane.

Thus, the algebraic definition encodes geometric and functional meaning.

#### Examples of Geometric Action

1. Scaling:

$$
A = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}.
$$

Then $A\mathbf{x}$ doubles the length of any vector x.

2. Reflection:

$$
A = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}.
$$

This flips vectors across the x-axis.

3. Rotation by θ:

$$
A = \begin{bmatrix} \cosθ & -\sinθ \\ \sinθ & \cosθ \end{bmatrix}.
$$

This rotates vectors counterclockwise by θ in the plane.

#### Everyday Analogies

- Mixing ingredients: The vector x is a recipe, and the columns of $A$ are the ingredients. The product $A\mathbf{x}$ is the final mixture.
- Weighted averages: A student's final grade is a matrix–vector product: weights (the vector) multiplied by scores (the matrix columns).
- Signal processing: Combining input signals with weights produces a new output, just like multiplying a matrix of signals by a weight vector.

#### Why It Matters

The matrix–vector product is the building block of everything in linear algebra:

1. It defines the action of a matrix as a linear map.
2. It connects directly to span and dimension (columns generate all possible outputs).
3. It underpins solving linear systems, eigenvalue problems, and decompositions.
4. It is the engine of computation in applied mathematics, from computer graphics to machine learning (e.g., neural networks compute billions of matrix–vector products).

#### Try It Yourself

1. Compute

$$
\begin{bmatrix} 
1 & 2 & 3 \\ 
4 & 5 & 6 
\end{bmatrix}
\begin{bmatrix} 
2 \\ 
0 \\ 
1 
\end{bmatrix}.
$$

2. Express the result of the above product as a linear combination of the columns of the matrix.

3. Construct a 2×2 matrix that reflects vectors across the line $y = x$. Test it on (1, 0) and (0, 1).

4. Challenge: For a 3×3 matrix, show that the set of all possible $A\mathbf{x}$ (as x varies) is exactly the column space of $A$.

By mastering both the computational rules and the interpretations of the matrix–vector product, you will gain the most important insight in linear algebra: matrices are not just tables-they are engines that transform space.

