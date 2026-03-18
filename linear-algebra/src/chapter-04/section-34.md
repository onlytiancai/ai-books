### 34. Linear Independence and Dependence

Having introduced span and generating sets, the natural question arises: *when are the vectors in a spanning set truly necessary, and when are some redundant?* This leads to the idea of linear independence. It is the precise way to distinguish between essential vectors (those that add new directions) and dependent vectors (those that can be expressed in terms of others).

#### Definition of Linear Independence

A set of vectors $\{v_1, v_2, \dots, v_k\}$ is linearly independent if the only solution to

$$
a_1 v_1 + a_2 v_2 + \dots + a_k v_k = 0
$$

is

$$
a_1 = a_2 = \dots = a_k = 0.
$$

If there exists a nontrivial solution (some $a_i \neq 0$), then the vectors are linearly dependent.

#### Intuition

- Independent vectors point in genuinely different directions.
- Dependent vectors overlap: at least one can be built from the others.
- In terms of span: removing a dependent vector does not shrink the span, because it adds no new direction.

#### Simple Examples in $\mathbb{R}^2$

1. $(1,0)$ and $(0,1)$ are independent.

   - Equation $a(1,0) + b(0,1) = (0,0)$ forces $a = b = 0$.
2. $(1,0)$ and $(2,0)$ are dependent.

   - Equation $2(1,0) - (2,0) = (0,0)$ shows dependence.
3. Any set of 3 vectors in $\mathbb{R}^2$ is dependent, since the dimension of the space is 2.

#### Examples in $\mathbb{R}^3$

1. $(1,0,0), (0,1,0), (0,0,1)$ are independent.
2. $(1,2,3), (2,4,6)$ are dependent, since the second is just 2× the first.
3. $(1,0,1), (0,1,1), (1,1,2)$ are dependent: the third is the sum of the first two.

#### Detecting Independence with Matrices

Put the vectors as columns in a matrix. Perform row reduction:

- If every column has a pivot → the set is independent.
- If some column is free → the set is dependent.

Example:

$$
\begin{bmatrix}  
1 & 2 & 3 \\  
0 & 1 & 4 \\  
0 & 0 & 0  
\end{bmatrix}.
$$

Here the third column has no pivot → the 3rd vector is dependent on the first two.

#### Relationship with Dimension

- In $\mathbb{R}^n$, at most $n$ independent vectors exist.
- If you have more than $n$, dependence is guaranteed.
- A basis of a vector space is simply a maximal independent set that spans the space.

#### Geometric Interpretation

- Independent vectors = different directions.
- Dependent vectors = one vector lies in the span of others.
- In 2D: two independent vectors span the plane.
- In 3D: three independent vectors span the space.

#### Everyday Analogies

- Ideas in a meeting: Independent ideas contribute new insights. Dependent ideas repeat what others already said.
- Recipes: Having salt, sugar, and flour gives three distinct ingredients. But having sugar and "2× sugar" is not new-it's dependent.
- Travel directions: North and east are independent. North and "2× north" are dependent.

#### Why It Matters

1. Independence ensures a generating set is minimal and efficient.
2. It determines whether a system of vectors is a basis.
3. It connects directly to rank: rank = number of independent columns (or rows).
4. It is crucial in geometry, data compression, and machine learning-where redundancy must be identified and removed.

#### Try It Yourself

1. Test whether $(1,2)$ and $(2,4)$ are independent.
2. Are the vectors $(1,0,0), (0,1,0), (1,1,0)$ independent in $\mathbb{R}^3$?
3. Place the vectors $(1,0,1), (0,1,1), (1,1,2)$ into a matrix and row-reduce to check independence.
4. Challenge: Prove that any set of $n+1$ vectors in $\mathbb{R}^n$ is linearly dependent.

Linear independence is the tool that separates essential directions from redundant ones. It is the key to defining bases, counting dimensions, and understanding the structure of all vector spaces.

