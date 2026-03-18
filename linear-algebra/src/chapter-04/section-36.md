### 36. Dimension

Dimension is one of the most profound and unifying ideas in linear algebra. It gives a single number that captures the "size" or "capacity" of a vector space: how many independent directions it has. Unlike length, width, or height in everyday geometry, dimension in linear algebra applies to spaces of any kind-geometric, algebraic, or even function spaces.

#### Definition

The dimension of a vector space $V$ is the number of vectors in any basis of $V$.

- Since all bases of a vector space have the same number of elements, dimension is well-defined.
- If $\dim V = n$, then:

  - Every set of more than $n$ vectors in $V$ is dependent.
  - Every set of exactly $n$ independent vectors forms a basis.

#### Examples in Familiar Spaces

1. $\dim(\mathbb{R}^2) = 2$.

   - Basis: $(1,0), (0,1)$.
   - Two directions cover the whole plane.

2. $\dim(\mathbb{R}^3) = 3$.

   - Basis: $(1,0,0), (0,1,0), (0,0,1)$.
   - Three independent directions span 3D space.

3. The set of all polynomials of degree ≤ 2 has dimension 3.

   - Basis: $\{1, x, x^2\}$.

4. The space of all $m \times n$ matrices has dimension $mn$.

   - Each entry is independent, and the standard basis consists of matrices with a single 1 and the rest 0.

#### Finite vs. Infinite Dimensions

- Finite-dimensional spaces: $\mathbb{R}^n$, polynomials of degree ≤ $k$.
- Infinite-dimensional spaces:

  - The space of all polynomials (no degree limit).
  - The space of all continuous functions.
  - These cannot be spanned by a finite set of vectors.

#### Dimension and Subspaces

- Any subspace of $\mathbb{R}^n$ has dimension ≤ $n$.
- A line through the origin in $\mathbb{R}^3$: dimension 1.
- A plane through the origin in $\mathbb{R}^3$: dimension 2.
- The whole space: dimension 3.
- The trivial subspace $\{0\}$: dimension 0.

#### Dimension and Systems of Equations

When solving $A\mathbf{x} = \mathbf{b}$:

- The dimension of the column space = rank = number of independent directions in the outputs.
- The dimension of the null space = number of free variables.
- By the rank–nullity theorem:

  $$
  \dim(\text{column space}) + \dim(\text{null space}) = \text{number of variables}.
  $$

#### Geometric Meaning

- Dimension counts the minimum number of coordinates needed to describe a vector.
- In $\mathbb{R}^2$, you need 2 numbers.
- In $\mathbb{R}^3$, you need 3 numbers.
- In the polynomial space of degree ≤ 3, you need 4 coefficients.

Thus, dimension = length of coordinate list.

#### Everyday Analogies

- Maps: A flat map needs 2 coordinates (latitude, longitude). A globe is 3D and needs 3. Adding altitude makes it 3D as well.
- Languages: To describe meaning, you need enough independent words. Redundant words don't add dimension; new independent concepts do.
- Recipes: To describe all possible flavors, you need a certain number of independent ingredients. More ingredients = higher-dimensional "flavor space."

#### Checking Dimension in Practice

1. Place candidate vectors as columns of a matrix.
2. Row reduce to echelon form.
3. Count pivots. That number = dimension of the span of those vectors.

#### Why It Matters

1. Dimension is the most fundamental measure of a vector space.
2. It tells us how "large" or "complex" the space is.
3. It sets absolute limits: in $\mathbb{R}^n$, no more than $n$ independent vectors exist.
4. It underlies coordinate systems, bases, and transformations.
5. It bridges geometry (lines, planes, volumes) with algebra (solutions, equations, matrices).

#### Try It Yourself

1. What is the dimension of the span of $(1,2,3)$, $(2,4,6)$, $(0,0,0)$?
2. Find the dimension of the subspace of $\mathbb{R}^3$ defined by $x+y+z=0$.
3. Prove that the set of all $2 \times 2$ symmetric matrices has dimension 3.
4. Challenge: Show that the space of polynomials of degree ≤ $k$ has dimension $k+1$.

Dimension is the measuring stick of linear algebra: it tells us how many independent pieces of information are needed to describe the whole space.

