### 73. Gram–Schmidt Process

The Gram–Schmidt process is a systematic method for turning any linearly independent set of vectors into an orthonormal basis. This process is one of the most elegant bridges between algebra and geometry: it takes arbitrary vectors and makes them mutually perpendicular, while preserving the span.

#### The Problem It Solves

Given a set of linearly independent vectors $\{v_1, v_2, \dots, v_n\}$ in an inner product space:

- They span some subspace $W$.
- But they are not necessarily orthogonal or normalized.

Goal: Construct an orthonormal basis $\{u_1, u_2, \dots, u_n\}$ for $W$.

#### The Gram–Schmidt Algorithm

1. Start with the first vector:

   $$
   u_1 = \frac{v_1}{\|v_1\|}.
   $$

2. For the second vector, subtract the projection onto $u_1$:

   $$
   w_2 = v_2 - \langle v_2, u_1 \rangle u_1, \quad u_2 = \frac{w_2}{\|w_2\|}.
   $$

3. For the third vector, subtract projections onto both $u_1$ and $u_2$:

   $$
   w_3 = v_3 - \langle v_3, u_1 \rangle u_1 - \langle v_3, u_2 \rangle u_2, \quad u_3 = \frac{w_3}{\|w_3\|}.
   $$

4. Continue inductively:

   $$
   w_k = v_k - \sum_{j=1}^{k-1} \langle v_k, u_j \rangle u_j, \quad u_k = \frac{w_k}{\|w_k\|}.
   $$

At each step, $w_k$ is made orthogonal to all previous $u_j$, and then normalized to form $u_k$.

#### Example in $\mathbb{R}^2$

Start with $v_1 = (1,1)$, $v_2 = (1,0)$.

1. Normalize first vector:

   $$
   u_1 = \frac{(1,1)}{\sqrt{2}} = \left(\tfrac{1}{\sqrt{2}}, \tfrac{1}{\sqrt{2}}\right).
   $$

2. Subtract projection of $v_2$ on $u_1$:

   $$
   w_2 = (1,0) - \left(\tfrac{1}{\sqrt{2}}\cdot1 + \tfrac{1}{\sqrt{2}}\cdot0\right)\left(\tfrac{1}{\sqrt{2}}, \tfrac{1}{\sqrt{2}}\right).
   $$

   $$
   = (1,0) - \tfrac{1}{\sqrt{2}}\left(\tfrac{1}{\sqrt{2}}, \tfrac{1}{\sqrt{2}}\right).
   $$

   $$
   = (1,0) - (0.5,0.5) = (0.5,-0.5).
   $$

3. Normalize:

   $$
   u_2 = \frac{(0.5,-0.5)}{\sqrt{0.5^2+(-0.5)^2}} = \frac{(0.5,-0.5)}{\sqrt{0.5}} = \left(\tfrac{1}{\sqrt{2}}, -\tfrac{1}{\sqrt{2}}\right).
   $$

Final orthonormal basis:

$$
u_1 = \left(\tfrac{1}{\sqrt{2}}, \tfrac{1}{\sqrt{2}}\right), \quad u_2 = \left(\tfrac{1}{\sqrt{2}}, -\tfrac{1}{\sqrt{2}}\right).
$$

#### Geometric Intuition

- Each step removes "overlap" with previously chosen directions.
- Think of it as building new perpendicular coordinate axes inside the span of the original vectors.
- The result is like rotating and scaling the original set into a perfectly orthogonal system.

#### Numerical Stability

- Classical Gram–Schmidt can suffer from round-off errors in computer calculations.
- A numerically stable alternative is Modified Gram–Schmidt (MGS), which reorders the projection steps to reduce loss of orthogonality.
- In practice, QR factorization algorithms often implement MGS or Householder reflections.

#### Everyday Analogies

- Teamwork: If two teammates overlap in their roles, Gram–Schmidt reallocates effort until each works independently.
- Noise filtering: Orthogonal components separate useful signals from redundancy.
- Cooking recipe: Adjusting ingredients so that each adds a unique flavor, without duplicating what's already present.

#### Applications

1. QR Factorization: Gram–Schmidt provides the foundation: $A = QR$, where $Q$ is orthogonal and $R$ is upper triangular.
2. Data Compression: Orthonormal bases from Gram–Schmidt lead to efficient representations.
3. Signal Processing: Ensures independent frequency or wave components.
4. Machine Learning: Used in orthogonalization of features and dimensionality reduction.
5. Physics: Orthogonal states in quantum mechanics can be constructed from arbitrary states using Gram–Schmidt.

#### Why It Matters

- Gram–Schmidt guarantees that any independent set can be reshaped into an orthonormal basis.
- It underlies computational methods like QR decomposition, least squares, and numerical PDE solvers.
- It makes projections, coordinates, and orthogonality explicit and manageable.

#### Try It Yourself

1. Apply Gram–Schmidt to $(1,0,1)$, $(1,1,0)$, $(0,1,1)$ in $\mathbb{R}^3$. Verify orthonormality.
2. Show that the span of the orthonormal basis equals the span of the original vectors.
3. Use Gram–Schmidt to find an orthonormal basis for polynomials $\{1,x,x^2\}$ on $[-1,1]$ with inner product $\langle f,g\rangle = \int_{-1}^1 f(x)g(x)\,dx$.
4. Challenge: Prove that Gram–Schmidt always works for linearly independent sets, but fails if the set is dependent.

The Gram–Schmidt process is the algorithmic heart of orthogonality: it takes the messy and redundant and reshapes it into clean, perpendicular building blocks for the spaces we study.

