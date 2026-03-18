### 78. Orthogonal Matrices

Orthogonal matrices are square matrices whose rows and columns form an orthonormal set. They are the algebraic counterpart of rigid motions in geometry: transformations that preserve lengths, angles, and orientation (except for reflections).

#### Definition

A square matrix $Q \in \mathbb{R}^{n \times n}$ is orthogonal if

$$
Q^T Q = QQ^T = I.
$$

This means:

- The columns of $Q$ are orthonormal.
- The rows of $Q$ are also orthonormal.

#### Properties

1. Inverse Equals Transpose:

   $$
   Q^{-1} = Q^T.
   $$

   This makes orthogonal matrices especially easy to invert.

2. Preservation of Norms: For any vector $x$,

   $$
   \|Qx\| = \|x\|.
   $$

   Orthogonal transformations never stretch or shrink vectors.

3. Preservation of Inner Products:

   $$
   \langle Qx, Qy \rangle = \langle x, y \rangle.
   $$

   Angles are preserved.

4. Determinant:
   $\det(Q) = \pm 1$.

   - If $\det(Q) = 1$, $Q$ is a rotation.
   - If $\det(Q) = -1$, $Q$ is a reflection combined with rotation.

#### Examples

1. 2D Rotation Matrix:

   $$
   Q = \begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix}.
   $$

   Rotates vectors by angle $\theta$.

2. 2D Reflection Matrix:
   Reflection across the $x$-axis:

   $$
   Q = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}.
   $$

3. Permutation Matrices:
   Swapping coordinates is orthogonal because it preserves lengths. Example in 3D:

   $$
   Q = \begin{bmatrix}0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1\end{bmatrix}.
   $$

#### Geometric Meaning

Orthogonal matrices represent isometries: transformations that preserve the shape of objects.

- They can rotate, reflect, or permute axes.
- They never distort lengths or angles.

This is why in computer graphics, orthogonal matrices model pure rotations and reflections without scaling.

#### Everyday Analogies

- Photography: Rotating a camera keeps the picture content intact-it only changes orientation.
- Maps: A compass rotation preserves distances between cities.
- Dance moves: Rotating or flipping a formation keeps relative spacing unchanged.

#### Applications

1. Computer Graphics: Rotations of 3D models use orthogonal matrices to avoid distortion.
2. Numerical Linear Algebra: Orthogonal transformations are numerically stable, widely used in QR factorization and eigenvalue algorithms.
3. Data Compression: Orthogonal transforms like the Fourier and cosine transforms preserve energy.
4. Signal Processing: Orthogonal filters separate signals into independent components.
5. Physics: Orthogonal matrices describe rotations in rigid body dynamics.

#### Why It Matters

- Orthogonal matrices are the building blocks of stable algorithms.
- They describe symmetry, structure, and invariance in physical and computational systems.
- They serve as the simplest and most powerful class of transformations that preserve geometry exactly.

#### Try It Yourself

1. Verify that

   $$
   Q = \begin{bmatrix}0 & -1 \\ 1 & 0\end{bmatrix}
   $$

   is orthogonal. What geometric transformation does it represent?

2. Prove that the determinant of an orthogonal matrix must be $\pm 1$.

3. Show that multiplying two orthogonal matrices gives another orthogonal matrix.

4. Challenge: Prove that eigenvalues of orthogonal matrices lie on the complex unit circle (i.e., $|\lambda|=1$).

Orthogonal matrices capture the essence of symmetry: transformations that preserve structure exactly. They lie at the heart of geometry, physics, and computation.

