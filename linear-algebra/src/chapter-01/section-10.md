### 10. Orthonormal sets in $\mathbb{R}^2$ and $\mathbb{R}^3$

Up to now, we've discussed vectors, their lengths, angles, and how to project one onto another. A natural culmination of these ideas is the concept of orthonormal sets. These are collections of vectors that are not only orthogonal (mutually perpendicular) but also normalized (each of length 1). Orthonormal sets form the cleanest, most efficient coordinate systems in linear algebra. They are the mathematical equivalent of having rulers at right angles, perfectly calibrated to unit length.

#### Orthogonal and Normalized

Let's break the term "orthonormal" into two parts:

- Orthogonal: Two vectors $u$ and $v$ are orthogonal if $u \cdot v = 0$.  
  In $\mathbb{R}^2$, this means the vectors meet at a right angle.  
  In $\mathbb{R}^3$, it means they form perpendicular directions.  

- Normalized: A vector $v$ is normalized if its length is $1$, i.e., $\|v\| = 1$.  
  Such vectors are called unit vectors.

When we combine both conditions, we get orthonormal vectors: vectors that are both perpendicular to each other and have unit length.

#### Orthonormal Sets in $\mathbb{R}^2$

In two dimensions, an orthonormal set typically consists of two vectors.  
A classic example is:

$e_1 = (1, 0), \quad e_2 = (0, 1)$

- Dot product: $e_1 \cdot e_2 = (1 \times 0 + 0 \times 1) = 0 \;\;\Rightarrow\;\;$ orthogonal  
- Lengths: $\|e_1\| = 1$, $\|e_2\| = 1 \;\;\Rightarrow\;\;$ normalized  

Thus, $\{e_1, e_2\}$ is an orthonormal set.  
In fact, this is the standard basis for $\mathbb{R}^2$.  
Any vector $(x, y)$ can be written as $x e_1 + y e_2$.  
This is the simplest coordinate system.

#### Orthonormal Sets in $\mathbb{R}^3$

In three dimensions, an orthonormal set usually has three vectors.  
The standard basis is:

$e_1 = (1, 0, 0), \quad e_2 = (0, 1, 0), \quad e_3 = (0, 0, 1)$

- Each pair has dot product zero, so they are orthogonal  
- Each has length $1$, so they are normalized  
- Together, they span all of $\mathbb{R}^3$  

Geometrically, they correspond to the $x$-, $y$-, and $z$-axes in 3D space.  
Any vector $(x, y, z)$ can be written as a linear combination $x e_1 + y e_2 + z e_3$.

#### Beyond the Standard Basis

The standard basis is not the only orthonormal set. For example:

$u = \left(\tfrac{1}{\sqrt{2}}, \tfrac{1}{\sqrt{2}}\right), \quad 
 v = \left(-\tfrac{1}{\sqrt{2}}, \tfrac{1}{\sqrt{2}}\right)$

- Dot product: $(\tfrac{1}{\sqrt{2}})(-\tfrac{1}{\sqrt{2}}) + (\tfrac{1}{\sqrt{2}})(\tfrac{1}{\sqrt{2}}) = -\tfrac{1}{2} + \tfrac{1}{2} = 0$  
- Lengths: $\sqrt{(\tfrac{1}{\sqrt{2}})^2 + (\tfrac{1}{\sqrt{2}})^2} = \sqrt{\tfrac{1}{2} + \tfrac{1}{2}} = 1$  

So $\{u, v\}$ is also orthonormal in $\mathbb{R}^2$.  
These vectors are rotated $45^\circ$ relative to the standard axes.  

Similarly, in $\mathbb{R}^3$, you can construct rotated orthonormal sets (such as unit vectors along diagonals), as long as the conditions of perpendicularity and unit length hold.

#### Properties of Orthonormal Sets

1. Simplified coordinates: If $\{v_1, \ldots, v_k\}$ is an orthonormal set, then for any vector $u$ in their span, the coefficients are easy to compute:  
   $$
   c_i = u \cdot v_i
   $$  
   This is much simpler than solving systems of equations.

2. Pythagorean theorem generalized: If vectors are orthonormal, the squared length of their sum is the sum of the squares of their coefficients.  
   For example, if $u = a v_1 + b v_2$, then  
   $$
   \|u\|^2 = a^2 + b^2
   $$

3. Projection is easy: Projecting onto an orthonormal set is straightforward — just take dot products.

4. Matrices become nice: When vectors form the columns of a matrix, orthonormality makes that matrix an orthogonal matrix, which has special properties: its transpose equals its inverse, and it preserves lengths and angles.

#### Importance in $\mathbb{R}^2$ and $\mathbb{R}^3$

- In geometry, orthonormal bases correspond to coordinate axes.
- In physics, they represent independent directions of motion or force.
- In computer graphics, orthonormal sets define camera axes and object rotations.
- In engineering, they simplify stress, strain, and rotation analysis.

Even though $\mathbb{R}^2$ and $\mathbb{R}^3$ are relatively simple, the same ideas extend naturally to higher dimensions, where visualization is impossible but the algebra is identical.

#### Everyday Analogies

- Navigating a city: Imagine two perpendicular streets, each marked in meters. Walking 3 units east and 4 units north gives coordinates (3, 4). That's an orthonormal system.
- Furniture assembly: When you're told to align one part "straight up" and another "straight across," you're working with orthonormal directions.
- Digital screens: Computer monitors use pixel grids aligned horizontally and vertically, a practical realization of orthonormality.

#### Why Orthonormal Sets Matter

Orthonormality is the gold standard for building bases in linear algebra:

- It makes calculations fast and simple.
- It ensures numerical stability in computations (important in algorithms and simulations).
- It underpins key decompositions like QR factorization, singular value decomposition (SVD), and spectral theorems.
- It provides the cleanest way to think about space: orthogonal, independent directions scaled to unit length.

Whenever possible, mathematicians and engineers prefer orthonormal bases over arbitrary ones.

#### Try It Yourself

1. Verify that (3/5, 4/5) and (–4/5, 3/5) form an orthonormal set in $\mathbb{R}^2$.
2. Construct three orthonormal vectors in $\mathbb{R}^3$ that are not the standard basis. Hint: start with (1/√2, 1/√2, 0) and build perpendiculars.
3. For u = (2, 1), compute its coordinates relative to the orthonormal set {(1/√2, 1/√2), (–1/√2, 1/√2)}.
4. Challenge: Prove that if {v₁, …, vₖ} is orthonormal, then the matrix with these as columns is orthogonal, i.e., QᵀQ = I.

Through these exercises, you will see how orthonormal sets make every aspect of linear algebra-from projections to decompositions-simpler, cleaner, and more powerful.

#### Closing 
```
Lengths, angles revealed,
projections trace hidden lines,
clarity takes shape.
```

## Chapter 2. Matrices and basic operations 

#### Opening 
```
Rows and columns meet,
woven grids of silent rules,
machines of order.
```

