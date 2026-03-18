### 55. The Multiplicative Property of Determinants: $\det(AB) = \det(A)\det(B)$

One of the most remarkable and useful facts about determinants is that they multiply across matrix products. For two square matrices of the same size,

$$
\det(AB) = \det(A) \cdot \det(B).
$$

This property is fundamental: it connects algebra (matrix multiplication) with geometry (scaling volumes) and is essential for proofs, computations, and applications across mathematics, physics, and engineering.

#### The Statement in Words

- If you first apply a linear transformation $B$, and then apply $A$, the total scaling of space is the product of their individual scalings.
- Determinants track exactly this: the signed volume change under linear transformations.

#### Geometric Intuition

Think of $\det(A)$ as the signed scale factor by which $A$ changes volume.

1. Apply $B$: a unit cube becomes some parallelepiped with volume $|\det(B)|$.
2. Apply $A$: the new parallelepiped scales again by $|\det(A)|$.
3. Total effect: volume scales by $|\det(A)| \times |\det(B)|$.

The orientation flips are also consistent: if both flip (negative determinants), the total orientation is preserved (positive product).

#### Algebraic Reasoning

The proof can be approached in multiple ways:

1. Row Operations and Elimination:

   - $A$ and $B$ can be factored into elementary matrices (row swaps, scalings, replacements).
   - Determinants behave predictably for each operation.
   - Since both sides agree for elementary operations and determinant is multiplicative, the identity holds in general.

2. Abstract Characterization:

   - Determinants are the unique multilinear alternating functions normalized at the identity.
   - Composition of linear maps preserves this property, so multiplicativity follows.

#### Small Cases

- 2×2 matrices:

  $$
  A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}, \quad 
  B = \begin{bmatrix} e & f \\ g & h \end{bmatrix}.
  $$

  Compute $AB$, then $\det(AB)$. After expansion, you find:
  $\det(AB) = (ad - bc)(eh - fg) = \det(A)\det(B).$

- 3×3 matrices:
  A direct computation is messy, but the property still holds and is consistent with elimination proofs.

#### Key Consequences

1. Determinant of a Power:

   $$
   \det(A^k) = (\det(A))^k.
   $$

   Geometric meaning: applying the same transformation $k$ times multiplies volume scale repeatedly.

2. Inverse Matrix:
   If $A$ is invertible,

   $$
   \det(A^{-1}) = \frac{1}{\det(A)}.
   $$

3. Eigenvalues:
   Since $\det(A)$ is the product of eigenvalues, this property matches the fact that eigenvalues multiply under matrix multiplication (when considered via characteristic polynomials).

#### Geometric Meaning in Higher Dimensions

- If $B$ scales space by 3 and flips it (det = –3), and $A$ scales by 2 without flipping (det = 2), then $AB$ scales by –6, consistent with the rule.
- Determinants encapsulate both magnitude (volume scaling) and sign (orientation). Multiplicativity ensures these combine correctly.

#### Everyday Analogies

- Economics: If a policy doubles output (factor 2) and another policy triples it (factor 3), combined effect is sixfold.
- Cooking: Scaling a recipe by 2, then again by 3, multiplies the final volume by 6.
- Maps: If one map projection scales area by 4 and another zooms out by 1/2, the total scaling is 2.

#### Applications

1. Change of Variables in Calculus: The Jacobian determinant follows this multiplicative rule, ensuring transformations compose consistently.
2. Group Theory: $\det$ defines a group homomorphism from the general linear group $GL_n$ to the nonzero reals under multiplication.
3. Numerical Analysis: Determinant multiplicativity underlies LU decomposition methods.
4. Physics: In mechanics and relativity, volume elements transform consistently under successive transformations.
5. Cryptography and Coding Theory: Determinants in modular arithmetic rely on this multiplicative property to preserve structure.

#### Why It Matters

- Guarantees consistency: determinants match our intuition about scaling.
- Simplifies computation: determinants of factorizations can be obtained by multiplying smaller pieces.
- Provides theoretical structure: $\det$ is a homomorphism, embedding linear algebra into the algebra of scalars.

#### Try It Yourself

1. Verify $\det(AB) = \det(A)\det(B)$ for

   $$
   A = \begin{bmatrix} 2 & 1 \\ 0 & 3 \end{bmatrix}, \quad 
   B = \begin{bmatrix} 1 & 4 \\ 0 & -2 \end{bmatrix}.
   $$
2. Prove that $\det(A^{-1}) = 1/\det(A)$ using the multiplicative rule.
3. Show that if $\det(A)=0$, then $\det(AB)=0$ for any $B$. Explain why this makes sense geometrically.
4. Challenge: Using row operations, show explicitly how multiplicativity emerges from properties of elementary matrices.

The rule $\det(AB) = \det(A)\det(B)$ transforms determinants from a mysterious calculation into a natural and consistent measure of how linear transformations combine.

