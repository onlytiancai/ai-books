### 91. 2D/3D Geometry Pipelines (Cameras, Rotations, and Transforms)

Linear algebra is the silent backbone of modern graphics, robotics, and computer vision. Every time an image is rendered on a screen, a camera captures a scene, or a robot arm moves in space, a series of matrix multiplications are transforming points from one coordinate system to another. These geometry pipelines map 3D reality into 2D representations, ensuring that objects appear in the correct position, orientation, and scale.

#### The Geometry of Coordinates

A point in 3D space is represented as a column vector:

$$
p = \begin{bmatrix} x \\ y \\ z \end{bmatrix}.
$$

But computers often extend this to homogeneous coordinates, embedding the point in 4D:

$$
p_h = \begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}.
$$

The extra coordinate allows translations to be represented as matrix multiplications, keeping the entire pipeline consistent: every step is just multiplying by a matrix.

#### Transformations in 2D and 3D

- Translation
  Moves a point by $(t_x, t_y, t_z)$.

  $$
  T = \begin{bmatrix} 
  1 & 0 & 0 & t_x \\ 
  0 & 1 & 0 & t_y \\ 
  0 & 0 & 1 & t_z \\ 
  0 & 0 & 0 & 1 
  \end{bmatrix}.
  $$

- Scaling
  Expands or shrinks space along each axis.

  $$
  S = \begin{bmatrix} 
  s_x & 0 & 0 & 0 \\ 
  0 & s_y & 0 & 0 \\ 
  0 & 0 & s_z & 0 \\ 
  0 & 0 & 0 & 1 
  \end{bmatrix}.
  $$

- Rotation
  In 3D, rotation around the z-axis is:

  $$
  R_z(\theta) = \begin{bmatrix} 
  \cos\theta & -\sin\theta & 0 & 0 \\ 
  \sin\theta & \cos\theta & 0 & 0 \\ 
  0 & 0 & 1 & 0 \\ 
  0 & 0 & 0 & 1 
  \end{bmatrix}.
  $$

  Similar forms exist for rotations around the x- and y-axes.

Each transformation is linear (or affine), and chaining them is just multiplying matrices.

#### The Camera Pipeline

Rendering a 3D object to a 2D image follows a sequence of steps, each one a matrix multiplication:

1. Model Transform
   Moves the object from its local coordinates into world coordinates.

2. View Transform
   Puts the camera at the origin and aligns its axes with the world, effectively changing the point of view.

3. Projection Transform
   Projects 3D points into 2D. Two types:

   - Orthographic: parallel projection, no perspective.
   - Perspective: distant objects appear smaller, closer to human vision.

   Example of perspective projection:

   $$
   P = \begin{bmatrix} 
   f & 0 & 0 & 0 \\ 
   0 & f & 0 & 0 \\ 
   0 & 0 & 1 & 0 
   \end{bmatrix},
   $$

   where $f$ is focal length.

4. Viewport Transform
   Maps normalized 2D coordinates to screen pixels.

This sequence-from object to image-is the geometry pipeline.

#### Example: Rendering a Cube

- Start with cube vertices in local coordinates ($[-1,1]^3$).
- Apply a scaling matrix to stretch it.
- Apply a rotation matrix to tilt it.
- Apply a translation matrix to move it into the scene.
- Apply a projection matrix to flatten it onto the screen.

Every step is linear algebra, and the final picture is the result of multiplying many matrices in sequence.

#### Robotics Connection

Robotic arms use similar pipelines: each joint contributes a rotation or translation, encoded as a matrix. By multiplying them, we get the forward kinematics-the position and orientation of the hand given the joint angles.

#### Everyday Analogies

- Photography: The model transform arranges the objects, the view transform positions the camera, and the projection is the lens that flattens the scene.
- Stage performance: Actors move on stage (translations), rotate to face the audience (rotations), and lighting projects their shadows onto a backdrop (projection).
- Navigation: GPS coordinates are transformed into map coordinates, then into screen pixels-another geometry pipeline.

#### Why It Matters

Geometry pipelines unify graphics, robotics, and vision. They show how linear algebra powers the everyday visuals of video games, animations, simulations, and even self-driving cars. Without the consistency of matrix multiplication, the complexity of managing transformations would be unmanageable.

#### Try It Yourself

1. Write down the sequence of matrices that rotate a square by 45°, scale it by 2, and translate it by $(3, 1)$. Multiply them to get the combined transformation.
2. Construct a cube in 3D and simulate a perspective projection by hand for one vertex.
3. For a simple 2-joint robotic arm, represent each joint with a rotation matrix and compute the final hand position.
4. Prove that composing affine transformations is closed under multiplication-why does this make pipelines possible?

Geometry pipelines are the bridge between abstract linear algebra and tangible visual and mechanical systems. They are how math becomes movement, light, and image.

