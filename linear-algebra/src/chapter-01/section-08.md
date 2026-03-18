### 8. Projections and Decompositions

In earlier sections, we saw how the dot product measures alignment and how the cosine formula gives us angles between vectors. The next natural step is to use these tools to project one vector onto another. Projection is a way to "shadow" one vector onto the direction of another, splitting vectors into meaningful parts: one along a given direction and one perpendicular to it. This is the essence of decomposition, and it is everywhere in linear algebra, geometry, physics, and data science.

#### Scalar Projection

The scalar projection of a vector $u$ onto a vector $v$ measures how much of $u$ lies in the direction of $v$. It is given by:

$$
\text{proj}_{\text{scalar}}(u \text{ onto } v) = \frac{u \cdot v}{\|v\|}.
$$

- If this value is positive, $u$ has a component pointing in the same direction as $v$.  
- If it is negative, $u$ points partly in the opposite direction.  
- If it is zero, $u$ is completely perpendicular to $v$.  

Example:  
$u = (3, 4)$, $v = (1, 0)$.  
Dot product: $(3 \times 1 + 4 \times 0) = 3$.  
$\|v\| = 1$.  
So the scalar projection is $3$. This tells us $u$ has a "shadow" of length $3$ on the $x$-axis.

#### Vector Projection

The vector projection gives the actual arrow in the direction of $v$ that corresponds to this scalar amount:

$$
\text{proj}_{\text{vector}}(u \text{ onto } v) = \frac{u \cdot v}{\|v\|^2} \, v.
$$

This formula normalizes $v$ into a unit vector, then scales it by the scalar projection.  
The result is a new vector lying along $v$, capturing exactly the "parallel" part of $u$.

Example:  
$u = (3, 4)$, $v = (1, 2)$

- Dot product: $3 \times 1 + 4 \times 2 = 3 + 8 = 11$  
- Norm squared of $v$: $(1^2 + 2^2) = 5$  
- Coefficient: $11 / 5 = 2.2$  
- Projection vector: $2.2 \cdot (1, 2) = (2.2, 4.4)$  

So the part of $(3, 4)$ in the direction of $(1, 2)$ is $(2.2, 4.4)$.


#### Perpendicular Component

Once we have the projection, we can find the perpendicular component (often called the rejection) simply by subtracting:

$$
u_{\perp} = u - \text{proj}_{\text{vector}}(u \text{ onto } v).
$$

This gives the part of $u$ that is entirely orthogonal to $v$.

Example continued:  
$u_{\perp} = (3, 4) - (2.2, 4.4) = (0.8, -0.4)$

Check:  
$(0.8, -0.4) \cdot (1, 2) = 0.8 \times 1 + (-0.4) \times 2 = 0.8 - 0.8 = 0$.  
Indeed, orthogonal.

#### Geometric Picture

Projection is like dropping a perpendicular from one vector onto another. Imagine shining a light perpendicular to v: the shadow of u on the line spanned by v is the projection. This visualization explains why projections split vectors naturally into two pieces:

- Parallel part: Along the line of v.
- Perpendicular part: Orthogonal to v, forming a right angle.

Together, these two parts reconstruct the original vector exactly.

#### Decomposition of Vectors

Every vector $u$ can be decomposed relative to another vector $v$ into two parts:

$$
u = \text{proj}_{\text{vector}}(u \text{ onto } v) + \big(u - \text{proj}_{\text{vector}}(u \text{ onto } v)\big).
$$

This decomposition is unique and geometrically meaningful.  
It generalizes to subspaces: we can project onto entire planes or higher-dimensional spans, splitting a vector into a "within-subspace" part and a "perpendicular-to-subspace" part.


#### Applications

1. Physics (Work and Forces):
   Work is the projection of force onto displacement. Only the part of the force in the direction of motion contributes.
   Example: Pushing on a sled partly sideways wastes effort-the sideways component projects to zero.

2. Geometry and Engineering:
   Projections are used in CAD (computer-aided design) to flatten 3D objects onto 2D surfaces, like blueprints or shadows.

3. Computer Graphics:
   Rendering 3D scenes onto a 2D screen is fundamentally a projection process.

4. Data Science:
   Projecting high-dimensional data onto a lower-dimensional subspace (like the first two principal components in PCA) makes patterns visible while preserving as much information as possible.

5. Signal Processing:
   Decomposition into projections onto sine and cosine waves forms the basis of Fourier analysis, which powers audio, image, and video compression.

#### Everyday Analogies

- Flashlight shadow: Imagine shining a flashlight so that a stick casts a shadow on the floor. The shadow is the projection of the stick onto the floor plane.
- Team effort: If two people pull a box, the effective progress in one person's direction is the projection of the other's pull onto that direction.
- Grades analogy: If your performance is a mix of effort and distraction, the projection onto "effort" shows how much of your work aligns with real progress.

#### Algebraic Properties

- Projections are linear: proj(u + w) = proj(u) + proj(w).
- The perpendicular part is always orthogonal to the direction of projection.
- The decomposition is unique: no other pair of parallel and perpendicular vectors will reconstruct u.
- The projection operator onto a unit vector v̂ satisfies: proj(u) = (v̂ v̂ᵀ)u, showing how projection can be expressed in matrix form.

#### Why It Matters

Projection is not just a geometric trick; it is the core of many advanced topics:

- Least squares regression is finding the projection of a data vector onto the span of predictor vectors.
- Orthogonal decompositions like Gram–Schmidt and QR factorization rely on projections to build orthogonal bases.
- Optimization methods often involve projecting guesses back onto feasible sets.
- Machine learning uses projections constantly to reduce dimensions, compare vectors, and align features.

Without projection, we could not cleanly separate influence along directions or reduce complexity in structured ways.

#### Try It Yourself

1. Project (2, 3) onto (1, 0). What does the perpendicular component look like?
2. Project (3, 1) onto (2, 2). Verify the perpendicular part is orthogonal.
3. Decompose (5, 5, 0) into parallel and perpendicular parts relative to (1, 0, 0).
4. Challenge: Write the projection matrix for projecting onto (1, 2). Apply it to (3, 4). Does it match the formula?

Through these exercises, you will see that projection is more than an operation-it is a lens through which we decompose, interpret, and simplify vectors and spaces.

