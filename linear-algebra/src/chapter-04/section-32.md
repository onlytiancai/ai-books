### 32. Subspaces, Column Space, and Null Space

Once the idea of a vector space is in place, the next step is to recognize smaller vector spaces that live inside bigger ones. These are called subspaces. Subspaces are central in linear algebra because they reveal the internal structure of matrices and linear systems. Two special subspaces-the column space and the null space-play particularly important roles.

#### What Is a Subspace?

A subspace $W$ of a vector space $V$ is a subset of $V$ that is itself a vector space under the same operations. To qualify as a subspace, $W$ must satisfy:

1. The zero vector $0$ is in $W$.
2. If $u, v \in W$, then $u+v \in W$ (closed under addition).
3. If $u \in W$ and $c$ is a scalar, then $cu \in W$ (closed under scalar multiplication).

That's it-no further checking of all ten vector space axioms is needed, because those are inherited from $V$.

#### Simple Examples of Subspaces

- In $\mathbb{R}^3$:

  - A line through the origin is a 1-dimensional subspace.
  - A plane through the origin is a 2-dimensional subspace.
  - The whole space itself is a subspace.
  - The trivial subspace $\{0\}$ contains only the zero vector.

- In the space of polynomials:

  - All polynomials of degree ≤ 3 form a subspace.
  - All polynomials with zero constant term form a subspace.

- In function spaces:

  - All continuous functions on $[0,1]$ form a subspace of all functions on $[0,1]$.
  - All solutions to a linear differential equation form a subspace.

#### The Column Space of a Matrix

Given a matrix $A$, the column space is the set of all linear combinations of its columns. Formally,

$$
C(A) = \{ A\mathbf{x} : \mathbf{x} \in \mathbb{R}^n \}.
$$

- The column space lives inside $\mathbb{R}^m$ if $A$ is $m \times n$.
- It represents all possible outputs of the linear transformation defined by $A$.
- Its dimension is equal to the rank of $A$.

Example:

$$
A = \begin{bmatrix}  
1 & 2 \\  
2 & 4 \\  
3 & 6  
\end{bmatrix}.
$$

The second column is just twice the first. So the column space is all multiples of $\begin{bmatrix}1 \\ 2 \\ 3\end{bmatrix}$, which is a line in $\mathbb{R}^3$. Rank = 1.

#### The Null Space of a Matrix

The null space (or kernel) of a matrix $A$ is the set of all vectors $\mathbf{x}$ such that

$$
A\mathbf{x} = 0.
$$

- It lives in $\mathbb{R}^n$ if $A$ is $m \times n$.
- It represents the "invisible" directions that collapse to zero under the transformation.
- Its dimension is the nullity of $A$.

Example:

$$
A = \begin{bmatrix}  
1 & 2 & 3 \\  
4 & 5 & 6  
\end{bmatrix}.
$$

Solve $A\mathbf{x} = 0$. This yields a null space spanned by one vector, meaning it is a line through the origin in $\mathbb{R}^3$.

#### Column Space vs. Null Space

- Column space: describes outputs ($y$-values that can be reached).
- Null space: describes hidden inputs (directions that vanish).

Together, they capture the full behavior of a matrix.

#### Geometric Interpretation

- In $\mathbb{R}^3$, the column space could be a plane or a line inside 3D space.
- The null space is orthogonal (in a precise sense) to the row space, which we'll study later.
- Understanding both spaces gives a complete picture of how the matrix transforms vectors.

#### Everyday Analogies

- Column space as achievements: Think of the matrix as a machine. The column space is the set of all things the machine can produce.
- Null space as wasted effort: Any input vector in the null space produces nothing at all-like pressing buttons on a broken remote control.
- Teamwork analogy: If each team member contributes along independent directions, the column space is large. If some repeat others' work, redundancy reduces the column space.

#### Why It Matters

1. Subspaces are the natural habitat of linear algebra: almost everything happens inside them.
2. The column space explains what systems $Ax=b$ are solvable.
3. The null space explains why some systems have multiple solutions (free variables).
4. These ideas extend to advanced topics like eigenvectors, SVD, and differential equations.

#### Try It Yourself

1. Show that the set $\{(x,y,0) : x,y \in \mathbb{R}\}$ is a subspace of $\mathbb{R}^3$.
2. For

   $$
   A = \begin{bmatrix}  
   1 & 2 & 3 \\  
   0 & 0 & 0 \\  
   1 & 2 & 3  
   \end{bmatrix},
   $$

   find the column space and its dimension.
3. For the same $A$, compute the null space and its dimension.
4. Challenge: Prove that the null space of $A$ is always a subspace of $\mathbb{R}^n$.

Subspaces-especially the column space and null space-are the first glimpse of the hidden geometry inside every matrix, showing us which directions survive and which vanish.

