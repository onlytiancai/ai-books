### 59. Cramer's Rule

Cramer's Rule is a classical method for solving systems of linear equations using determinants. While rarely used in large-scale computation due to inefficiency, it offers deep theoretical insights into the relationship between determinants, invertibility, and linear systems. It shows how the determinant of a matrix encodes not only volume scaling but also the exact solution to equations.

#### The Setup

Consider a system of $n$ linear equations with $n$ unknowns:

$$
Ax = b,
$$

where $A$ is an invertible $n \times n$ matrix, $x$ is the vector of unknowns, and $b$ is the right-hand side vector.

Cramer's Rule states:

$$
x_i = \frac{\det(A_i)}{\det(A)},
$$

where $A_i$ is the matrix $A$ with its $i$-th column replaced by $b$.

#### Example: 2×2 Case

Solve:

$$
\begin{cases} 
2x + y = 5 \\ 
x + 3y = 7 
\end{cases}
$$

Matrix form:

$$
A = \begin{bmatrix} 2 & 1 \\ 1 & 3 \end{bmatrix}, \quad b = \begin{bmatrix} 5 \\ 7 \end{bmatrix}.
$$

Determinant of $A$:

$$
\det(A) = 2\cdot 3 - 1\cdot 1 = 5.
$$

- For $x_1$: replace first column with $b$:

$$
A_1 = \begin{bmatrix} 5 & 1 \\ 7 & 3 \end{bmatrix}, \quad \det(A_1) = 15 - 7 = 8.
$$

So $x_1 = 8/5$.

- For $x_2$: replace second column with $b$:

$$
A_2 = \begin{bmatrix} 2 & 5 \\ 1 & 7 \end{bmatrix}, \quad \det(A_2) = 14 - 5 = 9.
$$

So $x_2 = 9/5$.

Solution: $(x,y) = (8/5, 9/5)$.

#### Why It Works

Since $A$ is invertible,

$$
x = A^{-1}b.
$$

But recall the formula for the inverse:

$$
A^{-1} = \frac{1}{\det(A)} \text{adj}(A),
$$

where $\text{adj}(A)$ is the adjugate (transpose of the cofactor matrix). When we multiply $\text{adj}(A)b$, each component naturally becomes a determinant with one column replaced by $b$. This is exactly Cramer's Rule.

#### Geometric Interpretation

- The denominator $\det(A)$ represents the volume of the parallelotope spanned by the columns of $A$.
- The numerator $\det(A_i)$ represents the volume when the $i$-th column is replaced by $b$.
- The ratio tells how much of the volume contribution is aligned with the $i$-th direction, giving the solution coordinate.

#### Efficiency and Limitations

- Good for small $n$: Elegant for 2×2 or 3×3 systems.
- Inefficient for large $n$: Requires computing $n+1$ determinants, each with factorial complexity if done by cofactor expansion.
- Numerical instability: Determinants can be sensitive to rounding errors.
- In practice, Gaussian elimination or LU decomposition is far superior.

#### Everyday Analogies

- Recipe substitution: Replacing one ingredient (column) with the desired outcome (b) gives the exact proportion for that component.
- Voting systems: The total determinant is the baseline "influence volume," and replacing a column measures one voter's impact on the outcome.
- Maps: Changing one coordinate axis to match a destination vector shows the exact contribution of that axis to reaching the destination.

#### Applications

1. Theoretical proofs: Establishes uniqueness of solutions for small systems.
2. Geometry: Connects solutions to ratios of volumes of parallelotopes.
3. Symbolic algebra: Useful for deriving closed-form expressions.
4. Control theory: Sometimes applied in proofs of controllability/observability.

#### Why It Matters

- Provides a clear formula linking determinants and solutions of linear systems.
- Demonstrates the power of determinants as more than just volume measures.
- Acts as a conceptual bridge between algebraic solutions and geometric interpretations.

#### Try It Yourself

1. Solve
   $\begin{cases} x + 2y = 3 \\ 4x + 5y = 6 \end{cases}$
   using Cramer's Rule.
2. For the 3×3 system with matrix
   $\begin{bmatrix} 1 & 2 & 3 \\ 0 & 1 & 4 \\ 5 & 6 & 0 \end{bmatrix}$,
   compute $x_1$ using Cramer's Rule.
3. Verify that when $\det(A)=0$, Cramer's Rule breaks down, matching the fact that the system is either inconsistent or has infinitely many solutions.
4. Challenge: Derive Cramer's Rule from the adjugate matrix formula.

Cramer's Rule is not a computational workhorse, but it elegantly ties together determinants, invertibility, and the solution of linear systems-showing how geometry, algebra, and computation meet in one neat formula.

