### 18. Trace and Basic Matrix Properties

So far we have studied shapes, multiplication rules, and special classes of matrices. In this section we introduce a simple but surprisingly powerful quantity: the trace of a matrix. Along with it, we review a set of basic matrix properties that provide shortcuts, invariants, and insights into how matrices behave.

#### Definition of the Trace

For a square matrix $A = [a_{ij}]$ of size $n \times n$, the trace is the sum of the diagonal entries:

$$
\text{tr}(A) = a_{11} + a_{22} + \cdots + a_{nn}.
$$

Example:

$$
A = \begin{bmatrix} 
2 & 5 & 7 \\ 
0 & 3 & 1 \\ 
4 & 6 & 8 
\end{bmatrix}, 
\quad 
\text{tr}(A) = 2 + 3 + 8 = 13.
$$

The trace extracts a single number summarizing the "diagonal content" of a matrix.

#### Properties of the Trace

The trace is linear and interacts nicely with multiplication and transposition:

1. Linearity:

   - $\text{tr}(A + B) = \text{tr}(A) + \text{tr}(B)$.
   - $\text{tr}(cA) = c \cdot \text{tr}(A)$.

2. Cyclic Property:

   - $\text{tr}(AB) = \text{tr}(BA)$, as long as the products are defined.
   - More generally, $\text{tr}(ABC) = \text{tr}(BCA) = \text{tr}(CAB)$.
   - But in general, $\text{tr}(AB) \neq \text{tr}(A)\text{tr}(B)$.

3. Transpose Invariance:

   - $\text{tr}(A^T) = \text{tr}(A)$.

4. Similarity Invariance:

   - If $B = P^{-1}AP$, then $\text{tr}(B) = \text{tr}(A)$.
   - This means the trace is a similarity invariant, depending only on the linear transformation, not the basis.

#### Trace and Eigenvalues

One of the most important connections is between the trace and eigenvalues:

$$
\text{tr}(A) = \lambda_1 + \lambda_2 + \cdots + \lambda_n,
$$

where $\lambda_i$ are the eigenvalues of $A$ (counting multiplicity).

This links the simple diagonal sum to the deep spectral properties of the matrix.

Example:

$$
A = \begin{bmatrix} 1 & 0 \\ 0 & 3 \end{bmatrix}, \quad 
\text{tr}(A) = 4, \quad 
\lambda_1 = 1, \; \lambda_2 = 3, \quad \lambda_1 + \lambda_2 = 4.
$$

#### Other Basic Matrix Properties

Alongside the trace, here are some important algebraic facts that every student of linear algebra must know:

1. Determinant vs. Trace:

   - For 2×2 matrices, $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$,
     $\text{tr}(A) = a + d$,
     $\det(A) = ad - bc$.
   - Together, trace and determinant encode the eigenvalues: roots of $x^2 - \text{tr}(A)x + \det(A) = 0$.

2. Norms and Inner Products:

   - The Frobenius norm is defined using the trace:
     $\|A\|_F = \sqrt{\text{tr}(A^TA)}$.

3. Orthogonal Invariance:

   - For any orthogonal matrix $Q$,
     $\text{tr}(Q^TAQ) = \text{tr}(A)$.

#### Geometric and Practical Meaning

- The trace of a transformation can be seen as the sum of its action along the coordinate axes.
- In physics, the trace of the stress tensor measures pressure.
- In probability, the trace of a covariance matrix is the total variance of a system.
- In statistics and machine learning, the trace is often used as a measure of overall "size" or complexity of a model.

#### Everyday Analogies

- Grades on report card: The trace is like summing the "main subjects" (diagonal entries) without looking at electives (off-diagonal entries).
- Company budget: The diagonal could represent department totals, and the trace is the grand total.
- Lighting system: Imagine each diagonal entry is a light switch brightness for each room; the trace is the sum total brightness in the building.

#### Why It Matters

The trace is deceptively simple but incredibly powerful:

1. It connects directly to eigenvalues, forming a bridge between raw matrix entries and spectral theory.
2. It is invariant under similarity, making it a reliable measure of a transformation independent of basis.
3. It shows up in optimization, physics, statistics, and quantum mechanics.
4. It simplifies computations: many proofs in linear algebra reduce to trace properties.

#### Try It Yourself

1. Compute the trace of

$$
\begin{bmatrix} 
4 & 2 & 0 \\ 
-1 & 3 & 5 \\ 
7 & 6 & 1 
\end{bmatrix}.
$$

2. Verify that $\text{tr}(AB) = \text{tr}(BA)$ for

$$
A = \begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}, \quad 
B = \begin{bmatrix} 4 & 0 \\ 5 & 6 \end{bmatrix}.
$$

3. For the 2×2 matrix

$$
\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix},
$$

compute its eigenvalues and check that their sum equals the trace.

4. Challenge: Show that the total variance of a dataset with covariance matrix $\Sigma$ is equal to $\text{tr}(\Sigma)$.

Mastering the trace and its properties will prepare you for the next leap: understanding how matrices interact with volume, orientation, and determinants.

