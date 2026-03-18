### 21. From Equations to Matrices

Linear algebra often begins with systems of equations-collections of unknowns linked by linear relationships. While these systems can be solved directly using substitution or elimination, they quickly become messy when there are many variables. The key insight of linear algebra is that all systems of linear equations can be captured compactly by matrices and vectors. This section explains how we move from equations written out in words and symbols to the matrix form that powers computation.

#### A Simple Example

Consider this system of two equations in two unknowns:

$$
\begin{cases}  
2x + y = 5 \\  
3x - y = 4  
\end{cases}
$$

At first glance, this is just algebra: two equations, two unknowns. But notice the structure: each equation is a sum of multiples of the variables, set equal to a constant. This pattern-linear combinations of unknowns equal to a result-is exactly what matrices capture.

#### Writing in Coefficient Table Form

Extract the coefficients of each variable from the system:

- First equation: coefficients are $2$ for $x$, $1$ for $y$.
- Second equation: coefficients are $3$ for $x$, $-1$ for $y$.

Arrange these coefficients in a rectangular array:

$$
A = \begin{bmatrix}  
2 & 1 \\  
3 & -1  
\end{bmatrix}.
$$

This matrix $A$ is called the coefficient matrix.

Next, write the unknowns as a vector:

$$
\mathbf{x} = \begin{bmatrix} x \\ y \end{bmatrix}.
$$

Finally, write the right-hand side constants as another vector:

$$
\mathbf{b} = \begin{bmatrix} 5 \\ 4 \end{bmatrix}.
$$

Now the entire system can be written in a single line:

$$
A\mathbf{x} = \mathbf{b}.
$$

#### Why This is Powerful

This compact form hides no information; it is equivalent to the original equations. But it gives us enormous advantages:

1. Clarity: We see the structure clearly-the system is "matrix times vector equals vector."
2. Scalability: Whether we have 2 equations or 2000, the same notation applies.
3. Tools: All the machinery of matrix operations (elimination, inverses, decompositions) now becomes available.
4. Geometry: The matrix equation $A\mathbf{x} = \mathbf{b}$ means: combine the columns of $A$ (scaled by entries of x) to land on b.

#### A Larger Example

System of three equations in three unknowns:

$$
\begin{cases}  
x + 2y - z = 2 \\  
2x - y + 3z = 1 \\  
3x + y + 2z = 4  
\end{cases}
$$

- Coefficient matrix:

  $$
  A = \begin{bmatrix}  
  1 & 2 & -1 \\  
  2 & -1 & 3 \\  
  3 & 1 & 2  
  \end{bmatrix}.
  $$

- Unknown vector:

  $$
  \mathbf{x} = \begin{bmatrix} x \\ y \\ z \end{bmatrix}.
  $$

- Constant vector:

  $$
  \mathbf{b} = \begin{bmatrix} 2 \\ 1 \\ 4 \end{bmatrix}.
  $$

Matrix form:

$$
A\mathbf{x} = \mathbf{b}.
$$

This single equation captures three equations and three unknowns in one object.

#### Row vs. Column View

- Row view: Each row of $A$ dotted with x gives one equation.
- Column view: The entire system means b is a linear combination of the columns of $A$.

For the 2×2 case earlier:

$$
A\mathbf{x} = \begin{bmatrix} 2 & 1 \\ 3 & -1 \end{bmatrix}  
\begin{bmatrix} x \\ y \end{bmatrix}  
= x \begin{bmatrix} 2 \\ 3 \end{bmatrix} + y \begin{bmatrix} 1 \\ -1 \end{bmatrix}.
$$

So solving the system means finding scalars $x, y$ that combine the columns of $A$ to reach $\mathbf{b}$.

#### Augmented Matrix Form

Sometimes we want to save space further. We can put the coefficients and constants side by side in an augmented matrix:

$$
[A | \mathbf{b}] =  
\begin{bmatrix}  
2 & 1 & | & 5 \\  
3 & -1 & | & 4  
\end{bmatrix}.
$$

This form is especially useful for elimination methods, where we manipulate rows without writing variables at each step.

#### Everyday Analogies

- Recipes: A recipe tells you how many units of each ingredient (coefficients) produce the dish (constant result). Writing it as a matrix is like organizing all recipes into a clean table.
- Schedules: Each row of a timetable (equation) corresponds to one condition. Putting it into matrix form organizes it into one big grid.
- Construction: The coefficients are like "how many bricks per wall," while the vector x is "number of walls built." The product gives total bricks, and the system sets the required totals.

#### Why It Matters

This step-rewriting equations as matrix form-is the gateway into linear algebra. Once you can do it, you no longer think of systems of equations as isolated lines on paper, but as a unified object that can be studied with general tools. It opens the door to:

- Gaussian elimination,
- rank and null space,
- determinants,
- eigenvalues,
- optimization methods.

Every major idea flows from this compact representation.

#### Try It Yourself

1. Write the system

   $$
   \begin{cases}  
   4x - y = 7 \\  
   -2x + 3y = 5  
   \end{cases}
   $$

   in matrix form.

2. For the system

   $$
   \begin{cases}  
   x + y + z = 6 \\  
   2x - y + z = 3 \\  
   x - y - z = -2  
   \end{cases}
   $$

   build the coefficient matrix, unknown vector, and constant vector.

3. Express the augmented matrix for the above system.

4. Challenge: Interpret the system in column view. What does it mean geometrically to express $(6, 3, -2)$ as a linear combination of the columns of the coefficient matrix?

By practicing these rewrites, you will see that linear algebra is not about juggling many equations-it is about seeing structure in one compact equation. This step transforms scattered equations into the language of matrices, where the real power begins.


