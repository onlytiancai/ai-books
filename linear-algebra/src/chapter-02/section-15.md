### 15. Matrix–Matrix Product (Composition of Linear Steps)

Having understood how a matrix acts on a vector, the next natural step is to understand how one matrix can act on another. This leads us to the matrix–matrix product, a rule for combining two matrices into a single new matrix. Though the arithmetic looks complicated at first, the underlying idea is elegant: multiplying two matrices represents composing two linear transformations.

#### The Algebraic Rule

Suppose $A$ is an $m \times n$ matrix and $B$ is an $n \times p$ matrix. Their product $C = AB$ is an $m \times p$ matrix defined by:

$$
c_{ij} = \sum_{k=1}^n a_{ik} b_{kj}.
$$

That is: each entry of $C$ is the dot product of the i-th row of $A$ with the j-th column of $B$.

#### Example: A 2×3 times a 3×2

$$
A = 
\begin{bmatrix} 
1 & 2 & 3 \\ 
4 & 5 & 6 
\end{bmatrix}, \quad 
B = 
\begin{bmatrix} 
7 & 8 \\ 
9 & 10 \\ 
11 & 12 
\end{bmatrix}.
$$

Product: $C = AB$ will be 2×2.

- $c_{11} = 1\cdot 7 + 2\cdot 9 + 3\cdot 11 = 58$.
- $c_{12} = 1\cdot 8 + 2\cdot 10 + 3\cdot 12 = 64$.
- $c_{21} = 4\cdot 7 + 5\cdot 9 + 6\cdot 11 = 139$.
- $c_{22} = 4\cdot 8 + 5\cdot 10 + 6\cdot 12 = 154$.

So:

$$
C = 
\begin{bmatrix} 
58 & 64 \\ 
139 & 154 
\end{bmatrix}.
$$

#### Column View: Linear Combinations of Columns

From the column perspective, $AB$ is computed by applying $A$ to each column of $B$.

If $B = [b_1 \; b_2 \; \cdots \; b_p]$, then:

$$
AB = [A b_1 \; A b_2 \; \cdots \; A b_p].
$$

That is: multiply $A$ by each column of $B$. This is often the simplest way to think of the product.

#### Row View: Linear Combinations of Rows

From the row perspective, each row of $AB$ is formed by combining rows of $B$ using coefficients from a row of $A$. This dual view is less common but equally useful, especially in proofs and algorithms.

#### The Machine View: Composition of Transformations

The most important interpretation is the machine view: multiplying matrices corresponds to composing transformations.

- If $A$ maps $\mathbb{R}^n \to \mathbb{R}^m$ and $B$ maps $\mathbb{R}^p \to \mathbb{R}^n$, then $AB$ maps $\mathbb{R}^p \to \mathbb{R}^m$.
- In words: do $B$ first, then $A$.

Example:

- Let $B$ rotate vectors by 90°.
- Let $A$ scale vectors by 2.
- Then $AB$ rotates and then scales-both steps combined into a single transformation.

#### Geometric Examples

1. Scaling then rotation:

$$
A = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}, \quad 
B = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}.
$$

Then $AB$ scales vectors by 2 after rotating them 90°.

2. Projection then reflection:
   If $B$ projects onto the x-axis and $A$ reflects across the y-axis, then $AB$ represents "project then reflect."

#### Properties of Matrix Multiplication

1. Associative: $(AB)C = A(BC)$.
2. Distributive: $A(B + C) = AB + AC$.
3. Not commutative: In general, $AB \neq BA$. Order matters!
4. Identity: $AI = IA = A$.

These properties highlight that while multiplication is structured, it is not symmetric. The order encodes the order of operations in transformations.

#### Everyday Analogies

- Cooking steps: If $B$ is "chop vegetables" and $A$ is "cook vegetables," then $AB$ is "cook after chopping." Doing it the other way (BA) would make no sense!
- Assembly line: Each machine (matrix) performs an operation on the input. Chaining them corresponds to multiplying the matrices.
- Maps and routes: Going from home to the station (B), then from station to office (A) equals the combined route home→office (AB).

#### Why It Matters

Matrix multiplication is the core of linear algebra because:

1. It encodes function composition in algebraic form.
2. It provides a way to capture multiple transformations in a single matrix.
3. It underpins algorithms in computer graphics, robotics, statistics, and machine learning.
4. It reveals deeper structure, like commutativity failing, which reflects real-world order of operations.

Almost every application of linear algebra-solving equations, computing eigenvalues, training neural networks-relies on efficient matrix multiplication.

#### Try It Yourself

1. Compute

$$
\begin{bmatrix} 
1 & 0 \\ 
2 & 3 
\end{bmatrix}
\begin{bmatrix} 
4 & 5 \\ 
6 & 7 
\end{bmatrix}.
$$

2. Show that $AB \neq BA$ for the matrices

$$
A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}, 
\quad 
B = \begin{bmatrix} 0 & 0 \\ 1 & 0 \end{bmatrix}.
$$

3. Construct two 2×2 matrices where $AB = BA$. Why does commutativity happen here?

4. Challenge: If $A$ is a projection and $B$ is a rotation, compute $AB$ and $BA$. Do they represent the same geometric operation?

Through these perspectives, the matrix–matrix product shifts from being a mechanical formula to being a language for combining linear steps-each product telling the story of "do this, then that."

