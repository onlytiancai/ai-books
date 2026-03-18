### 62. The Characteristic Polynomial

To uncover the eigenvalues of a matrix, we use a central tool: the characteristic polynomial. This polynomial encodes the relationship between a matrix and its eigenvalues. The roots of the polynomial are precisely the eigenvalues, making it the algebraic gateway to spectral analysis.

#### Definition

For a square matrix $A \in \mathbb{R}^{n \times n}$, the characteristic polynomial is defined as

$$
p_A(\lambda) = \det(A - \lambda I).
$$

- $I$ is the identity matrix of the same size as $A$.
- The polynomial $p_A(\lambda)$ has degree $n$.
- The eigenvalues of $A$ are exactly the roots of $p_A(\lambda)$.

#### Why This Works

The eigenvalue equation is

$$
Av = \lambda v \quad \iff \quad (A - \lambda I)v = 0.
$$

For nontrivial $v$, the matrix $A - \lambda I$ must be singular:

$$
\det(A - \lambda I) = 0.
$$

Thus, eigenvalues are precisely the scalars $\lambda$ for which the determinant vanishes.

#### Example: 2×2 Case

Let

$$
A = \begin{bmatrix} 4 & 2 \\ 1 & 3 \end{bmatrix}.
$$

Compute:

$$
p_A(\lambda) = \det \begin{bmatrix} 4-\lambda & 2 \\ 1 & 3-\lambda \end{bmatrix}.
$$

Expanding:

$$
p_A(\lambda) = (4-\lambda)(3-\lambda) - 2.
$$

$$
= \lambda^2 - 7\lambda + 10.
$$

The roots are $\lambda = 5$ and $\lambda = 2$. These are the eigenvalues of $A$.

#### Example: 3×3 Case

For

$$
B = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 3 & 4 \\ 0 & 4 & 9 \end{bmatrix},
$$

$$
p_B(\lambda) = \det \begin{bmatrix} 2-\lambda & 0 & 0 \\ 0 & 3-\lambda & 4 \\ 0 & 4 & 9-\lambda \end{bmatrix}.
$$

Expand:

$$
p_B(\lambda) = (2-\lambda)\big[(3-\lambda)(9-\lambda) - 16\big].
$$

$$
= (2-\lambda)(\lambda^2 - 12\lambda + 11).
$$

Roots: $\lambda = 2, 1, 11$.

#### Properties of the Characteristic Polynomial

1. Degree: Always degree $n$.
2. Leading term: $(-1)^n \lambda^n$.
3. Constant term: $\det(A)$.
4. Coefficient of $\lambda^{n-1}$: $-\text{tr}(A)$, where $\text{tr}(A)$ is the trace (sum of diagonal entries).

So:

$$
p_A(\lambda) = (-1)^n \lambda^n + (\text{tr}(A))(-1)^{n-1}\lambda^{n-1} + \cdots + \det(A).
$$

This ties together trace, determinant, and eigenvalues in one polynomial.

#### Geometric Meaning

- The roots of the characteristic polynomial tell us scaling factors along invariant directions.
- In 2D: the polynomial encodes area scaling ($\det(A)$) and total stretching ($\text{tr}(A)$).
- In higher dimensions: it condenses the complexity of $A$ into a single equation whose solutions reveal the spectrum.

#### Everyday Analogies

- Fingerprint: The characteristic polynomial uniquely identifies the eigenvalues of a matrix, much like a fingerprint identifies a person.
- Recipe proportions: Just as ratios determine taste, the coefficients of the polynomial encode how trace and determinant control eigenvalues.
- Financial portfolio: The polynomial summarizes growth rates (eigenvalues) into one compact formula.

#### Applications

1. Eigenvalue computation: Foundation for diagonalization and spectral theory.
2. Control theory: Stability of systems depends on eigenvalues (roots of the characteristic polynomial).
3. Differential equations: Characteristic polynomials describe natural frequencies and modes of oscillation.
4. Graph theory: The characteristic polynomial of an adjacency matrix encodes structural properties of the graph.
5. Quantum mechanics: Energy levels of quantum systems come from solving characteristic polynomials of operators.

#### Why It Matters

- Provides a systematic, algebraic way to find eigenvalues.
- Connects trace and determinant to deeper spectral properties.
- Bridges linear algebra, polynomial theory, and geometry.
- Forms the foundation for modern computational methods like QR iteration.

#### Try It Yourself

1. Compute the characteristic polynomial of
   $\begin{bmatrix} 1 & 1 \\ 0 & 2 \end{bmatrix}$.
   Find its eigenvalues.
2. Verify that the product of eigenvalues equals the determinant.
3. Verify that the sum of eigenvalues equals the trace.
4. Challenge: Prove that $p_{AB}(\lambda) = p_{BA}(\lambda)$ for any $A, B$ of the same size.

The characteristic polynomial distills a matrix into a single algebraic object whose roots reveal the essential dynamics of the transformation.

