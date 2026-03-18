### 30. LU Factorization

Gaussian elimination not only solves systems but also reveals a deeper structure: many matrices can be factored into simpler pieces. One of the most useful is the LU factorization, where a matrix $A$ is written as the product of a lower-triangular matrix $L$ and an upper-triangular matrix $U$. This factorization captures all the elimination steps in a compact form and allows systems to be solved efficiently.

#### What is LU Factorization?

If $A$ is an $n \times n$ matrix, then

$$
A = LU,
$$

where:

- $L$ is lower-triangular (entries below diagonal may be nonzero, diagonal entries = 1).
- $U$ is upper-triangular (entries above diagonal may be nonzero).

This means:

- $U$ stores the result of elimination (the triangular system).
- $L$ records the multipliers used during elimination.

#### Example: 2×2 Case

Take

$$
A = \begin{bmatrix}  
2 & 3 \\  
4 & 7  
\end{bmatrix}.
$$

Elimination: $R_2 \to R_2 - 2R_1$.

- Multiplier = 2 (used to eliminate entry 4).

- Resulting $U$:

  $$
  U = \begin{bmatrix}  
  2 & 3 \\  
  0 & 1  
  \end{bmatrix}.
  $$

- $L$:

  $$
  L = \begin{bmatrix}  
  1 & 0 \\  
  2 & 1  
  \end{bmatrix}.
  $$

Check:

$$
LU = \begin{bmatrix}  
1 & 0 \\  
2 & 1  
\end{bmatrix}  
\begin{bmatrix}  
2 & 3 \\  
0 & 1  
\end{bmatrix}  
= \begin{bmatrix}  
2 & 3 \\  
4 & 7  
\end{bmatrix} = A.
$$

#### Example: 3×3 Case

$$
A = \begin{bmatrix}  
2 & 1 & 1 \\  
4 & -6 & 0 \\  
-2 & 7 & 2  
\end{bmatrix}.
$$

Step 1: Eliminate below pivot (row 1).

- Multiplier $m_{21} = 4/2 = 2$.
- Multiplier $m_{31} = -2/2 = -1$.

Step 2: Eliminate below pivot in column 2.

- After substitutions, multipliers and pivots are collected.

Result:

$$
L = \begin{bmatrix}  
1 & 0 & 0 \\  
2 & 1 & 0 \\  
-1 & -1 & 1  
\end{bmatrix}, \quad  
U = \begin{bmatrix}  
2 & 1 & 1 \\  
0 & -8 & -2 \\  
0 & 0 & 1  
\end{bmatrix}.
$$

Thus $A = LU$.

#### Solving Systems with LU

Suppose $Ax = b$. If $A = LU$:

1. Solve $Ly = b$ by forward substitution (since $L$ is lower-triangular).
2. Solve $Ux = y$ by back substitution (since $U$ is upper-triangular).

This two-step process is much faster than elimination from scratch each time, especially if solving multiple systems with the same $A$ but different $b$.

#### Pivoting and Permutations

Sometimes elimination requires row swaps (to avoid division by zero or instability). Then factorization is written as:

$$
PA = LU,
$$

where $P$ is a permutation matrix recording the row swaps. This is the practical form used in numerical computing.

#### Applications of LU Factorization

1. Efficient solving: Multiple right-hand sides $Ax = b$. Compute $LU$ once, reuse for each $b$.
2. Determinants: $\det(A) = \det(L)\det(U)$. Since diagonals of $L$ are 1, this reduces to the product of the diagonal of $U$.
3. Matrix inverse: By solving $Ax = e_i$ for each column $e_i$, we can compute $A^{-1}$ efficiently with LU.
4. Numerical methods: LU is central in scientific computing, engineering simulations, and optimization.

#### Geometric Meaning

LU decomposition separates the elimination process into:

- $L$: shear transformations (adding multiples of rows).
- $U$: scaling and alignment into triangular form.

Together, they represent the same linear transformation as $A$, but decomposed into simpler building blocks.

#### Everyday Analogies

- Recipe preparation: $L$ is the prep work (chopping, mixing), while $U$ is the final cooking (arranging in order). Together, they produce the finished dish.
- Assembly line: $L$ records the sequence of adjustments, $U$ the final structured product.
- Team project: $L$ shows who contributed what during the work process, $U$ is the neatly organized final report.

#### Why It Matters

1. LU factorization compresses elimination into a reusable format.
2. It is a cornerstone of numerical linear algebra and used in almost every solver.
3. It links computation (efficient algorithms) with theory (factorization of transformations).
4. It introduces the broader idea that matrices can be broken into simple, interpretable parts.

#### Try It Yourself

1. Factor

   $$
   A = \begin{bmatrix}  
   1 & 2 \\  
   3 & 8  
   \end{bmatrix}
   $$

   into $LU$.

2. Solve

   $$
   \begin{bmatrix}  
   2 & 1 \\  
   6 & 3  
   \end{bmatrix}  
   \begin{bmatrix}  
   x \\ y  
   \end{bmatrix} =  
   \begin{bmatrix}  
   5 \\ 15  
   \end{bmatrix}
   $$

   using LU decomposition.

3. Compute $\det(A)$ for

   $$
   A = \begin{bmatrix}  
   2 & 1 & 1 \\  
   4 & -6 & 0 \\  
   -2 & 7 & 2  
   \end{bmatrix}
   $$

   by using its LU factorization.

4. Challenge: Prove that if $A$ is invertible, then it has an LU factorization (possibly after row swaps).

LU factorization organizes elimination into a powerful tool: compact, efficient, and deeply tied to both the theory and practice of linear algebra.

#### Closing 
```
Paths diverge or merge,
pivots mark the way forward,
truth distilled in rows.
```

## Chapter 4. Vector spaces and subspaces 

#### Opening 
```
Endless skies expand,
spaces within spaces grow,
freedom takes its shape.
```

