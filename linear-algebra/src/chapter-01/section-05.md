### 5. Length (Norm) and Distance

So far, vectors have been arrows with direction and components. To compare them more meaningfully, we need ways to talk about how long they are and how far apart they are. These notions are formalized through the norm of a vector (its length) and the distance between vectors. These concepts tie together the algebra of components and the geometry of space.

#### The Length (Norm) of a Vector

The norm of a vector measures its magnitude, or how long the arrow is.  
For a vector $v = (v_1, v_2, \ldots, v_n)$ in $n$-dimensional space, its norm is defined as:

$$
\|v\| = \sqrt{v_1^2 + v_2^2 + \cdots + v_n^2}.
$$

This formula comes directly from the Pythagorean theorem: the length of the hypotenuse equals the square root of the sum of squares of the legs.  
In 2D, this is the familiar distance formula between the origin and a point.

Examples:

- For $v = (3, 4)$:  
  $$
  \|v\| = \sqrt{3^2 + 4^2} = \sqrt{9 + 16} = 5.
  $$  

- For $w = (1, -2, 2)$:  
  $$
  \|w\| = \sqrt{1^2 + (-2)^2 + 2^2} = \sqrt{1 + 4 + 4} = \sqrt{9} = 3.
  $$


#### Unit Vectors

A unit vector is a vector whose length is exactly 1.  
These are important because they capture direction without scaling.  
To create a unit vector from any nonzero vector, divide by its norm:

$$
u = \frac{v}{\|v\|}.
$$

Example:  
For $v = (3, 4)$, the unit vector is

$$
u = \left(\tfrac{3}{5}, \tfrac{4}{5}\right).
$$

This points in the same direction as $(3, 4)$ but has length 1.

Unit vectors are like pure directions.  
They're especially useful for projections, defining coordinate systems, and normalizing data.

#### Distance Between Vectors

The distance between two vectors $u$ and $v$ is defined as the length of their difference:

$$
\text{dist}(u, v) = \|u - v\|.
$$

Example:  
Let $u = (2, 1)$ and $v = (5, 5)$. Then

$$
u - v = (-3, -4).
$$

Its norm is

$$
\sqrt{(-3)^2 + (-4)^2} = \sqrt{9 + 16} = 5.
$$

So the distance is 5. This matches our intuition: the straight-line distance between points $(2, 1)$ and $(5, 5)$.

#### Geometric Interpretation

- The norm tells you how far a point is from the origin.
- The distance tells you how far two points are from each other.

Both are computed with the same formula-the square root of sums of squares-but applied in slightly different contexts.

#### Different Kinds of Norms

The formula above defines the Euclidean norm (or $\ell_2$ norm), the most common one.  
But in linear algebra, other norms are also useful:

- $\ell_1$ norm:  
  $$
  \|v\|_1 = |v_1| + |v_2| + \cdots + |v_n|
  $$  
  (sum of absolute values).

- $\ell_\infty$ norm:  
  $$
  \|v\|_\infty = \max(|v_1|, |v_2|, \ldots, |v_n|)
  $$  
  (largest component).

These norms change the geometry of "length" and "distance." For example, in the ℓ₁ norm, the unit circle is shaped like a diamond; in the ℓ∞ norm, it looks like a square.

#### Everyday Analogies

- Walking distance in a city: If streets are on a grid, the ℓ₁ norm (sum of absolute differences) is more natural than the Euclidean norm.
- Climbing stairs: The Euclidean norm is like measuring the diagonal distance, but step by step you may actually walk an ℓ₁ distance.
- Measuring error in data: Different norms capture different notions of "closeness" between predictions and reality. Euclidean distance punishes large errors heavily; ℓ₁ treats all errors equally.

#### Algebraic Properties

Norms and distances satisfy critical properties that make them consistent measures:

- Non-negativity: $\|v\| \geq 0$, and $\|v\| = 0$ only if $v = 0$.  
- Homogeneity: $\|c \cdot v\| = |c| \, \|v\|$ (scaling affects length predictably).  
- Triangle inequality: $\|u + v\| \leq \|u\| + \|v\|$ (the direct path is shortest).  
- Symmetry (for distance): $\text{dist}(u, v) = \text{dist}(v, u)$.  

These properties are why norms and distances are robust tools across mathematics.

#### Why It Matters

Understanding length and distance is the first step toward geometry in higher dimensions. These notions:

- Allow us to compare vectors quantitatively.
- Form the basis of concepts like angles, orthogonality, and projections.
- Underpin optimization problems (e.g., "find the closest vector" is central to machine learning).
- Define the geometry of spaces, which changes dramatically depending on which norm you use.

#### Try It Yourself

1. Compute the norm of (6, 8). Then divide by the norm to find its unit vector.
2. Find the distance between (1, 1, 1) and (4, 5, 6).
3. Compare the Euclidean and Manhattan (ℓ₁) distances between (0, 0) and (3, 4). Which one matches your intuition if you were walking along a city grid?
4. Challenge: For vectors u = (2, –1, 3) and v = (–2, 0, 1), compute ‖u – v‖. Then explain what this distance means geometrically.

By working through these examples, you'll see how norms and distances make abstract vectors feel as real as points and arrows you can measure in everyday life.

