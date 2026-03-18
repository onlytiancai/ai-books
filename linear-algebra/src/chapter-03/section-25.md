### 25. Solving Consistent Systems

A system of linear equations is called consistent if it has at least one solution. Consistency is the first property to check when working with a system, because before worrying about uniqueness or parametrization, we must know whether a solution exists at all. This section explains how to recognize consistent systems, how to solve them using row-reduction, and how to describe their solutions in terms of pivots and free variables.

#### What Consistency Means

Given a system $A\mathbf{x} = \mathbf{b}$:

- Consistent: At least one solution $\mathbf{x}$ satisfies the system.
- Inconsistent: No solution exists.

Consistency depends on the relationship between the vector $\mathbf{b}$ and the column space of $A$:

$$
\mathbf{b} \in \text{Col}(A) \quad \iff \quad \text{system is consistent}.
$$

If $\mathbf{b}$ cannot be written as a linear combination of the columns of $A$, the system has no solution.

#### Checking Consistency with Row Reduction

To test consistency, reduce the augmented matrix $[A | \mathbf{b}]$ to row-echelon form.

- If you find a row of the form:

  $$
  [0 \;\; 0 \;\; \dots \;\; 0 \;|\; c], \quad c \neq 0,
  $$

  then the system is inconsistent (contradiction: 0 = c).
- If no such contradiction appears, the system is consistent.

#### Example 1: Consistent System with Unique Solution

System:

$$
\begin{cases}  
x + y = 2 \\  
x - y = 0  
\end{cases}
$$

Augmented matrix:

$$
\begin{bmatrix}  
1 & 1 & | & 2 \\  
1 & -1 & | & 0  
\end{bmatrix}.
$$

Row reduce:

- $R_2 \to R_2 - R_1$:

  $$
  \begin{bmatrix}  
  1 & 1 & | & 2 \\  
  0 & -2 & | & -2  
  \end{bmatrix}.
  $$

- $R_2 \to -\tfrac{1}{2}R_2$:

  $$
  \begin{bmatrix}  
  1 & 1 & | & 2 \\  
  0 & 1 & | & 1  
  \end{bmatrix}.
  $$

- $R_1 \to R_1 - R_2$:

  $$
  \begin{bmatrix}  
  1 & 0 & | & 1 \\  
  0 & 1 & | & 1  
  \end{bmatrix}.
  $$

Solution: $x = 1, \; y = 1$. Unique solution.

#### Example 2: Consistent System with Infinitely Many Solutions

System:

$$
\begin{cases}  
x + y + z = 3 \\  
2x + 2y + 2z = 6  
\end{cases}
$$

Augmented matrix:

$$
\begin{bmatrix}  
1 & 1 & 1 & | & 3 \\  
2 & 2 & 2 & | & 6  
\end{bmatrix}.
$$

Row reduce:

- $R_2 \to R_2 - 2R_1$:

  $$
  \begin{bmatrix}  
  1 & 1 & 1 & | & 3 \\  
  0 & 0 & 0 & | & 0  
  \end{bmatrix}.
  $$

No contradiction, so consistent.
Solution:

$$
x = 3 - y - z, \quad y \text{ free}, \quad z \text{ free}.
$$

The solution set is a plane in $\mathbb{R}^3$.

#### Example 3: Inconsistent System (for contrast)

System:

$$
\begin{cases}  
x + y = 1 \\  
x + y = 2  
\end{cases}
$$

Augmented matrix:

$$
\begin{bmatrix}  
1 & 1 & | & 1 \\  
1 & 1 & | & 2  
\end{bmatrix}.
$$

Row reduce:

- $R_2 \to R_2 - R_1$:

  $$
  \begin{bmatrix}  
  1 & 1 & | & 1 \\  
  0 & 0 & | & 1  
  \end{bmatrix}.
  $$

Contradiction: $0 = 1$. Inconsistent, no solution.

#### Geometric Interpretation of Consistency

- In 2D:

  - Two lines intersect at a point → consistent, unique solution.
  - Two lines overlap → consistent, infinitely many solutions.
  - Two lines are parallel and distinct → inconsistent, no solution.

- In 3D:

  - Three planes intersect at a point → unique solution.
  - Planes intersect along a line or coincide → infinitely many solutions.
  - Planes fail to meet (like a triangular "gap") → no solution.

#### Pivot Structure and Solutions

- Unique solution: Every variable is a pivot variable (no free variables).
- Infinitely many solutions: At least one free variable exists, but no contradiction.
- No solution: Contradictory row appears in augmented matrix.

#### Everyday Analogies

- Meeting point: If everyone agrees on the same café (unique solution), the plan is consistent. If they agree on any café along a certain street (infinite solutions), it's still consistent. If they give completely different addresses, there's no consistent plan.
- Recipes: If the ingredients match exactly one way, unique solution. If they can vary while still yielding the dish, infinite solutions. If the instructions contradict, no dish is possible.

#### Why It Matters

1. Consistency is the first checkpoint in solving systems.
2. The classification into unique, infinite, or none underpins all of linear algebra.
3. Understanding consistency ties algebra (row operations) to geometry (intersections of lines, planes, hyperplanes).
4. These ideas scale: in data science and engineering, checking whether equations are consistent is equivalent to asking if a model fits observed data.

#### Try It Yourself

1. Reduce the augmented matrix

   $$
   \begin{bmatrix}  
   1 & 2 & 1 & | & 5 \\  
   2 & 4 & 2 & | & 10 \\  
   3 & 6 & 3 & | & 15  
   \end{bmatrix}
   $$

   and determine if the system is consistent.

2. Classify the system as having unique, infinite, or no solutions:

   $$
   \begin{cases}  
   x + y + z = 2 \\  
   x - y + z = 0 \\  
   2x + 0y + 2z = 3  
   \end{cases}
   $$

3. Explain geometrically what it means when the augmented matrix has a contradictory row.

4. Challenge: Show algebraically that a system is consistent if and only if $\mathbf{b}$ lies in the span of the columns of $A$.

Consistent systems mark the balance point between algebraic rules and geometric reality: they are where equations and space meet in harmony.

