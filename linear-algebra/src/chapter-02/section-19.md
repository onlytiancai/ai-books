### 19. Affine Transforms and Homogeneous Coordinates

Up to now, matrices have been used to describe linear transformations: scaling, rotating, reflecting, projecting. But real-world geometry often involves more than just linear effects-it includes translations (shifts) as well. A pure linear map cannot move the origin, so to handle translations (and combinations of them with rotations, scalings, and shears), we extend our toolkit to affine transformations. The secret weapon that makes this work is the idea of homogeneous coordinates.

#### What is an Affine Transformation?

An affine transformation is any map of the form:

$$
f(\mathbf{x}) = A\mathbf{x} + \mathbf{b},
$$

where $A$ is a matrix (linear part) and $\mathbf{b}$ is a vector (translation part).

- $A$ handles scaling, rotation, reflection, shear, or projection.
- $\mathbf{b}$ shifts everything by a constant amount.

Examples in 2D:

1. Rotate by 90° and then shift right by 2.
2. Stretch vertically by 3 and shift upward by 1.

Affine maps preserve parallel lines and ratios of distances along lines, but not necessarily angles or lengths.

#### Why Linear Maps Alone Aren't Enough

If we only use a 2×2 matrix in 2D or 3×3 in 3D, the origin always stays fixed. That's a limitation: real-world movements (like moving a shape from one place to another) require shifting the origin too. To capture both linear and translational effects uniformly, we need a clever trick.

#### Homogeneous Coordinates

The trick is to add one extra coordinate.

- In 2D, a point $(x, y)$ becomes $(x, y, 1)$.
- In 3D, a point $(x, y, z)$ becomes $(x, y, z, 1)$.

This new representation is called homogeneous coordinates. It allows us to fold translations into matrix multiplication.

#### Affine Transform as a Matrix in Homogeneous Form

In 2D:

$$
\begin{bmatrix} 
a & b & t_x \\ 
c & d & t_y \\ 
0 & 0 & 1 
\end{bmatrix}
\begin{bmatrix} 
x \\ y \\ 1
\end{bmatrix}
=
\begin{bmatrix} 
ax + by + t_x \\ 
cx + dy + t_y \\ 
1
\end{bmatrix}.
$$

Here,

- The 2×2 block $\begin{bmatrix} a & b \\ c & d \end{bmatrix}$ is the linear part.
- The last column $\begin{bmatrix} t_x \\ t_y \end{bmatrix}$ is the translation.

So with one unified matrix, we can handle both linear transformations and shifts.

#### Examples in 2D

1. Translation by (2, 3):

$$
\begin{bmatrix} 
1 & 0 & 2 \\ 
0 & 1 & 3 \\ 
0 & 0 & 1 
\end{bmatrix}.
$$

2. Scaling by 2 in x and 3 in y, then shifting by (–1, 4):

$$
\begin{bmatrix} 
2 & 0 & -1 \\ 
0 & 3 & 4 \\ 
0 & 0 & 1 
\end{bmatrix}.
$$

3. Rotation by 90° and shift right by 5:

$$
\begin{bmatrix} 
0 & -1 & 5 \\ 
1 & 0 & 0 \\ 
0 & 0 & 1 
\end{bmatrix}.
$$

#### Homogeneous Coordinates in 3D

In 3D, affine transformations use 4×4 matrices. The upper-left 3×3 block handles rotation, scaling, or shear; the last column encodes translation.

Example: translation by (2, –1, 4):

$$
\begin{bmatrix} 
1 & 0 & 0 & 2 \\ 
0 & 1 & 0 & -1 \\ 
0 & 0 & 1 & 4 \\ 
0 & 0 & 0 & 1 
\end{bmatrix}.
$$

This formulation is universal in computer graphics and robotics.

#### Everyday Analogies

- Photography: Moving a camera involves not only rotating it (linear part) but also translating it in space.
- Navigation: Walking north (linear step) and then shifting east (translation).
- Graphics software: Scaling an image larger and then dragging it to a new position-exactly affine transformations in action.

#### Why It Matters

1. Unified representation: Using homogeneous coordinates, we can treat translations as matrices, enabling consistent matrix multiplication for all transformations.
2. Practicality: This approach underpins 3D graphics pipelines, animation, CAD, robotics, and computer vision.
3. Composability: Multiple affine transformations can be combined into a single homogeneous matrix by multiplying them.
4. Geometry preserved: Affine maps preserve straight lines and parallelism, essential in engineering and design.

#### Try It Yourself

1. Write the homogeneous matrix that reflects across the x-axis and then shifts up by 3. Apply it to $(2, 1)$.
2. Construct a 4×4 homogeneous matrix that rotates around the z-axis by 90° and translates by (1, 2, 0).
3. Show that multiplying two 3×3 homogeneous matrices in 2D yields another valid affine transform.
4. Challenge: Prove that affine maps preserve parallel lines by applying a general affine matrix to two parallel lines and checking their slopes.

Mastering affine transformations and homogeneous coordinates bridges the gap between pure linear algebra and real-world geometry, giving you the mathematical foundation behind computer graphics, robotics, and spatial modeling.

