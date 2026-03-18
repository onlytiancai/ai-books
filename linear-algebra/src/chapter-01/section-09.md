### 9. Cauchy–Schwarz and Triangle Inequalities

Linear algebra is not only about operations with vectors-it also involves understanding the fundamental relationships between them. Two of the most important results in this regard are the Cauchy–Schwarz inequality and the triangle inequality. These are cornerstones of vector spaces because they establish precise boundaries for lengths, angles, and inner products. Without them, the geometry of linear algebra would fall apart.

#### The Cauchy–Schwarz Inequality

For any two vectors $u$ and $v$ in $\mathbb{R}^n$, the Cauchy–Schwarz inequality states:

$$
|u \cdot v| \leq \|u\| \, \|v\|.
$$

This means that the absolute value of the dot product of two vectors is always less than or equal to the product of their lengths.

Equality holds if and only if u and v are linearly dependent (i.e., one is a scalar multiple of the other).

##### Why It Is True

Recall the geometric formula for the dot product:

$$
u \cdot v = \|u\| \, \|v\| \cos(\theta).
$$

Since $-1 \leq \cos(\theta) \leq 1$, the magnitude of the dot product cannot exceed $\|u\| \, \|v\|$.  
This is exactly the inequality.

##### Example

Let $u = (3, 4)$ and $v = (-4, 3)$.

- Dot product: $(3 \times -4) + (4 \times 3) = -12 + 12 = 0$  
- Norms: $\|u\| = 5$, $\|v\| = 5$  
- Product of norms: $25$  
- $|u \cdot v| = 0 \leq 25$, which satisfies the inequality  

Equality does not hold since they are not multiples - they are perpendicular.

##### Intuition

The inequality tells us that two vectors can never "overlap" more strongly than the product of their magnitudes. If they align perfectly, the overlap is maximum (equality). If they're perpendicular, the overlap is zero.

Think of it as: "the shadow of one vector on another can never be longer than the vector itself."

#### The Triangle Inequality

For any vectors $u$ and $v$, the triangle inequality states:

$$
\|u + v\| \leq \|u\| + \|v\|.
$$

This mirrors the geometric fact that in a triangle, any side is at most as long as the sum of the other two sides.

##### Example

Let $u = (1, 2)$ and $v = (3, 4)$.

- $\|u + v\| = \|(4, 6)\| = \sqrt{16 + 36} = \sqrt{52} \approx 7.21$  
- $\|u\| + \|v\| = \sqrt{5} + 5 \approx 2.24 + 5 = 7.24$  

Indeed, $7.21 \leq 7.24$, very close in this case.

##### Equality Case

The triangle inequality becomes equality when the vectors point in exactly the same direction (or are scalar multiples with nonnegative coefficients). For example, (1, 1) and (2, 2) produce equality because adding them gives a vector whose length equals the sum of their lengths.

#### Everyday Analogies

- Cauchy–Schwarz: Imagine comparing two people's study habits across multiple subjects. Each vector represents hours spent in each subject. The dot product represents how much their habits "align." Cauchy–Schwarz says the alignment can never exceed the product of their individual efforts.
- Triangle inequality: Think of walking in a city. If you want to get from home to the store and then from the store to the park, the total distance is at least as long as going straight from home to the park. There is no shortcut longer than the direct route.

#### Extensions

- These inequalities hold in all inner product spaces, not just ℝⁿ. This means they apply to functions, sequences, and more abstract mathematical objects.
- In Hilbert spaces (infinite-dimensional generalizations), they remain just as essential.

#### Why They Matter

1. They guarantee that the dot product and norm are well-behaved and geometrically meaningful.
2. They ensure that the norm satisfies the requirements of a distance measure: nonnegativity, symmetry, and triangle inequality.
3. They underpin the validity of projections, orthogonality, and least squares methods.
4. They are essential in proving convergence of algorithms, error bounds, and stability in numerical linear algebra.

Without these inequalities, we could not trust that the geometry of vector spaces behaves consistently.

#### Try It Yourself

1. Verify Cauchy–Schwarz for (2, –1, 3) and (–1, 4, 0). Compute both sides.
2. Try the triangle inequality for (–3, 4) and (5, –12). Does equality hold?
3. Find two vectors where Cauchy–Schwarz is an equality. Explain why.
4. Challenge: Prove the triangle inequality in $\mathbb{R}^2$ using only the Pythagorean theorem and algebra, without relying on dot products.

Working through these problems will show you why these inequalities are not abstract curiosities but the structural glue of linear algebra's geometry.

