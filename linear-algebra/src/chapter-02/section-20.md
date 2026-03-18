### 20. Computing with Matrices (Cost Counts and Simple Speedups)

Thus far, we have studied what matrices are and what they represent. But in practice, working with matrices also means thinking about computation-how much work operations take, how algorithms can be sped up, and why structure matters. This section introduces the basic ideas of computational cost in matrix operations, simple strategies for efficiency, and why these considerations are crucial in modern applications.

#### Counting Operations: The Cost Model

The simplest way to measure the cost of a matrix operation is to count the basic arithmetic operations (additions and multiplications).

- Matrix–vector product:
  For an $m \times n$ matrix and an $n \times 1$ vector:

  - Each of the $m$ output entries requires $n$ multiplications and $n-1$ additions.
  - Total cost ≈ $2mn$ operations.

- Matrix–matrix product:
  For an $m \times n$ matrix times an $n \times p$ matrix:

  - Each of the $mp$ entries requires $n$ multiplications and $n-1$ additions.
  - Total cost ≈ $2mnp$ operations.

- Gaussian elimination (solving $Ax=b$):
  For an $n \times n$ system:

  - Roughly $\tfrac{2}{3}n^3$ operations.

These counts show how quickly costs grow with dimension. Doubling $n$ makes the work 8 times larger for elimination.

#### Why Cost Counts Matter

1. Scalability: Small problems (2×2 or 3×3) are trivial, but modern datasets involve matrices with millions of rows. Knowing the cost is essential.
2. Feasibility: Some exact algorithms become impossible for very large matrices. Approximation methods are used instead.
3. Optimization: Engineers and scientists design specialized algorithms to reduce costs by exploiting structure (sparsity, symmetry, triangular form).

#### Simple Speedups with Structure

- Diagonal Matrices: Multiplying by a diagonal matrix costs only $n$ operations (scale each component).
- Triangular Matrices: Solving triangular systems requires only $\tfrac{1}{2}n^2$ operations (substitution), far cheaper than general elimination.
- Sparse Matrices: If most entries are zero, we skip multiplications by zero. For large sparse systems, cost scales with the number of nonzeros, not $n^2$.
- Block Matrices: Breaking matrices into blocks allows algorithms to reuse optimized small-matrix routines (common in BLAS libraries).

#### Memory Considerations

Cost is not only arithmetic: storage also matters.

- A dense $n \times n$ matrix requires $n^2$ entries of memory.
- Sparse storage formats (like CSR, COO) record only nonzero entries and their positions, saving massive space.
- Memory access speed can dominate arithmetic cost in large computations.

#### Parallelism and Hardware

Modern computing leverages hardware for speed:

- Vectorization (SIMD): Perform many multiplications at once.
- Parallelization: Split work across many CPU cores.
- GPUs: Specialize in massive parallel matrix–vector and matrix–matrix operations (critical in deep learning).

This is why linear algebra libraries (BLAS, LAPACK, cuBLAS) are indispensable: they squeeze performance from hardware.

#### Everyday Analogies

- Cooking: Preparing one dish is easy. Preparing 100 dishes means thinking about batch size, oven space, and parallel steps.
- Budgeting: Adding two small budgets by hand is fine; merging thousands of spreadsheets requires software and structure.
- Travel: Driving across town is quick. Driving cross-country requires fuel planning, route optimization, and rest stops-scale changes everything.

#### Why It Matters

1. Efficiency: Understanding cost lets us choose the right algorithm for the job.
2. Algorithm design: Structured matrices (diagonal, sparse, orthogonal) make computations much faster and more stable.
3. Applications: Every field that uses matrices-graphics, optimization, statistics, AI-relies on efficient computation.
4. Foundations: Later topics like LU/QR/SVD factorization are motivated by balancing cost and stability.

#### Try It Yourself

1. Compute the number of operations required for multiplying a 1000×500 matrix with a 500×200 matrix. Compare with multiplying a 1000×1000 dense matrix by a vector.
2. Show how solving a 3×3 triangular system is faster than Gaussian elimination. Count the exact multiplications and additions.
3. Construct a sparse 5×5 matrix with only 7 nonzero entries. Estimate the cost of multiplying it by a vector versus a dense 5×5 matrix.
4. Challenge: Suppose you need to store a 1,000,000×1,000,000 dense matrix. Estimate how much memory (in bytes) it would take if each entry is 8 bytes. Could it fit on a laptop? Why do sparse formats save the day?

By learning to count costs and exploit structure, you prepare yourself not only to understand matrices abstractly but also to use them effectively in real-world, large-scale problems. This balance between theory and computation is at the heart of modern linear algebra.

#### Closing 
```
Patterns intertwine,
transformations gently fold,
structure in the square.
```

## Chapter 3. Linear Systems and Elimination 

