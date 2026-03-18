### 24. Pivots, Free Variables, and Leading Ones

When reducing a matrix to row-echelon or reduced row-echelon form, certain positions in the matrix take on a special importance. These are the pivots-the leading nonzero entries in each row. Around them, the entire solution structure of a linear system is organized. Understanding pivots, the variables they anchor, and the freedom that arises from non-pivot columns is essential to solving linear equations systematically.

#### What is a Pivot?

In row-echelon form, a pivot is the first nonzero entry in a row, moving from left to right. After scaling in reduced row-echelon form, each pivot is set to exactly 1.

Example:

$$
\begin{bmatrix}  
1 & 2 & 0 & | & 5 \\  
0 & 1 & 3 & | & -2 \\  
0 & 0 & 0 & | & 0  
\end{bmatrix}
$$

- Pivot in row 1: the 1 in column 1.
- Pivot in row 2: the 1 in column 2.
- Column 3 has no pivot.

Columns with pivots are pivot columns. Columns without pivots correspond to free variables.

#### Pivot Variables vs. Free Variables

- Pivot variables: Variables that align with pivot columns. They are determined by the equations.
- Free variables: Variables that align with non-pivot columns. They are unconstrained and can take arbitrary values.

Example:

$$
\begin{bmatrix}  
1 & 0 & 2 & | & 3 \\  
0 & 1 & -1 & | & 4  
\end{bmatrix}.
$$

This corresponds to:

$$
x_1 + 2x_3 = 3, \quad x_2 - x_3 = 4.
$$

Here:

- $x_1$ and $x_2$ are pivot variables (from pivot columns 1 and 2).
- $x_3$ is a free variable.

Thus, $x_1$ and $x_2$ depend on $x_3$:

$$
x_1 = 3 - 2x_3, \quad x_2 = 4 + x_3, \quad x_3 \text{ free}.
$$

The solution set is infinite, described by the freedom in $x_3$.

#### Geometric Meaning

- Pivot variables represent coordinates that are "pinned down."
- Free variables correspond to directions along which the solution can extend infinitely.

In 2D:

- If there is one pivot variable and one free variable, solutions form a line.
  In 3D:
- Two pivots, one free → solutions form a line.
- One pivot, two free → solutions form a plane.

Thus, the number of free variables determines the dimension of the solution set.

#### Rank and Free Variables

The number of pivot columns equals the rank of the matrix.

If the coefficient matrix $A$ is $m \times n$:

- Rank = number of pivots.
- Number of free variables = $n - \text{rank}(A)$.

This is the rank–nullity connection in action:

$$
\text{number of variables} = \text{rank} + \text{nullity}.
$$

#### Step-by-Step Example

System:

$$
\begin{cases}  
x + 2y + z = 4 \\  
2x + 5y + z = 7  
\end{cases}
$$

Augmented matrix:

$$
\begin{bmatrix}  
1 & 2 & 1 & | & 4 \\  
2 & 5 & 1 & | & 7  
\end{bmatrix}.
$$

Reduce:

- $R_2 \to R_2 - 2R_1$ →

  $$
  \begin{bmatrix}  
  1 & 2 & 1 & | & 4 \\  
  0 & 1 & -1 & | & -1  
  \end{bmatrix}.
  $$

Now:

- Pivot columns: 1 and 2 → variables $x, y$.
- Free column: 3 → variable $z$.

Solution:

$$
x = 4 - 2y - z, \quad y = -1 + z, \quad z \text{ free}.
$$

Substitute:

$$
(x, y, z) = (6 - 3z, \; -1 + z, \; z).
$$

Solutions form a line in 3D parameterized by $z$.

#### Why Leading Ones Matter

In RREF, each pivot is scaled to 1, making it easy to isolate pivot variables. Without leading ones, equations may still be correct but harder to interpret.

For example:

$$
\begin{bmatrix}  
2 & 0 & | & 6 \\  
0 & -3 & | & 9  
\end{bmatrix}
$$

becomes

$$
\begin{bmatrix}  
1 & 0 & | & 3 \\  
0 & 1 & | & -3  
\end{bmatrix}.
$$

The solutions are immediately visible: $x=3, y=-3$.

#### Everyday Analogies

- Team roles: Pivot variables are assigned jobs, while free variables can choose freely, shaping the group's flexibility.
- Recipe ingredients: Pivots are required ingredients with fixed proportions, free variables are optional additions.
- Construction plans: Pivot columns are load-bearing beams, free columns are spaces that can be filled in flexibly.

#### Why It Matters

1. Identifying pivots shows which variables are determined and which are free.
2. The number of pivots defines rank, a central concept in linear algebra.
3. Free variables determine whether the system has a unique solution, infinitely many, or none.
4. Leading ones in RREF give immediate transparency to the solution set.

#### Try It Yourself

1. Reduce

   $$
   \begin{bmatrix}  
   1 & 3 & 1 & | & 5 \\  
   2 & 6 & 2 & | & 10  
   \end{bmatrix}
   $$

   and identify pivot and free variables.

2. For the system

   $$
   x + y + z = 2, \quad 2x + 3y + 5z = 7,
   $$

   write the RREF and express the solution with free variables.

3. Compute the rank and number of free variables of a 3×5 matrix with two pivot columns.

4. Challenge: Show that if the number of pivots equals the number of variables, the system has either no solution or a unique solution, but never infinitely many.

Understanding pivots and free variables provides the key to classifying solution sets: unique, infinite, or none. This classification lies at the heart of solving linear systems.

