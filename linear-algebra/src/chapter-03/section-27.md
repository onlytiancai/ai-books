### 27. Gaussian Elimination by Hand

Gaussian elimination is the systematic procedure for solving systems of linear equations by using row operations to simplify the augmented matrix. The goal is to transform the system into row-echelon form (REF) and then use back substitution to find the solutions. This method is the backbone of linear algebra computations and is the foundation of most computer algorithms for solving linear systems.

#### The Big Idea

1. Represent the system as an augmented matrix.
2. Use row operations to eliminate variables step by step, moving left to right, top to bottom.
3. Stop when the matrix is in REF.
4. Solve the triangular system by back substitution.

#### Step-by-Step Recipe

Suppose we have $n$ equations with $n$ unknowns.

1. Choose a pivot in the first column (a nonzero entry). If needed, swap rows to bring a nonzero entry to the top.
2. Eliminate below the pivot by subtracting multiples of the pivot row from lower rows so that all entries below the pivot become zero.
3. Move to the next row and next column, pick the next pivot, and repeat elimination.
4. Continue until all pivots are in stair-step form (REF).
5. Use back substitution to solve for the unknowns starting from the bottom row.

#### Example 1: A 2×2 System

System:

$$
\begin{cases}  
x + 2y = 5 \\  
3x + 4y = 11  
\end{cases}
$$

Augmented matrix:

$$
\begin{bmatrix}  
1 & 2 & | & 5 \\  
3 & 4 & | & 11  
\end{bmatrix}.
$$

1. Pivot at (1,1) = 1.
2. Eliminate below: $R_2 \to R_2 - 3R_1$.

   $$
   \begin{bmatrix}  
   1 & 2 & | & 5 \\  
   0 & -2 & | & -4  
   \end{bmatrix}.
   $$
3. Back substitution: From row 2: $-2y = -4 \implies y = 2$.
   Substitute into row 1: $x + 2(2) = 5 \implies x = 1$.

Solution: $(x, y) = (1, 2)$.

#### Example 2: A 3×3 System

System:

$$
\begin{cases}  
x + y + z = 6 \\  
2x + 3y + z = 14 \\  
x - y + 2z = 2  
\end{cases}
$$

Augmented matrix:

$$
\begin{bmatrix}  
1 & 1 & 1 & | & 6 \\  
2 & 3 & 1 & | & 14 \\  
1 & -1 & 2 & | & 2  
\end{bmatrix}.
$$

Step 1: Pivot at (1,1).
Eliminate below:

- $R_2 \to R_2 - 2R_1$.
- $R_3 \to R_3 - R_1$.

$$
\begin{bmatrix}  
1 & 1 & 1 & | & 6 \\  
0 & 1 & -1 & | & 2 \\  
0 & -2 & 1 & | & -4  
\end{bmatrix}.
$$

Step 2: Pivot at (2,2).
Eliminate below: $R_3 \to R_3 + 2R_2$.

$$
\begin{bmatrix}  
1 & 1 & 1 & | & 6 \\  
0 & 1 & -1 & | & 2 \\  
0 & 0 & -1 & | & 0  
\end{bmatrix}.
$$

Step 3: Pivot at (3,3). Scale row: $R_3 \to -R_3$.

$$
\begin{bmatrix}  
1 & 1 & 1 & | & 6 \\  
0 & 1 & -1 & | & 2 \\  
0 & 0 & 1 & | & 0  
\end{bmatrix}.
$$

Back substitution:

- From row 3: $z = 0$.
- From row 2: $y - z = 2 \implies y = 2$.
- From row 1: $x + y + z = 6 \implies x = 4$.

Solution: $(x, y, z) = (4, 2, 0)$.

#### Why Gaussian Elimination Always Works

- Each step reduces the number of variables in the lower equations.
- Pivoting ensures stability (swap rows to avoid dividing by zero).
- The algorithm either produces a triangular system (solvable by substitution) or reveals inconsistency (contradictory row).

#### Geometric Interpretation

- Elimination corresponds to progressively restricting the solution set:

  - First equation → a plane in $\mathbb{R}^3$.
  - Add second equation → intersection becomes a line.
  - Add third equation → intersection becomes a point (unique solution) or vanishes (inconsistent).

#### Everyday Analogies

- Cleaning a desk: Start with a mess (equations mixed together), then eliminate clutter one step at a time until everything is sorted neatly into piles.
- Cooking: Elimination is like reducing a sauce-boiling away the excess until only the essence remains.
- Detective work: Each equation eliminates possibilities, narrowing down suspects until only the guilty party (the solution) remains.

#### Why It Matters

1. Gaussian elimination is the foundation for solving systems by hand and by computer.
2. It reveals whether a system is consistent and if solutions are unique or infinite.
3. It is the starting point for advanced methods like LU decomposition, QR factorization, and numerical solvers.
4. It shows the interplay between algebra (row operations) and geometry (intersections of subspaces).

#### Try It Yourself

1. Solve the system

   $$
   \begin{cases}  
   2x + y = 7 \\  
   4x + 3y = 15  
   \end{cases}
   $$

   using Gaussian elimination.

2. Reduce

   $$
   \begin{bmatrix}  
   1 & 2 & -1 & | & 3 \\  
   3 & 8 & 1 & | & 12 \\  
   2 & 6 & 3 & | & 11  
   \end{bmatrix}
   $$

   to REF and solve.

3. Practice with a system that has infinitely many solutions:

   $$
   x + y + z = 4, \quad 2x + 2y + 2z = 8.
   $$

4. Challenge: Explain why Gaussian elimination always terminates in at most $n$ pivot steps for an $n \times n$ system.

Gaussian elimination transforms the complexity of many equations into an orderly process, making the hidden structure of solutions visible step by step.

