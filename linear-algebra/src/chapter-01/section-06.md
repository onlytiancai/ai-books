### 6. Dot Product (Algebraic and Geometric Views)

The dot product is one of the most fundamental operations in linear algebra. It looks like a simple formula, but it unlocks the ability to measure angles, detect orthogonality, project one vector onto another, and compute energy or work in physics. Understanding it requires seeing both the algebraic view (a formula on components) and the geometric view (a way to compare directions).

#### Algebraic Definition

For two vectors of the same dimension, $u = (u_1, u_2, \ldots, u_n)$ and $v = (v_1, v_2, \ldots, v_n)$, the dot product is defined as:

$$
u \cdot v = u_1 v_1 + u_2 v_2 + \cdots + u_n v_n.
$$

This is simply multiplying corresponding components and summing the results.

Examples:

- $(2, 3) \cdot (4, 5) = (2 \times 4) + (3 \times 5) = 8 + 15 = 23$  
- $(1, -2, 3) \cdot (0, 4, -1) = (1 \times 0) + (-2 \times 4) + (3 \times -1) = 0 - 8 - 3 = -11$

Notice that the dot product is always a scalar, not a vector.

#### Geometric Definition

The dot product can also be defined in terms of vector length and angle:

$$
u \cdot v = \|u\| \, \|v\| \cos(\theta),
$$

where $\theta$ is the angle between $u$ and $v$ ($0^\circ \leq \theta \leq 180^\circ$).

This formula tells us:

- If the angle is acute (less than $90^\circ$), $\cos(\theta) > 0$, so the dot product is positive.  
- If the angle is right (exactly $90^\circ$), $\cos(\theta) = 0$, so the dot product is 0.  
- If the angle is obtuse (greater than $90^\circ$), $\cos(\theta) < 0$, so the dot product is negative.  

Thus, the sign of the dot product encodes directional alignment.

#### Connecting the Two Definitions

At first glance, the algebraic sum of products and the geometric length–angle formula seem unrelated. But they are equivalent. To see why, consider the law of cosines applied to a triangle formed by u, v, and u – v. Expanding both sides leads directly to the equivalence between the two formulas. This dual interpretation is what makes the dot product so powerful: it is both a computation rule and a geometric measurement.

#### Orthogonality

Two vectors are orthogonal (perpendicular) if and only if their dot product is zero:

$$
u \cdot v = 0 \;\;\Longleftrightarrow\;\; \theta = 90^\circ.
$$

This gives us an algebraic way to check for perpendicularity without drawing diagrams.  

Example:  
$(2, 1) \cdot (-1, 2) = (2 \times -1) + (1 \times 2) = -2 + 2 = 0$,  
so the vectors are orthogonal.

#### Projections

The dot product also provides a way to project one vector onto another.  
The scalar projection of $u$ onto $v$ is:

$$
\text{proj}_{\text{scalar}}(u \text{ onto } v) = \frac{u \cdot v}{\|v\|}.
$$

The vector projection is then:

$$
\text{proj}_{\text{vector}}(u \text{ onto } v) = \frac{u \cdot v}{\|v\|^2} \, v.
$$

This allows us to decompose vectors into "parallel" and "perpendicular" components, which is central in geometry, physics, and data analysis.

#### Examples

1. Compute $u = (3, 4)$ and $v = (4, 3)$.

   - Dot product: $(3 \times 4) + (4 \times 3) = 12 + 12 = 24$.  
   - Norms: $\|u\| = 5$, $\|v\| = 5$.  
   - $\cos(\theta) = \tfrac{24}{5 \times 5} = \tfrac{24}{25} \approx 0.96$, so $\theta \approx 16^\circ$.  
     These vectors are nearly parallel.

2. Compute $u = (1, 2, -1)$ and $v = (2, -1, 1)$.

   - Dot product: $(1 \times 2) + (2 \times -1) + (-1 \times 1) = 2 - 2 - 1 = -1$.  
   - Norms: $\|u\| = \sqrt{6}$, $\|v\| = \sqrt{6}$.  
   - $\cos(\theta) = \tfrac{-1}{\sqrt{6} \times \sqrt{6}} = -\tfrac{1}{6}$, so $\theta \approx 99.6^\circ$.  
     Slightly obtuse.

#### Physical Interpretation

In physics, the dot product computes work:

$$
\text{Work} = \text{Force} \cdot \text{Displacement}
           = \|\text{Force}\| \, \|\text{Displacement}\| \cos(\theta).
$$

Only the component of the force in the direction of motion contributes. If you push straight down on a box while trying to move it horizontally, the dot product is zero: no work is done in the direction of motion.

#### Everyday Analogies

- Teamwork analogy: Two people pushing a car. If they push in nearly the same direction, the dot product is large and positive (strong cooperation). If they push at right angles, the dot product is zero (they don't help each other). If they push in opposite directions, the dot product is negative (they work against each other).
- Conversation analogy: Think of two ideas. If they're aligned, the "dot product" of their meanings is high. If they're unrelated, it's zero. If they contradict, it's negative.

#### Algebraic Properties

- Commutative: $u \cdot v = v \cdot u$  
- Distributive: $u \cdot (v + w) = u \cdot v + u \cdot w$  
- Scalar compatibility: $(c \cdot u) \cdot v = c \,(u \cdot v)$  
- Non-negativity: $v \cdot v = \|v\|^2 \geq 0$  

These guarantee that the dot product behaves consistently and meshes with the structure of vector spaces.


#### Why It Matters

The dot product is the first bridge between algebra and geometry. It:

- Defines angles and orthogonality in higher dimensions.
- Powers projections and decompositions, which underlie least squares, regression, and data fitting.
- Appears in physics as energy, power, and work.
- Serves as the kernel of many machine learning methods (e.g., similarity measures in high-dimensional spaces).

Without the dot product, linear algebra would lack a way to connect numbers with geometry and meaning.

#### Try It Yourself

1. Compute (2, –1) · (–3, 4). Then find the angle between them.
2. Check if (1, 2, 3) and (2, 4, 6) are orthogonal. What does the dot product tell you?
3. Find the projection of (3, 1) onto (1, 2). Draw the original vector, the projection, and the perpendicular component.
4. In physics terms: Suppose a 10 N force is applied at 60° to the direction of motion, and the displacement is 5 m. How much work is done?

These exercises reveal the dual power of the dot product: as a formula to compute and as a geometric tool to interpret.

