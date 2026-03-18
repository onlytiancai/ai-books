### 7. Angles Between Vectors and Cosine

Having defined the dot product, we are now ready to measure angles between vectors. In everyday life, angles tell us how two lines or directions relate-whether they point the same way, are perpendicular, or are opposed. In linear algebra, the dot product and cosine function give us a precise, generalizable way to define angles in any dimension, not just in 2D or 3D. This section explores how we compute, interpret, and apply vector angles.

#### The Definition of an Angle Between Vectors

For two nonzero vectors $u$ and $v$, the angle $\theta$ between them is defined by:

$$
\cos(\theta) = \frac{u \cdot v}{\|u\| \, \|v\|}.
$$

This formula comes directly from the geometric definition of the dot product.  
Rearranging gives:

$$
\theta = \arccos\!\left(\frac{u \cdot v}{\|u\| \, \|v\|}\right).
$$

Key points:

- $\theta$ is always between $0^\circ$ and $180^\circ$ (or $0$ and $\pi$ radians).  
- The denominator normalizes the dot product by dividing by the product of lengths, so the result is dimensionless and always between $-1$ and $1$.  
- The cosine value directly encodes alignment: positive, zero, or negative.

#### Interpretation of Cosine Values

The cosine tells us about the directional relationship:

- $\cos(\theta) = 1 \;\;\Rightarrow\;\; \theta = 0^\circ$ → vectors point in exactly the same direction.  
- $\cos(\theta) = 0 \;\;\Rightarrow\;\; \theta = 90^\circ$ → vectors are orthogonal (perpendicular).  
- $\cos(\theta) = -1 \;\;\Rightarrow\;\; \theta = 180^\circ$ → vectors point in exactly opposite directions.  
- $\cos(\theta) > 0$ → acute angle → vectors point more “together” than apart.  
- $\cos(\theta) < 0$ → obtuse angle → vectors point more “against” each other.

Thus, the cosine compresses geometric alignment into a single number.

#### Examples

1. $u = (1, 0), \; v = (0, 1)$

   - Dot product: $1 \times 0 + 0 \times 1 = 0$  
   - Norms: $1$ and $1$  
   - $\cos(\theta) = 0 \;\Rightarrow\; \theta = 90^\circ$  
   The vectors are perpendicular, as expected.

2. $u = (2, 3), \; v = (4, 6)$

   - Dot product: $(2 \times 4) + (3 \times 6) = 8 + 18 = 26$  
   - Norms: $\sqrt{2^2 + 3^2} = \sqrt{13}$, and $\sqrt{4^2 + 6^2} = \sqrt{52} = 2\sqrt{13}$  
   - $\cos(\theta) = \tfrac{26}{\sqrt{13} \cdot 2\sqrt{13}} = \tfrac{26}{26} = 1$  
   - $\theta = 0^\circ$  
   These vectors are multiples, so they align perfectly.

3. $u = (1, 1), \; v = (-1, 1)$

   - Dot product: $(1 \times -1) + (1 \times 1) = -1 + 1 = 0$  
   - $\cos(\theta) = 0 \;\Rightarrow\; \theta = 90^\circ$  
   The vectors are perpendicular, forming diagonals of a square.

#### Angles in Higher Dimensions

The beauty of the formula is that it works in any dimension.  
Even in $\mathbb{R}^{100}$ or higher, we can define the angle between two vectors using only their dot product and norms.  

While we cannot visualize the geometry directly in high dimensions, the cosine formula still captures how aligned two directions are:

$$
\cos(\theta) = \frac{u \cdot v}{\|u\| \, \|v\|}.
$$

This is critical in machine learning, where data often lives in very high-dimensional spaces.

#### Cosine Similarity

The cosine of the angle between two vectors is often called cosine similarity. It is widely used in data analysis and machine learning to measure how similar two data vectors are, independent of their magnitude.

- In text mining, documents are turned into word-frequency vectors. Cosine similarity measures how "close in topic" two documents are, regardless of length.
- In recommendation systems, cosine similarity compares user preference vectors to suggest similar users or items.

This demonstrates how a geometric concept extends far beyond pure math.

#### Orthogonality Revisited

The angle formula reinforces the special role of orthogonality.  
If $\cos(\theta) = 0$, then $u \cdot v = 0$.  

This means the dot product not only computes length but also serves as a direct test for perpendicularity.  
This algebraic shortcut is far easier than manually checking geometric right angles.

#### Angles and Projections

Angles are closely tied to projections.  
The length of the projection of $u$ onto $v$ is $\|u\|\cos(\theta)$.  

If the angle is small, the projection is large — most of $u$ lies in the direction of $v$.  
If the angle is close to $90^\circ$, the projection shrinks toward zero.  

Thus, the cosine acts as a scaling factor between directions.

#### Everyday Analogies

- Teamwork analogy: If two people push a heavy object, the effectiveness of their combined effort depends on the angle.  
  If they push in nearly the same direction (small $\theta$), they cooperate efficiently.  
  If they push at right angles ($\theta = 90^\circ$), they waste effort.  
  If they push opposite each other ($\theta \approx 180^\circ$), they cancel out.  

- Conversation analogy: If two people's opinions align ($\cos \theta \approx 1$), they agree strongly.  
  If they are orthogonal ($\cos \theta = 0$), they are unrelated.  
  If they oppose each other ($\cos \theta \approx -1$), they fundamentally disagree.  

- Navigation analogy: If two roads meet at a small angle, their directions are similar.  
  If they cross perpendicularly, their directions are independent.

#### Why It Matters

Angles between vectors provide:

- A way to generalize geometry beyond 2D/3D.
- A measure of similarity in high-dimensional data.
- The foundation for orthogonality, projections, and decomposition of spaces.
- A tool for optimization: in gradient descent, for example, the angle between the gradient and step direction determines how effectively we reduce error.

Without the ability to measure angles, we could not connect algebraic manipulations with geometric intuition or practical applications.

#### Try It Yourself

1. Compute the angle between (2, 1) and (1, –1). Interpret the result.
2. Find two vectors in 3D that form a 60° angle. Verify using the cosine formula.
3. Consider word vectors for "cat" and "dog" in a machine learning model. Why might cosine similarity be a better measure of similarity than Euclidean distance?
4. Challenge: In $\mathbb{R}^3$, find a vector orthogonal to both (1, 2, 3) and (3, 2, 1). What angle does it make with each of them?

By experimenting with these problems, you will see how angles provide the missing link between algebraic formulas and geometric meaning in linear algebra.

