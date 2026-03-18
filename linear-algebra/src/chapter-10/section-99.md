### 99. Numerical Linear Algebra Essentials (Floating Point, BLAS/LAPACK)

Linear algebra in theory is exact: numbers behave like real numbers, operations are deterministic, and results are precise. In practice, computations are carried out on computers, where numbers are represented in finite precision and algorithms must balance speed, accuracy, and stability. This intersection-numerical linear algebra-is what makes linear algebra usable at modern scales.

#### Floating-Point Representation

Real numbers cannot be stored exactly on a digital machine. Instead, they are approximated using the IEEE 754 floating-point standard.

- A floating-point number is stored as:

  $$
  x = \pm (1.m_1 m_2 m_3 \dots) \times 2^e
  $$

  where $m$ is the mantissa and $e$ is the exponent.

- Single precision (float32): 32 bits → ~7 decimal digits of precision.

- Double precision (float64): 64 bits → ~16 decimal digits.

- Machine epsilon ($\epsilon$): The smallest gap between 1 and the next representable number. For double precision, $\epsilon \approx 2.22 \times 10^{-16}$.

Implication: operations like subtraction of nearly equal numbers cause catastrophic cancellation, where significant digits vanish.

#### Conditioning of Problems

A linear algebra problem may be well-posed mathematically but still numerically difficult.

- The condition number of a matrix $A$:

  $$
  \kappa(A) = \|A\| \cdot \|A^{-1}\|.
  $$
- If $\kappa(A)$ is large, small input errors cause large output errors.
- Example: solving $Ax = b$. With ill-conditioned $A$, the computed solution may be unstable even with perfect algorithms.

Geometric intuition: ill-conditioned matrices stretch vectors unevenly, so small perturbations in direction blow up under inversion.

#### Stability of Algorithms

- An algorithm is numerically stable if it controls the growth of errors from finite precision.
- Gaussian elimination with partial pivoting is stable; without pivoting, it may fail catastrophically.
- Orthogonal factorizations (QR, SVD) are usually more stable than elimination methods.

Numerical analysis focuses on designing algorithms that guarantee accuracy within a few multiples of machine epsilon.

#### Direct vs. Iterative Methods

1. Direct methods: Solve in a finite number of steps (e.g., Gaussian elimination, LU decomposition, Cholesky for positive definite systems).

   - Reliable for small/medium problems.
   - Complexity ~ $O(n^3)$.

2. Iterative methods: Generate successive approximations (e.g., Jacobi, Gauss–Seidel, Conjugate Gradient).

   - Useful for very large, sparse systems.
   - Complexity per iteration ~ $O(n^2)$ or less, often leveraging sparsity.

#### Matrix Factorizations in Computation

Many algorithms rely on factorizing a matrix once, then reusing it:

- LU decomposition: Efficient for solving multiple right-hand sides.
- QR factorization: Stable approach for least squares.
- SVD: Gold standard for ill-conditioned problems, though expensive.

These factorizations reduce repeated operations into structured, cache-friendly steps.

#### Sparse vs. Dense Computations

- Dense matrices: Most entries are nonzero. Use dense linear algebra packages like BLAS and LAPACK.
- Sparse matrices: Most entries are zero. Store only nonzeros, use specialized algorithms to avoid wasted computation.

Large-scale problems (e.g., finite element simulations, web graphs) are feasible only because of sparse methods.

#### BLAS and LAPACK: Standard Libraries

- BLAS (Basic Linear Algebra Subprograms): Defines kernels for vector and matrix operations (dot products, matrix–vector, matrix–matrix multiplication). Optimized BLAS implementations exploit cache, SIMD, and multi-core parallelism.
- LAPACK (Linear Algebra PACKage): Builds on BLAS to provide algorithms for solving systems, eigenvalue problems, SVD, etc. LAPACK is the backbone of many scientific computing environments (MATLAB, NumPy, Julia).
- MKL, OpenBLAS, cuBLAS: Vendor-specific implementations optimized for Intel CPUs, open-source systems, or NVIDIA GPUs.

These libraries make the difference between code that runs in minutes and code that runs in milliseconds.

#### Floating-Point Pitfalls

1. Accumulated round-off: Summing numbers of vastly different magnitudes may discard small contributions.
2. Loss of orthogonality: Repeated Gram–Schmidt orthogonalization without reorthogonalization may drift numerically.
3. Overflow/underflow: Extremely large/small numbers exceed representable range.
4. NaNs and Infs: Divide-by-zero or invalid operations propagate errors.

Mitigation: use numerically stable algorithms, scale inputs, and check condition numbers.

#### Parallel and GPU Computing

Modern numerical linear algebra thrives on parallelism:

- GPUs accelerate dense linear algebra with thousands of cores (cuBLAS, cuSOLVER).
- Distributed libraries (ScaLAPACK, PETSc, Trilinos) allow solving problems with billions of unknowns across clusters.
- Mixed precision methods: compute in float32 or even float16, then refine in float64, balancing speed and accuracy.

#### Applications in the Real World

- Engineering simulations: Structural mechanics, fluid dynamics rely on sparse solvers.
- Machine learning: Training deep networks depends on optimized BLAS for matrix multiplications.
- Finance: Risk models solve huge regression problems with factorized covariance matrices.
- Big data: Dimensionality reduction (PCA, SVD) requires large-scale, stable algorithms.

#### Why It Matters

Linear algebra in practice is about more than theorems: it's about turning abstract models into computations that run reliably on imperfect hardware. Numerical linear algebra provides the essential toolkit-floating-point understanding, conditioning analysis, stable algorithms, and optimized libraries-that ensures results are both fast and trustworthy.

#### Try It Yourself

1. Compute the condition number of a nearly singular matrix (e.g., $\begin{bmatrix} 1 & 1 \\ 1 & 1.0001 \end{bmatrix}$) and solve $Ax=b$. Compare results in single vs. double precision.
2. Implement Gaussian elimination with and without pivoting. Compare errors for ill-conditioned matrices.
3. Use NumPy with OpenBLAS to time large matrix multiplications; compare against a naive Python implementation.
4. Explore iterative solvers: implement Conjugate Gradient for a sparse symmetric positive definite system.

Numerical linear algebra is the bridge between mathematical elegance and computational reality. It teaches us that solving equations on a computer is not just about the equations-it's about the algorithms, representations, and hardware that bring them to life.

