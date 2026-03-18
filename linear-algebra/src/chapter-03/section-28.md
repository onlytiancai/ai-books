### 28. Back Substitution and Solution Sets

Once Gaussian elimination reduces a system to row-echelon form (REF), the next step is to actually solve for the unknowns. This process is called back substitution: we begin with the bottom equation (which involves the fewest variables) and work our way upward, solving step by step. Back substitution is what converts the structured triangular system into explicit solutions.

#### The Structure of Row-Echelon Form

A system in REF looks like this:

$$
\begin{bmatrix}  
- & * & * & * & | & * \\  
0 & * & * & * & | & * \\  
0 & 0 & * & * & | & * \\  
0 & 0 & 0 & * & | & *  
\end{bmatrix}
$$

- Each row corresponds to an equation with fewer variables than the row above.
- The bottom equation has only one or two variables.
- This triangular form makes it possible to solve "from the bottom up."

#### Step-by-Step Example: Unique Solution

System after elimination:

$$
\begin{bmatrix}  
1 & 2 & -1 & | & 3 \\  
0 & 1 & 2 & | & 4 \\  
0 & 0 & 1 & | & 2  
\end{bmatrix}.
$$

This corresponds to:

$$
\begin{cases}  
x + 2y - z = 3 \\  
y + 2z = 4 \\  
z = 2  
\end{cases}
$$

1. From the last equation: $z = 2$.
2. Substitute into the second: $y + 2(2) = 4 \implies y = 0$.
3. Substitute into the first: $x + 2(0) - 2 = 3 \implies x = 5$.

Solution: $(x, y, z) = (5, 0, 2)$.

#### Infinite Solutions with Free Variables

Not all systems reduce to unique solutions. If there are free variables (non-pivot columns), back substitution expresses pivot variables in terms of free ones.

Example:

$$
\begin{bmatrix}  
1 & 2 & 1 & | & 4 \\  
0 & 1 & -1 & | & 1 \\  
0 & 0 & 0 & | & 0  
\end{bmatrix}.
$$

Equations:

$$
\begin{cases}  
x + 2y + z = 4 \\  
y - z = 1  
\end{cases}
$$

1. From row 2: $y = 1 + z$.
2. From row 1: $x + 2(1 + z) + z = 4 \implies x = 2 - 3z$.

Solution set:

$$
(x, y, z) = (2 - 3t, \; 1 + t, \; t), \quad t \in \mathbb{R}.
$$

Here $z = t$ is the free variable. The solutions form a line in 3D.

#### General Solution Structure

For a consistent system:

1. Unique solution → every variable is a pivot variable (no free variables).
2. Infinitely many solutions → some free variables remain. The solution set is parametrized by these variables and forms a line, plane, or higher-dimensional subspace.
3. No solution → contradiction discovered earlier, so back substitution is impossible.

#### Geometric Meaning

- Unique solution → a single intersection point of lines/planes.
- Infinite solutions → overlapping subspaces (e.g., two planes intersecting in a line).
- Back substitution describes the exact shape of this intersection.

#### Example: Parametric Vector Form

For the infinite-solution example above:

$$
(x, y, z) = (2, 1, 0) + t(-3, 1, 1).
$$

This expresses the solution set as a base point plus a direction vector, making the geometry clear.

#### Everyday Analogies

- Stacked tasks: Back substitution is like solving a sequence of tasks where each depends on the result of the one below it.
- Domino effect: Once the last domino falls (the last variable solved), the rest fall in sequence.
- Filling out a form: Each field depends on earlier answers; once the final field is fixed, the others can be determined in order.

#### Why It Matters

1. Back substitution turns row-echelon form into concrete answers.
2. It distinguishes unique vs. infinite solutions.
3. It provides a systematic method usable by hand for small systems and forms the basis of computer algorithms for large ones.
4. It reveals the structure of solution sets-whether a point, line, plane, or higher-dimensional object.

#### Try It Yourself

1. Solve by back substitution:

$$
\begin{bmatrix}  
1 & -1 & 2 & | & 3 \\  
0 & 1 & 3 & | & 5 \\  
0 & 0 & 1 & | & 2  
\end{bmatrix}.
$$

2. Reduce and solve:

$$
x + y + z = 2, \quad 2x + 2y + 2z = 4.
$$

3. Express the solution set of the above system in parametric vector form.

4. Challenge: For a 4×4 system with two free variables, explain why the solution set forms a plane in $\mathbb{R}^4$.

Back substitution completes the elimination process, translating triangular structure into explicit solutions, and shows how algebra and geometry meet in the classification of solution sets.

