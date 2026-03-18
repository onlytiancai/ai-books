### 29. Rank and Its First Meaning

The concept of rank lies at the heart of linear algebra. It connects the algebra of solving systems, the geometry of subspaces, and the structure of matrices into one unifying idea. Rank measures the amount of independent information in a matrix: how many rows or columns carry unique directions instead of being repetitions or combinations of others.

#### Definition of Rank

The rank of a matrix $A$ is the number of pivots in its row-echelon form. Equivalently, it is:

- The dimension of the column space (number of independent columns).
- The dimension of the row space (number of independent rows).

All these definitions agree.

#### First Encounter with Rank: Pivot Counting

When solving a system with Gaussian elimination:

- Every pivot corresponds to one determined variable.
- The number of pivots = the rank.
- The number of free variables = total variables – rank.

Example:

$$
\begin{bmatrix}  
1 & 2 & 1 & | & 4 \\  
0 & 1 & -1 & | & 2 \\  
0 & 0 & 0 & | & 0  
\end{bmatrix}.
$$

Here, there are 2 pivots. So:

- Rank = 2.
- With 3 variables total, there is 1 free variable.

#### Rank in Terms of Independence

A set of vectors is linearly independent if none can be expressed as a combination of the others.

- The rank of a matrix tells us how many independent rows or columns it has.
- If some columns are combinations of others, they do not increase the rank.

Example:

$$
\begin{bmatrix}  
1 & 2 & 3 \\  
2 & 4 & 6 \\  
3 & 6 & 9  
\end{bmatrix}.
$$

Here, each row is a multiple of the first. Rank = 1, since only one independent row/column direction exists.

#### Rank and Solutions of Systems

Consider $A\mathbf{x} = \mathbf{b}$.

- If $\text{rank}(A) = \text{rank}([A|\mathbf{b}])$, the system is consistent.
- If not, inconsistent.
- If rank = number of variables, the system has a unique solution.
- If rank < number of variables, there are infinitely many solutions.

Thus, rank classifies solution sets.

#### Rank and Geometry

Rank tells us the dimension of the subspace spanned by rows or columns.

- Rank 1: all information lies along a line.
- Rank 2: lies in a plane.
- Rank 3: fills 3D space.

Example:

- In $\mathbb{R}^3$, a matrix of rank 2 has columns spanning a plane through the origin.
- A matrix of rank 1 has all columns on a single line.

#### Rank and Row vs. Column View

It is a remarkable fact that the number of independent rows = number of independent columns. This is not obvious at first glance, but it is always true. So we can define rank either by rows or by columns-it makes no difference.

#### Everyday Analogies

- Library books: If three books say the same thing in different words, only one adds new knowledge. The others are redundant. Rank = number of genuinely independent books.
- Recipes: If you have five recipes but four are just scaled versions of the first, you really only have one distinct recipe. Rank = 1.
- Work team: If every team member repeats what another says, the effective number of independent voices is low. Rank measures how many unique contributions exist.

#### Why It Matters

1. Rank is the bridge between algebra and geometry: pivots ↔ dimension.
2. It classifies solutions to systems of equations.
3. It measures redundancy in data (important in statistics, machine learning, signal processing).
4. It prepares the way for advanced concepts like nullity, rank–nullity theorem, and singular value decomposition.

#### Try It Yourself

1. Find the rank of

   $$
   \begin{bmatrix}  
   1 & 2 & 3 \\  
   2 & 4 & 5 \\  
   3 & 6 & 8  
   \end{bmatrix}.
   $$

2. Solve the system

   $$
   x + y + z = 2, \quad 2x + 2y + 2z = 4,
   $$

   and identify the rank of the coefficient matrix.

3. In $\mathbb{R}^3$, what is the geometric meaning of a 3×3 matrix of rank 2?

4. Challenge: Prove that the row rank always equals the column rank by considering the echelon form of the matrix.

Rank is the first truly unifying concept in linear algebra: it tells us how much independent structure a matrix contains and sets the stage for understanding spaces, dimensions, and transformations.

