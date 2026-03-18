### 72. Orthogonality and Orthonormal Bases

Orthogonality is one of the most powerful ideas in linear algebra. It generalizes the familiar concept of perpendicularity in Euclidean space to abstract vector spaces equipped with an inner product. When orthogonality is combined with normalization (making vectors have unit length), we obtain orthonormal bases, which simplify computations, clarify geometry, and underpin many algorithms.

#### Orthogonality

Two vectors $x, y \in V$ are orthogonal if

$$
\langle x, y \rangle = 0.
$$

- In $\mathbb{R}^2$ or $\mathbb{R}^3$, this means the vectors are perpendicular.
- In function spaces, it means the integral of their product is zero.
- In signal processing, it means the signals are independent and non-overlapping.

Orthogonality captures the idea of "no overlap" or "independence" under the geometry of the inner product.

#### Properties of Orthogonal Vectors

1. If $x \perp y$, then $\|x+y\|^2 = \|x\|^2 + \|y\|^2$ (Pythagoras' theorem generalized).
2. Orthogonality is symmetric: if $x \perp y$, then $y \perp x$.
3. Any set of mutually orthogonal nonzero vectors is automatically linearly independent.

This last property is critical: orthogonality guarantees independence.

#### Orthonormal Sets

An orthonormal set is a collection of vectors $\{u_1, \dots, u_k\}$ such that

$$
\langle u_i, u_j \rangle = \begin{cases} 
1 & \text{if } i=j, \\ 
0 & \text{if } i \neq j.  
\end{cases}
$$

- Each vector has unit length.
- Distinct vectors are mutually orthogonal.

This structure makes computations with coordinates as simple as possible.

#### Orthonormal Bases

A basis $\{u_1, \dots, u_n\}$ for a vector space is orthonormal if it is orthonormal as a set.

- Any vector $x \in V$ can be written as

  $$
  x = \sum_{i=1}^n \langle x, u_i \rangle u_i.
  $$
- The coefficients are just inner products, no need to solve systems of equations.

This is why orthonormal bases are the most convenient: they make representation and projection effortless.

#### Examples

1. Standard Basis in $\mathbb{R}^n$:
   $\{e_1, e_2, \dots, e_n\}$, where $e_i$ has 1 in the $i$-th coordinate and 0 elsewhere.

   - Orthonormal under the standard dot product.

2. Fourier Basis:
   Functions $\{\sin(nx), \cos(nx)\}$ on $[0,2\pi]$ are orthogonal under the inner product
   $\langle f,g\rangle = \int_0^{2\pi} f(x)g(x)dx$.

   - This basis decomposes signals into pure frequencies.

3. Polynomial Basis:
   Legendre polynomials $P_n(x)$ are orthogonal on $[-1,1]$ with respect to
   $\langle f,g\rangle = \int_{-1}^1 f(x)g(x)\,dx$.

#### Geometric Meaning

Orthogonality splits space into independent "directions."

- Orthonormal bases are like perfectly aligned coordinate axes.
- Any vector decomposes uniquely as a sum of independent contributions along these axes.
- Distances and angles are preserved, making the geometry transparent.

#### Everyday Analogies

- Sound frequencies: Each note in a chord can be separated if the notes are orthogonal (independent frequencies).
- Data analysis: Orthogonal axes correspond to independent features.
- Sports: Offense and defense in a game are orthogonal roles-different but both necessary.
- Finance: Orthogonal portfolios have no correlation-risk in one does not affect the other.

#### Applications

1. Signal Processing: Decompose signals into orthogonal frequency components.
2. Machine Learning: Principal components form an orthonormal basis capturing variance directions.
3. Numerical Methods: Orthonormal bases improve numerical stability.
4. Quantum Mechanics: States are orthogonal if they represent mutually exclusive outcomes.
5. Computer Graphics: Rotations are represented by orthogonal matrices with orthonormal columns.

#### Why It Matters

- Orthogonality provides independence; orthonormality provides normalization.
- Together they make computations, decompositions, and projections clean and efficient.
- They underlie Fourier analysis, principal component analysis, and countless modern algorithms.

#### Try It Yourself

1. Show that $\{(1,0,0), (0,1,0), (0,0,1)\}$ is an orthonormal basis of $\mathbb{R}^3$.
2. Check whether $\{(1,1,0), (1,-1,0), (0,0,1)\}$ is orthonormal under the dot product. If not, normalize it.
3. Compute the coefficients of $x=(3,4)$ in the basis $\{(1,0), (0,1)\}$ and in the rotated orthonormal basis $\{(1/\sqrt{2}, 1/\sqrt{2}), (-1/\sqrt{2}, 1/\sqrt{2})\}$.
4. Challenge: Prove that in any finite-dimensional inner product space, an orthonormal basis always exists (hint: Gram–Schmidt).

Orthogonality and orthonormal bases are the backbone of linear algebra: they transform messy problems into elegant decompositions, giving us the cleanest possible language for describing vectors, signals, and data.

