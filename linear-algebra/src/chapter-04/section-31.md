### 31. Axioms of Vector Spaces

Up to now, we have worked with vectors in $\mathbb{R}^2$, $\mathbb{R}^3$, and higher-dimensional Euclidean spaces. But the true power of linear algebra comes from abstracting away from coordinates. A vector space is not tied to arrows in physical space-it is any collection of objects that behave like vectors, provided they satisfy certain rules. These rules are called the axioms of vector spaces.

#### The Idea of a Vector Space

A vector space is a set $V$ equipped with two operations:

1. Vector addition: Combine two vectors in $V$ to get another vector in $V$.
2. Scalar multiplication: Multiply a vector in $V$ by a scalar (a number from a field, usually $\mathbb{R}$ or $\mathbb{C}$).

The magic is that as long as certain rules (axioms) hold, the objects in $V$ can be treated as vectors. They need not be arrows or coordinate lists-they could be polynomials, functions, matrices, or sequences.

#### The Eight Axioms

Let $u, v, w \in V$ (vectors) and $a, b \in \mathbb{R}$ (scalars). The axioms are:

1. Closure under addition: $u + v \in V$.
2. Commutativity of addition: $u + v = v + u$.
3. Associativity of addition: $(u + v) + w = u + (v + w)$.
4. Existence of additive identity: There exists a zero vector $0 \in V$ such that $v + 0 = v$.
5. Existence of additive inverses: For every $v$, there is $-v$ such that $v + (-v) = 0$.
6. Closure under scalar multiplication: $a v \in V$.
7. Distributivity of scalar multiplication over vector addition: $a(u + v) = au + av$.
8. Distributivity of scalar multiplication over scalar addition: $(a + b)v = av + bv$.
9. Associativity of scalar multiplication: $a(bv) = (ab)v$.
10. Existence of multiplicative identity: $1 \cdot v = v$.

(These are sometimes listed as eight, with some grouped together, but the essence is the same.)

#### Examples of Vector Spaces

1. Euclidean spaces: $\mathbb{R}^n$ with standard addition and scalar multiplication.
2. Polynomials: The set of all polynomials with real coefficients, $\mathbb{R}[x]$.
3. Functions: The set of all continuous functions on $[0,1]$, with addition of functions and scalar multiplication.
4. Matrices: The set of all $m \times n$ matrices with real entries.
5. Sequences: The set of all infinite real sequences $(a_1, a_2, \dots)$.

All of these satisfy the vector space axioms.

#### Non-Examples

1. The set of natural numbers $\mathbb{N}$ is not a vector space (no additive inverses).
2. The set of positive real numbers $\mathbb{R}^+$ is not a vector space (not closed under scalar multiplication with negative numbers).
3. The set of polynomials of degree exactly 2 is not a vector space (not closed under addition: $x^2 + x^2 = 2x^2$ is still degree 2, but $x^2 - x^2 = 0$, which is degree 0, not allowed).

These examples show why the axioms are essential: without them, the structure breaks.

#### The Zero Vector

Every vector space must contain a zero vector. This is not optional. It is the "do nothing" element for addition. In $\mathbb{R}^n$, this is $(0,0,\dots,0)$. In polynomials, it is the zero polynomial. In function spaces, it is the function $f(x) = 0$.

#### Additive Inverses

For every vector $v$, we require $-v$. This ensures that equations like $u+v=w$ can always be rearranged to $u=w-v$. Without additive inverses, solving linear equations would not work.

#### Scalars and Fields

Scalars come from a field: usually the real numbers $\mathbb{R}$ or the complex numbers $\mathbb{C}$. The choice of scalars matters:

- Over $\mathbb{R}$, a polynomial space is different from over $\mathbb{C}$.
- Over finite fields (like integers modulo $p$), vector spaces exist in discrete mathematics and coding theory.

#### Geometric Interpretation

- The axioms guarantee that vectors can be added and scaled in predictable ways.
- Closure ensures the space is "self-contained."
- Additive inverses ensure symmetry: every direction can be reversed.
- Distributivity ensures consistency between scaling and addition.

Together, these rules make vector spaces stable and reliable mathematical objects.

#### Everyday Analogies

- Language: Words form sentences by rules of grammar. Vector spaces are sets where addition and scaling follow strict grammar-like rules.
- Music: Notes combine (addition) and change pitch (scaling). A musical space is meaningful only if these operations stay within the system.
- Construction: Bricks and mortar can be combined (addition) and scaled (larger or smaller structures), but only when rules of stability are followed.

#### Why It Matters

1. Vector spaces unify many areas of math under a single framework.
2. They generalize $\mathbb{R}^n$ to functions, polynomials, and beyond.
3. The axioms guarantee that all the tools of linear algebra-span, basis, dimension, linear maps-apply.
4. Recognizing vector spaces in disguise is a major step in advanced math and physics.

#### Try It Yourself

1. Verify that the set of all 2×2 matrices is a vector space under matrix addition and scalar multiplication.
2. Show that the set of polynomials of degree at most 3 is a vector space, but the set of polynomials of degree exactly 3 is not.
3. Check whether the set of all even functions $f(-x) = f(x)$ is a vector space.
4. Challenge: Consider the set of all differentiable functions $f$ on $[0,1]$. Show that this set forms a vector space under the usual operations.

The axioms of vector spaces provide the foundation on which the rest of linear algebra is built. Everything that follows-subspaces, independence, basis, dimension-grows naturally from this formal framework.


