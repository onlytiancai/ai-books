### 71. Inner Products Beyond Dot Product

The dot product is the first inner product most students encounter. In $\mathbb{R}^n$, it is defined as

$$
\langle x, y \rangle = x \cdot y = \sum_{i=1}^n x_i y_i,
$$

and it provides a way to measure length, angle, and orthogonality. But the dot product is just one special case of a much broader concept. Inner products generalize the dot product, extending its geometric intuition to more abstract vector spaces.

#### Definition of an Inner Product

An inner product on a real vector space $V$ is a function

$$
\langle \cdot, \cdot \rangle : V \times V \to \mathbb{R}
$$

that satisfies the following axioms for all $x,y,z \in V$ and scalar $\alpha \in \mathbb{R}$:

1. Positivity:
   $\langle x, x \rangle \geq 0$, and $\langle x, x \rangle = 0 \iff x=0$.
2. Symmetry:
   $\langle x, y \rangle = \langle y, x \rangle$.
3. Linearity in the first argument:
   $\langle \alpha x + y, z \rangle = \alpha \langle x, z \rangle + \langle y, z \rangle$.

In complex vector spaces, the symmetry condition changes to conjugate symmetry:
$\langle x, y \rangle = \overline{\langle y, x \rangle}$.

#### Norms and Angles from Inner Products

Once an inner product is defined, we immediately get:

- Norm (length):
  $\|x\| = \sqrt{\langle x, x \rangle}$.

- Distance:
  $d(x,y) = \|x-y\|$.

- Angle between vectors:
  $\cos \theta = \frac{\langle x, y \rangle}{\|x\|\|y\|}$.

Thus, inner products generalize the familiar geometry of $\mathbb{R}^n$ to broader contexts.

#### Examples Beyond the Dot Product

1. Weighted Inner Product (in $\mathbb{R}^n$):

   $$
   \langle x, y \rangle_W = x^T W y,
   $$

   where $W$ is a symmetric positive definite matrix.

   - Here, lengths and angles depend on the weights encoded in $W$.
   - Useful when some dimensions are more important than others (e.g., weighted least squares).

2. Function Spaces (continuous inner product):
   On $V = C[a,b]$, the space of continuous functions on $[a,b]$:

   $$
   \langle f, g \rangle = \int_a^b f(t) g(t) \, dt.
   $$

   - Length: $\|f\| = \sqrt{\int_a^b f(t)^2 dt}$.
   - Orthogonality: $f$ and $g$ are orthogonal if their integral product is zero.
   - This inner product underpins Fourier series.

3. Complex Inner Product (in $\mathbb{C}^n$):

   $$
   \langle x, y \rangle = \sum_{i=1}^n x_i \overline{y_i}.
   $$

   - Conjugation ensures positivity.
   - Critical for quantum mechanics, where states are vectors in complex Hilbert spaces.

4. Polynomial Spaces:
   For polynomials on $[-1,1]$:

   $$
   \langle p, q \rangle = \int_{-1}^1 p(x) q(x) \, dx.
   $$

   - Leads to orthogonal polynomials (Legendre, Chebyshev), fundamental in approximation theory.

#### Geometric Interpretation

- Inner products reshape geometry. Instead of measuring lengths and angles with the Euclidean metric, we measure them with the metric induced by the chosen inner product.
- Different inner products create different geometries on the same vector space.

Example: A weighted inner product distorts circles into ellipses, changing which vectors count as "orthogonal."

#### Everyday Analogies

- Weighted voting: In an election, some votes count more; in a weighted inner product, some dimensions of a vector count more.
- Sound and music: The inner product of two signals measures how much one resonates with the other.
- Search engines: Inner products between word-frequency vectors measure document similarity. Different weighting schemes (like TF-IDF) correspond to different inner products.

#### Applications

1. Signal Processing: Correlation between signals is an inner product. Orthogonality means two signals carry independent information.
2. Fourier Analysis: Fourier coefficients come from inner products with sine and cosine functions.
3. Machine Learning: Kernel methods generalize inner products to infinite-dimensional spaces.
4. Quantum Mechanics: Probabilities are squared magnitudes of complex inner products.
5. Optimization: Weighted least squares problems use weighted inner products.

#### Why It Matters

- Inner products generalize geometry to new contexts: weighted spaces, functions, polynomials, quantum states.
- They provide the foundation for defining orthogonality, projections, and orthonormal bases in spaces far beyond $\mathbb{R}^n$.
- They unify ideas across pure mathematics, physics, engineering, and computer science.

#### Try It Yourself

1. Show that the weighted inner product $\langle x, y \rangle_W = x^T W y$ satisfies the inner product axioms if $W$ is positive definite.
2. Compute $\langle f, g \rangle = \int_0^\pi \sin(t)\cos(t)\, dt$. Are $f=\sin$ and $g=\cos$ orthogonal?
3. In $\mathbb{C}^2$, verify that $\langle (1,i), (i,1) \rangle = 0$. What does this mean geometrically?
4. Challenge: Prove that every inner product induces a norm, and that different inner products can lead to different geometries on the same space.

The dot product is just the beginning. Inner products provide the language to extend geometry into weighted spaces, continuous functions, and infinite dimensions-transforming how we measure similarity, distance, and structure across mathematics and science.

