### 66. Real vs. Complex Spectra

Not all eigenvalues are real numbers. Even when working with real matrices, eigenvalues can emerge as complex numbers. Understanding when eigenvalues are real, when they are complex, and what this means geometrically is critical for grasping the full behavior of linear transformations.

#### Eigenvalues Over the Complex Numbers

Every square matrix $A \in \mathbb{R}^{n \times n}$ has at least one eigenvalue in the complex numbers. This is guaranteed by the Fundamental Theorem of Algebra, which says every polynomial (like the characteristic polynomial) has roots in $\mathbb{C}$.

- If $p_A(\lambda)$ has only real roots, all eigenvalues are real.
- If $p_A(\lambda)$ has quadratic factors with no real roots, then eigenvalues appear as complex conjugate pairs.

#### Why Complex Numbers Appear

Consider a 2D rotation matrix:

$$
R_\theta = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}.
$$

The characteristic polynomial is

$$
p(\lambda) = \lambda^2 - 2\cos\theta \lambda + 1.
$$

The eigenvalues are

$$
\lambda = \cos\theta \pm i \sin\theta = e^{\pm i\theta}.
$$

- Unless $\theta = 0, \pi$, these eigenvalues are not real.
- Geometrically, this makes sense: pure rotation has no invariant real direction. Instead, the eigenvalues are complex numbers of unit magnitude, encoding the rotation angle.

#### Real vs. Complex Scenarios

1. Symmetric Real Matrices:

   - All eigenvalues are real.
   - Eigenvectors form an orthogonal basis.
   - Example:
     $\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$ has eigenvalues $3, 1$.

2. General Real Matrices:

   - Eigenvalues may be complex.
   - If complex, they always come in conjugate pairs: if $\lambda = a+bi$, then $\overline{\lambda} = a-bi$ is also an eigenvalue.

3. Skew-Symmetric Matrices:

   - Purely imaginary eigenvalues.
   - Example:
     $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$ has eigenvalues $\pm i$.

#### Geometric Meaning of Complex Eigenvalues

- If eigenvalues are real, the transformation scales along real directions.
- If eigenvalues are complex, the transformation involves a combination of rotation and scaling.

For $\lambda = re^{i\theta}$:

- $r = |\lambda|$ controls expansion or contraction.
- $\theta$ controls rotation.

So a complex eigenvalue represents a spiral: stretching or shrinking while rotating.

#### Example: Spiral Dynamics

Matrix

$$
A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}
$$

rotates vectors by 90°.

- Eigenvalues: $\pm i$.
- Magnitude = 1, angle = $\pi/2$.
- Interpretation: every step is a rotation of 90°, with no scaling.

If we change to

$$
B = \begin{bmatrix} 0.8 & -0.6 \\ 0.6 & 0.8 \end{bmatrix},
$$

the eigenvalues are complex with modulus < 1.

- Interpretation: rotation combined with shrinking → spiraling toward the origin.

#### Everyday Analogies

- Clock hands: Rotation without stretching is like clock hands moving-direction changes continuously but length stays the same.
- Spiral staircase: Each step forward involves both rising and rotating, just like scaling and rotation in complex eigenvalues.
- Musical pitch shifts: A note can rise in pitch (rotation) while fading in volume (scaling).

#### Applications

1. Differential Equations: Complex eigenvalues produce oscillatory solutions with sine and cosine terms.
2. Physics: Vibrations and wave phenomena rely on complex eigenvalues to model periodic behavior.
3. Control Systems: Stability requires checking magnitudes of eigenvalues in the complex plane.
4. Computer Graphics: Rotations and spiral motions are naturally described by complex spectra.
5. Signal Processing: Fourier transforms rely on complex eigenstructures of convolution operators.

#### Why It Matters

- Real eigenvalues describe pure stretching or compression.
- Complex eigenvalues describe combined rotation and scaling.
- Together, they provide a complete picture of matrix behavior in both real and complex spaces.
- Without considering complex eigenvalues, we miss entire classes of transformations, like rotation and oscillation.

#### Try It Yourself

1. Find eigenvalues of
   $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$. Interpret geometrically.
2. For rotation by 45°, find eigenvalues of
   $\begin{bmatrix} \cos\frac{\pi}{4} & -\sin\frac{\pi}{4} \\ \sin\frac{\pi}{4} & \cos\frac{\pi}{4} \end{bmatrix}$.
   Show that they are $e^{\pm i\pi/4}$.
3. Check eigenvalues of
   $\begin{bmatrix} 2 & -5 \\ 1 & -2 \end{bmatrix}$. Are they real or complex?
4. Challenge: Prove that real polynomials of odd degree always have at least one real root. Connect this to eigenvalues of odd-dimensional real matrices.

Complex spectra extend our understanding of linear algebra into the full richness of oscillations, rotations, and spirals, where numbers alone are not enough-geometry and complex analysis merge to reveal the truth.

