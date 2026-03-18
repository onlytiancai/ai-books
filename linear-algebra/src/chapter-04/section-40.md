### 40. Affine Subspaces

So far, vector spaces and subspaces have always passed through the origin. But in many real-world situations, we deal with shifted versions of these spaces: planes not passing through the origin, lines offset from the zero vector, or solution sets to linear equations with nonzero constants. These structures are called affine subspaces. They extend the idea of subspaces by allowing "translation away from the origin."

#### Definition

An affine subspace of a vector space $V$ is a set of the form

$$
x_0 + W = \{x_0 + w : w \in W\},
$$

where:

- $x_0 \in V$ is a fixed vector (the "base point" or "anchor"),
- $W \subseteq V$ is a linear subspace.

Thus, an affine subspace is simply a subspace shifted by a vector.

#### Examples in $\mathbb{R}^2$

1. A line through the origin: $\text{span}\{(1,2)\}$. This is a subspace.
2. A line not through the origin: $(3,1) + \text{span}\{(1,2)\}$. This is an affine subspace.
3. The entire plane: $\mathbb{R}^2$, which is both a subspace and an affine subspace.

#### Examples in $\mathbb{R}^3$

1. Plane through the origin: $\text{span}\{(1,0,0),(0,1,0)\}$.
2. Plane not through the origin: $(2,3,4) + \text{span}\{(1,0,0),(0,1,0)\}$.
3. Line parallel to the z-axis but passing through $(1,1,5)$: $(1,1,5) + \text{span}\{(0,0,1)\}$.

#### Relation to Linear Systems

Affine subspaces naturally arise as solution sets of linear equations.

1. Homogeneous system: $Ax = 0$.

   - Solution set is a subspace (the null space).

2. Non-homogeneous system: $Ax = b$ with $b \neq 0$.

   - Solution set is affine.
   - If $x_p$ is one particular solution, then the general solution is:

     $$
     x = x_p + N(A),
     $$

     where $N(A)$ is the null space.

Thus, the geometry of solving equations leads naturally to affine subspaces.

#### Affine Dimension

The dimension of an affine subspace is defined as the dimension of its direction subspace $W$.

- A point: affine subspace of dimension 0.
- A line: dimension 1.
- A plane: dimension 2.
- Higher analogs continue in $\mathbb{R}^n$.

#### Difference Between Subspaces and Affine Subspaces

- Subspaces always contain the origin.
- Affine subspaces may or may not pass through the origin.
- Every subspace is an affine subspace (with base point $x_0 = 0$).

#### Geometric Intuition

Think of affine subspaces as "flat sheets" floating in space:

- A line through the origin is a rope tied at the center.
- A line parallel to it but offset is the same rope moved to the side.
- Affine subspaces preserve shape and direction, but not position.

#### Everyday Analogies

- Railway tracks: A railway line is straight (like a subspace), but it doesn't need to pass through the city center (origin).
- Office floors: Each floor in a building is a plane parallel to the ground, offset vertically. The ground floor is like the subspace through the origin; higher floors are affine subspaces.
- Schedules: A repeating pattern (like working hours 9–5) is the subspace. Starting the shift at 10 instead of 9 shifts it into an affine version.

#### Applications

1. Linear equations: General solutions are affine subspaces.
2. Optimization: Feasible regions in linear programming are affine subspaces (intersected with inequalities).
3. Computer graphics: Affine transformations map affine subspaces to affine subspaces, preserving straightness and parallelism.
4. Machine learning: Affine decision boundaries (like hyperplanes) separate data into classes.

#### Why It Matters

1. Affine subspaces generalize subspaces, making linear algebra more flexible.
2. They allow us to describe solution sets that don't include the origin.
3. They provide the geometric foundation for affine geometry, computer graphics, and optimization.
4. They serve as the bridge from pure linear algebra to applied modeling.

#### Try It Yourself

1. Show that the set of solutions to

   $$
   x+y+z=1
   $$

   is an affine subspace of $\mathbb{R}^3$. Identify its dimension.

2. Find the general solution to

   $$
   x+2y=3
   $$

   and describe it as an affine subspace.

3. Prove that the intersection of two affine subspaces is either empty or another affine subspace.

4. Challenge: Show that every affine subspace can be written uniquely as $x_0 + W$ with $W$ a subspace.

Affine subspaces are the natural setting for most real-world linear problems: they combine the strict structure of subspaces with the freedom of translation, capturing both direction and position.

#### Closing 
```
Each basis a song,
dimension counts melodies,
the space breathes its form.
```

## Chapter 5. Linear Transformation and Structure 

#### Opening 
```
Maps preserve the line,
reflections ripple outward,
motion kept in frame.
```


