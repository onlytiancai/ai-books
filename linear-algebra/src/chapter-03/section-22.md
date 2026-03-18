### 22. Row Operations

Once a system of linear equations has been expressed as a matrix, the next step is to simplify that matrix into a form where the solutions become clear. The main tool for this simplification is the set of elementary row operations. These operations allow us to manipulate the rows of a matrix in systematic ways that preserve the solution set of the corresponding system of equations.

#### The Three Types of Row Operations

There are exactly three types of legal row operations, each with a clear algebraic meaning:

1. Row Swapping ($R_i \leftrightarrow R_j$):
   Exchange two rows. This corresponds to reordering equations in a system. Since the order of equations doesn't change the solutions, this operation is always valid.

   Example:

   $$
   \begin{bmatrix}  
   2 & 1 & | & 5 \\  
   3 & -1 & | & 4  
   \end{bmatrix}  
   \quad \longrightarrow \quad  
   \begin{bmatrix}  
   3 & -1 & | & 4 \\  
   2 & 1 & | & 5  
   \end{bmatrix}.
   $$

2. Row Scaling ($R_i \to cR_i, \; c \neq 0$):
   Multiply all entries in a row by a nonzero constant. This is like multiplying both sides of an equation by the same number, which doesn't change its truth.

   Example:

   $$
   \begin{bmatrix}  
   2 & 1 & | & 5 \\  
   3 & -1 & | & 4  
   \end{bmatrix}  
   \quad \longrightarrow \quad  
   \begin{bmatrix}  
   1 & \tfrac{1}{2} & | & \tfrac{5}{2} \\  
   3 & -1 & | & 4  
   \end{bmatrix}.
   $$

3. Row Replacement ($R_i \to R_i + cR_j$):
   Add a multiple of one row to another. This corresponds to replacing one equation with a linear combination of itself and another, a fundamental elimination step.

   Example:

   $$
   \begin{bmatrix}  
   2 & 1 & | & 5 \\  
   3 & -1 & | & 4  
   \end{bmatrix}  
   \quad \overset{R_2 \to R_2 - \tfrac{3}{2}R_1}{\longrightarrow} \quad  
   \begin{bmatrix}  
   2 & 1 & | & 5 \\  
   0 & -\tfrac{5}{2} & | & -\tfrac{7}{2}  
   \end{bmatrix}.
   $$

#### Why These Are the Only Allowed Operations

These three operations are the backbone of elimination because they do not alter the solution set of the system. Each is equivalent to applying an invertible transformation:

- Row swaps are reversible (swap back).
- Row scalings by $c$ can be undone by scaling by $1/c$.
- Row replacements can be undone by adding the opposite multiple.

Thus, each operation is invertible, and the transformed system is always equivalent to the original.

#### Row Operations as Matrices

Each elementary row operation can itself be represented by multiplying on the left with a special matrix called an elementary matrix.

For example:

- Swapping rows 1 and 2 in a 2×2 system is done by

  $$
  E = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}.
  $$

- Scaling row 1 by 3 in a 2×2 system is done by

  $$
  E = \begin{bmatrix} 3 & 0 \\ 0 & 1 \end{bmatrix}.
  $$

This perspective is crucial later for factorization methods like LU decomposition, where elimination is expressed as a product of elementary matrices.

#### Step-by-Step Example

System:

$$
\begin{cases}  
x + 2y = 4 \\  
3x + 4y = 10  
\end{cases}
$$

Augmented matrix:

$$
\begin{bmatrix}  
1 & 2 & | & 4 \\  
3 & 4 & | & 10  
\end{bmatrix}.
$$

1. Eliminate the $3x$ under the first pivot:
   $R_2 \to R_2 - 3R_1$.

   $$
   \begin{bmatrix}  
   1 & 2 & | & 4 \\  
   0 & -2 & | & -2  
   \end{bmatrix}.
   $$

2. Scale the second row:
   $R_2 \to -\tfrac{1}{2}R_2$.

   $$
   \begin{bmatrix}  
   1 & 2 & | & 4 \\  
   0 & 1 & | & 1  
   \end{bmatrix}.
   $$

3. Eliminate above the pivot:
   $R_1 \to R_1 - 2R_2$.

   $$
   \begin{bmatrix}  
   1 & 0 & | & 2 \\  
   0 & 1 & | & 1  
   \end{bmatrix}.
   $$

Solution: $x = 2, \; y = 1$.

#### Geometry of Row Operations

Row operations do not alter the solution space:

- Swapping rows reorders equations but keeps the same lines or planes.
- Scaling rows rescales equations but leaves their geometric set unchanged.
- Adding rows corresponds to combining constraints, but the shared intersection (solution set) is preserved.

Thus, row operations act like "reshaping the system" while leaving the intersection intact.

#### Everyday Analogies

- Cooking recipe: Scaling a row is like doubling all ingredients in one recipe-it doesn't change the proportions.
- Task list: Swapping two rows is just reordering tasks; nothing about the tasks themselves changes.
- Budgeting: Adding one department's budget equation to another is just reorganizing financial records, not altering totals.

#### Why It Matters

Row operations are the essential moves in solving linear systems by hand or computer. They:

1. Make elimination systematic.
2. Preserve solution sets while simplifying structure.
3. Lay the groundwork for echelon forms, rank, and factorization.
4. Provide the mechanical steps that computers automate in Gaussian elimination.

#### Try It Yourself

1. Apply row operations to reduce

   $$
   \begin{bmatrix}  
   2 & 1 & | & 7 \\  
   1 & -1 & | & 1  
   \end{bmatrix}
   $$

   to a form where the solution is obvious.

2. Show explicitly why swapping two equations in a system doesn't change its solutions.

3. Construct the elementary matrix for "add –2 times row 1 to row 3" in a 3×3 system.

4. Challenge: Prove that any elementary row operation corresponds to multiplication by an invertible matrix.

Mastering these operations equips you with the mechanical and conceptual foundation for the next stage: systematically reducing matrices to row-echelon form.

