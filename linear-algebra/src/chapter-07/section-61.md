### 61. Eigenvalues and Eigenvectors

Among all the concepts in linear algebra, few are as central and powerful as eigenvalues and eigenvectors. They reveal the hidden "axes of action" of a linear transformation-directions in space where the transformation behaves in the simplest possible way. Instead of mixing and rotating everything, an eigenvector is left unchanged in direction, scaled only by its corresponding eigenvalue.

#### The Core Idea

Let $A$ be an $n \times n$ matrix. A nonzero vector $v \in \mathbb{R}^n$ is called an eigenvector of $A$ if

$$
Av = \lambda v,
$$

for some scalar $\lambda \in \mathbb{R}$ (or $\mathbb{C}$). The scalar $\lambda$ is the eigenvalue corresponding to $v$.

- Eigenvector: A special direction that is preserved by the transformation.
- Eigenvalue: The factor by which the eigenvector is stretched or compressed.

If $\lambda > 1$, the eigenvector is stretched.
If $0 < \lambda < 1$, it is compressed.
If $\lambda < 0$, it is flipped in direction and scaled.
If $\lambda = 0$, the vector is flattened to zero.

#### Why They Matter

Eigenvalues and eigenvectors describe the intrinsic structure of a transformation:

- They give preferred directions in which the action of the matrix is simplest.
- They summarize long-term behavior of repeated applications (e.g., powers of $A$).
- They connect algebra, geometry, and applications in physics, data science, and engineering.

#### Example: A Simple 2D Case

Let

$$
A = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}.
$$

- Applying $A$ to $(1,0)$:

  $$
  A \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 2 \\ 0 \end{bmatrix} = 2 \begin{bmatrix} 1 \\ 0 \end{bmatrix}.
  $$

  So $(1,0)$ is an eigenvector with eigenvalue $2$.

- Applying $A$ to $(0,1)$:

  $$
  A \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ 3 \end{bmatrix} = 3 \begin{bmatrix} 0 \\ 1 \end{bmatrix}.
  $$

  So $(0,1)$ is an eigenvector with eigenvalue $3$.

Here the eigenvectors align with the coordinate axes, and the eigenvalues are the diagonal entries.

#### General Case: The Eigenvalue Equation

To find eigenvalues, we solve

$$
Av = \lambda v \quad \Leftrightarrow \quad (A - \lambda I)v = 0.
$$

For nontrivial $v$, the matrix $(A - \lambda I)$ must be singular:

$$
\det(A - \lambda I) = 0.
$$

This determinant expands to the characteristic polynomial, whose roots are the eigenvalues. Eigenvectors come from solving the corresponding null spaces.

#### Geometric Interpretation

- Eigenvectors are invariant directions. When you apply $A$, the vector may stretch or flip, but it does not rotate off its line.
- Eigenvalues are scaling factors. They describe how much stretching, shrinking, or flipping happens along that invariant direction.

For example:

- In 2D, an eigenvector might be a line through the origin where the transformation acts as a stretch.
- In 3D, planes of shear often have eigenvectors along axes of invariance.

#### Dynamics and Repeated Applications

One reason eigenvalues are so important is that they describe repeated transformations:

$$
A^k v = \lambda^k v.
$$

If you apply $A$ repeatedly to an eigenvector, the result is predictable: just multiply by $\lambda^k$. This explains stability in dynamical systems, growth in population models, and convergence in Markov chains.

- If $|\lambda| < 1$, repeated applications shrink the vector to zero.
- If $|\lambda| > 1$, the vector grows without bound.
- If $\lambda = 1$, the vector stays the same length (though direction may flip if $\lambda=-1$).

#### Everyday Analogies

- Echo in a room: Certain tones (eigenvalues) resonate because the room geometry preserves them.
- Business growth: An eigenvector could represent a stable investment direction, with eigenvalue as the growth multiplier.
- Genetics: Eigenvectors of population models describe stable distributions of traits, eigenvalues describe growth rates.
- Traffic flow: Certain paths remain proportionally consistent over time; eigenvalues determine speed of growth or decay.

#### Applications

1. Physics: Vibrations of molecules, quantum energy levels, and resonance all rely on eigenvalues/eigenvectors.
2. Data Science: Principal Component Analysis (PCA) finds eigenvectors of covariance matrices to detect key directions of variance.
3. Markov Chains: Steady-state probabilities correspond to eigenvectors with eigenvalue 1.
4. Differential Equations: Eigenvalues simplify systems of linear ODEs.
5. Computer Graphics: Transformations like rotations and scalings can be analyzed with eigen-decompositions.

#### Why It Matters

- Eigenvalues and eigenvectors reduce complex transformations to their simplest components.
- They unify algebra (roots of characteristic polynomials), geometry (invariant directions), and applications (stability, resonance, variance).
- They are the foundation for diagonalization, SVD, and spectral analysis, which dominate modern applied mathematics.

#### Try It Yourself

1. Compute the eigenvalues and eigenvectors of
   $\begin{bmatrix} 4 & 2 \\ 1 & 3 \end{bmatrix}$.
2. For $A = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$, find its eigenvalues. (Hint: they are complex.)
3. Take a random 2×2 matrix and check if its eigenvectors align with coordinate axes.
4. Challenge: Prove that eigenvectors corresponding to distinct eigenvalues are linearly independent.

Eigenvalues and eigenvectors are the "fingerprints" of a matrix: they capture the essential behavior of a transformation, guiding us to understand stability, dynamics, and structure across countless disciplines.

