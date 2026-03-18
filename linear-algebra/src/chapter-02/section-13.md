### 13. Matrix Addition and Scalar Multiplication

Before exploring matrix–vector and matrix–matrix multiplication, it is essential to understand the simplest operations we can perform with matrices: addition and scalar multiplication. These operations extend the rules we learned for vectors, but now applied to entire grids of numbers. Although straightforward, they are the foundation for more complex algebraic manipulations and help establish the idea of matrices as elements of a vector space.

#### Matrix Addition: Entry by Entry

If two matrices $A$ and $B$ have the same shape (same number of rows and columns), we can add them by adding corresponding entries.

Formally:
If

$$
A = [a_{ij}], \quad B = [b_{ij}],
$$

then

$$
A + B = [a_{ij} + b_{ij}].
$$

Example:

$$
\begin{bmatrix} 
1 & 2 & 3 \\ 
4 & 5 & 6 
\end{bmatrix}
+
\begin{bmatrix} 
7 & 8 & 9 \\ 
10 & 11 & 12 
\end{bmatrix}
=
\begin{bmatrix} 
8 & 10 & 12 \\ 
14 & 16 & 18 
\end{bmatrix}.
$$

Key point: Addition is only defined if the matrices are the same shape. A 2×3 matrix cannot be added to a 3×2 matrix.

#### Scalar Multiplication: Scaling Every Entry

A scalar multiplies every entry of a matrix.

Formally:
For scalar $c$ and matrix $A = [a_{ij}]$,

$$
cA = [c \cdot a_{ij}].
$$

Example:

$$
3 \cdot 
\begin{bmatrix} 
2 & -1 \\ 
0 & 4 
\end{bmatrix}
=
\begin{bmatrix} 
6 & -3 \\ 
0 & 12 
\end{bmatrix}.
$$

This mirrors vector scaling: stretching or shrinking the whole matrix by a constant factor.

#### Properties of Addition and Scalar Multiplication

These two operations satisfy familiar algebraic properties that make the set of all m×n matrices into a vector space:

1. Commutativity: $A + B = B + A$.
2. Associativity: $(A + B) + C = A + (B + C)$.
3. Additive identity: $A + 0 = A$, where 0 is the zero matrix.
4. Additive inverse: For every $A$, there exists $-A$ such that $A + (-A) = 0$.
5. Distributivity: $c(A + B) = cA + cB$.
6. Compatibility: $(c + d)A = cA + dA$.
7. Scalar associativity: $(cd)A = c(dA)$.
8. Unit scalar: $1A = A$.

These guarantee that working with matrices feels like working with numbers and vectors, only in a higher-level setting.

#### Matrix Arithmetic as Table Operations

From the table view, addition and scalar multiplication are just simple bookkeeping: line up two tables of the same shape and add entry by entry; multiply the whole table by a constant.

Example: Imagine two spreadsheets of monthly expenses. Adding them gives combined totals. Multiplying by 12 converts a monthly table into a yearly estimate.

#### Matrix Arithmetic as Machine Operations

From the machine view, these operations adjust the behavior of linear transformations:

- Adding matrices corresponds to adding their effects when applied to vectors.
- Scaling a matrix scales the effect of the transformation.

Example:
Let $A$ rotate vectors slightly, and $B$ stretch vectors. The matrix $A + B$ represents a transformation that applies both influences together. Scaling by 2 doubles the effect of the transformation.

#### Special Case: Zero and Identity

- Zero matrix: All entries are 0. Adding it to any matrix changes nothing.
- Scalar multiples of the identity: $cI$ scales every vector by c when applied. For example, $2I$ doubles every vector's length.

These act as neutral or scaling elements in matrix arithmetic.

#### Geometric Intuition

1. In $\mathbb{R}^2$ or $\mathbb{R}^3$, adding transformation matrices is like superimposing geometric effects: e.g., one matrix shears, another rotates, their sum mixes both.
2. Scaling a transformation makes its action stronger or weaker. Doubling a shear makes it twice as pronounced.

This shows that even before multiplication, addition and scaling already have geometric meaning.

#### Everyday Analogies

- Recipes: Adding two recipes (matrices) ingredient by ingredient gives a combined shopping list. Multiplying a recipe by 3 scales it for 3 times as many people.
- Financial planning: Adding two budget tables gives a combined budget. Multiplying by 12 scales monthly costs to yearly totals.
- Mixing effects: Think of audio signals represented by matrices. Adding them overlays sounds; scaling adjusts volume.

#### Why It Matters

Though simple, these operations:

- Define matrices as elements of vector spaces.
- Lay the groundwork for linear combinations of matrices, critical in eigenvalue problems, optimization, and control theory.
- Enable modular problem-solving: break big transformations into smaller ones and recombine them.
- Appear everywhere in practice, from combining datasets to scaling transformations.

Without addition and scalar multiplication, we could not treat matrices systematically as algebraic objects.

#### Try It Yourself

1. Add

$$
\begin{bmatrix} 
2 & 0 \\ 
1 & 3 
\end{bmatrix}
\quad \text{and} \quad
\begin{bmatrix} 
-2 & 5 \\ 
4 & -3 
\end{bmatrix}.
$$

2. Multiply

$$
\begin{bmatrix} 
1 & -1 & 2 \\ 
0 & 3 & 4 
\end{bmatrix}
$$

by –2.

3. Show that (A + B) + C = A + (B + C) with explicit 2×2 matrices.

4. Challenge: Construct two 3×3 matrices A and B such that A + B = 0. What does that tell you about B?

By practicing these fundamentals, you will see that even the most basic operations on matrices already build the algebraic backbone for deeper results like matrix multiplication, transformations, and factorization.

