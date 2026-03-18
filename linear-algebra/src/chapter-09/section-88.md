### 88. Matrix Norms and Singular Values (Measuring Size Properly)

In linear algebra, we often need to measure the "size" of a matrix. For vectors, this is straightforward: the length (norm) tells us how big the vector is. But for matrices, the question is more subtle: do we measure size by entries, by how much the matrix stretches vectors, or by some invariant property? Different contexts demand different answers, and matrix norms-closely tied to singular values-provide the framework for doing so.

#### Why Measure the Size of a Matrix?

1. Stability: To know how much error a matrix might amplify.
2. Conditioning: The ratio of largest to smallest stretching.
3. Optimization: Many algorithms minimize some matrix norm.
4. Data analysis: Norms measure complexity or energy of data.

Without norms, we cannot compare matrices, analyze sensitivity, or judge approximation quality.

#### Matrix Norms from Vector Norms

A natural way to define a matrix norm is to ask: *How much does this matrix stretch vectors?*

Formally, for a given vector norm $\|\cdot\|$:

$$
\|A\| = \max_{x \neq 0} \frac{\|Ax\|}{\|x\|}.
$$

This is called the induced matrix norm.

#### The 2-Norm and Singular Values

When we use the Euclidean norm ($\|x\|_2$) for vectors, the induced matrix norm becomes:

$$
\|A\|_2 = \sigma_{\max}(A),
$$

the largest singular value of $A$.

- This means the 2-norm measures the *maximum stretching factor*.
- Geometrically: $A$ maps the unit sphere into an ellipse; $\|A\|_2$ is the length of the ellipse's longest axis.

This link makes singular values the natural language for matrix size.

#### Other Common Norms

1. Frobenius Norm

$$
\|A\|_F = \sqrt{\sum_{i,j} |a_{ij}|^2}.
$$

- Equivalent to the Euclidean length of all entries stacked in one big vector.
- Can also be expressed as:

  $$
  \|A\|_F^2 = \sum_i \sigma_i^2.
  $$
- Often used in data science and machine learning because it is easy to compute and differentiable.

2. 1-Norm

$$
\|A\|_1 = \max_j \sum_i |a_{ij}|,
$$

the maximum absolute column sum.

3. Infinity Norm

$$
\|A\|_\infty = \max_i \sum_j |a_{ij}|,
$$

the maximum absolute row sum.

Both are computationally cheap, useful in numerical analysis.

4. Nuclear Norm (Trace Norm)

$$
\|A\|_* = \sum_i \sigma_i,
$$

the sum of singular values.

- Important in low-rank approximation and machine learning (matrix completion, recommender systems).

#### Singular Values as the Unifying Thread

- Spectral norm (2-norm): maximum singular value.
- Frobenius norm: root of the sum of squared singular values.
- Nuclear norm: sum of singular values.

Thus, norms capture different ways of summarizing singular values: maximum, sum, or energy.

#### Example: Small Matrix

Take

$$
A = \begin{bmatrix}3 & 4 \\ 0 & 0\end{bmatrix}.
$$

- Singular values: $\sigma_1 = 5, \sigma_2 = 0$.
- $\|A\|_2 = 5$.
- $\|A\|_F = \sqrt{3^2 + 4^2} = 5$.
- $\|A\|_* = 5$.

Here, different norms coincide, but generally they highlight different aspects of the matrix.

#### Geometric Intuition

- 2-norm: "How much can $A$ stretch a vector?"
- Frobenius norm: "What is the overall energy in all entries?"
- 1-norm / ∞-norm: "What is the heaviest column or row load?"
- Nuclear norm: "How much total stretching power does $A$ have?"

Each is a lens, giving a different perspective.

#### Everyday Analogies

- Car performance:

  - Top speed = spectral norm (max stretch).
  - Average fuel usage = Frobenius norm (overall energy).
  - Total mileage cost = nuclear norm (total contribution).
- Team output:

  - Strongest player = spectral norm.
  - Combined effort = Frobenius norm.
  - Collective capacity = nuclear norm.

#### Applications

1. Numerical Stability: Condition number $\kappa(A) = \sigma_{\max}/\sigma_{\min}$ uses the spectral norm.
2. Machine Learning: Nuclear norm is used for matrix completion (Netflix Prize).
3. Image Compression: Frobenius norm measures reconstruction error.
4. Control Theory: 1-norm and ∞-norm bound system responses.
5. Optimization: Norms serve as penalties or constraints, shaping solutions.

#### Why It Matters

Matrix norms provide the language to compare, approximate, and control matrices. Singular values ensure that this language is not arbitrary but grounded in geometry. Together, they explain how matrices distort space, how error grows, and how we can measure complexity.

#### Try It Yourself

1. For $A = \begin{bmatrix}1 & 2 \\ 3 & 4\end{bmatrix}$, compute $\|A\|_1$, $\|A\|_\infty$, $\|A\|_F$, and $\|A\|_2$ (using SVD for the last). Compare.
2. Prove that $\|A\|_F^2 = \sum \sigma_i^2$.
3. Show that $\|A\|_2 \leq \|A\|_F \leq \|A\|_*$. Interpret geometrically.
4. Consider a rank-1 matrix $uv^T$. What are its norms? Which are equal?

Matrix norms and singular values are the measuring sticks of linear algebra-they tell us not just how big a matrix is, but how it acts, where it is stable, and when it is fragile.

