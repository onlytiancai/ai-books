### 48. Rotations and Shear

Linear transformations can twist, turn, and distort space in strikingly different ways. Two of the most fundamental examples are rotations-which preserve lengths and angles while turning vectors-and shears-which slide one part of space relative to another, distorting shape while often preserving area. These two transformations form the geometric heart of linear algebra, and they are indispensable in graphics, physics, and engineering.

#### Rotations in the Plane

A rotation in $\mathbb{R}^2$ by an angle $\theta$ is defined as:

$$
R_\theta = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}.
$$

For any vector $(x,y)$:

$$
R_\theta \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} x\cos\theta - y\sin\theta \\ x\sin\theta + y\cos\theta \end{bmatrix}.
$$

Properties:

1. Preserves lengths: $\|R_\theta v\| = \|v\|$.
2. Preserves angles: the dot product is unchanged.
3. Determinant = $+1$, so it preserves orientation and area.
4. Inverse: $R_\theta^{-1} = R_{-\theta}$.

Example: A 90° rotation:

$$
R_{90^\circ} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}, \quad (1,0) \mapsto (0,1).
$$

#### Rotations in Three Dimensions

Rotations in $\mathbb{R}^3$ occur around an axis. For example, rotation by angle $\theta$ around the z-axis:

$$
R_z(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta & 0 \\ \sin\theta & \cos\theta & 0 \\ 0 & 0 & 1 \end{bmatrix}.
$$

- Leaves the z-axis fixed.
- Rotates the xy-plane like a 2D rotation.

General rotations in 3D are described by orthogonal matrices with determinant +1, forming the group $SO(3)$.

#### Shear Transformations

A shear slides one coordinate direction while keeping another fixed, distorting shapes.

In $\mathbb{R}^2$:

$$
S = \begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix} \quad \text{or} \quad \begin{bmatrix} 1 & 0 \\ k & 1 \end{bmatrix}.
$$

- The first form "slides" x-coordinates depending on y.
- The second form slides y-coordinates depending on x.

Example:

$$
S = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}, \quad (x,y) \mapsto (x+y, y).
$$

- Squares become parallelograms.
- Areas are preserved if $\det(S) = 1$.

In $\mathbb{R}^3$: shears distort volumes while preserving parallelism of faces.

#### Geometric Comparison

- Rotation: Preserves size and shape exactly, only changes orientation. Circles remain circles.
- Shear: Distorts shape but often preserves area (in 2D) or volume (in 3D). Circles become ellipses or slanted figures.

Together, rotations and shears can generate a vast variety of linear distortions.

#### Everyday Analogies

- Rotation: The motion of a spinning wheel, turning a camera, or rotating an image on your phone.
- Shear: Sliding cards in a deck so the top shifts relative to the bottom, or slanting a stack of books without changing their height.
- Combination: Buildings in perspective drawings are sheared versions of rectangles, while wheels rotate cleanly.

#### Applications

1. Computer Graphics: Rotations orient objects; shears simulate perspective.
2. Engineering: Shear stresses deform materials; rotations model rigid-body motion.
3. Robotics: Rotations define arm orientation; shears approximate local deformations.
4. Physics: Rotations are symmetries of space; shears appear in fluid flows and elasticity.
5. Data Science: Shears represent changes of variables that preserve volume but distort distributions.

#### Why It Matters

1. Rotations model pure symmetry-no distortion, just reorientation.
2. Shears show how geometry can be distorted while preserving volume or area.
3. Both are building blocks: any invertible matrix in $\mathbb{R}^2$ can be factored into rotations, shears, and scalings.
4. They bridge algebra and geometry, giving visual meaning to abstract matrices.

#### Try It Yourself

1. Rotate $(1,0)$ by 60° and compute the result explicitly.
2. Apply the shear $S=\begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$ to the square with vertices $(0,0),(1,0),(0,1),(1,1)$. What shape results?
3. Show that rotation matrices are orthogonal ($R^TR=I$).
4. Challenge: Prove that any area-preserving $2\times2$ matrix with determinant 1 can be decomposed into a product of rotations and shears.

Rotations and shears highlight two complementary sides of linear algebra: symmetry versus distortion. Together, they show how transformations can either preserve the essence of space or bend it into new shapes while keeping its structure intact.

