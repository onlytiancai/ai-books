### 82. Geometry of SVD

The Singular Value Decomposition (SVD) is not just an algebraic factorization-it has a precise geometric meaning. It explains exactly how any linear transformation reshapes space: stretching, rotating, compressing, and possibly collapsing dimensions. Understanding this geometry turns SVD from a formal tool into an intuitive picture of what matrices do.

#### Transformation of the Unit Sphere

Take the unit sphere (or circle, in 2D) in the input space. When we apply a matrix $A$:

- The sphere is transformed into an ellipsoid.
- The axes of this ellipsoid correspond to the right singular vectors $v_i$.
- The lengths of the axes are the singular values $\sigma_i$.
- The directions of the axes in the output space are the left singular vectors $u_i$.

Thus, SVD tells us:

$$
A v_i = \sigma_i u_i.
$$

Every matrix maps orthogonal basis directions into orthogonal ellipsoid axes, scaled by singular values.

#### Step-by-Step Geometry

The decomposition $A = U \Sigma V^T$ can be read geometrically:

1. Rotate/reflect by $V^T$: Align input coordinates with the "principal directions" of $A$.
2. Scale by $\Sigma$: Stretch or compress each axis by its singular value. Some singular values may be zero, flattening dimensions.
3. Rotate/reflect by $U$: Reorient the scaled axes into the output space.

This process is universal: no matter how irregular a matrix seems, it always reshapes space by rotation → scaling → rotation.

#### 2D Example

Take

$$
A = \begin{bmatrix}3 & 1 \\ 0 & 2\end{bmatrix}.
$$

- A circle in $\mathbb{R}^2$ is mapped into an ellipse.
- The ellipse's major and minor axes align with the right singular vectors of $A$.
- Their lengths equal the singular values.
- The ellipse itself is then oriented in the output plane according to the left singular vectors.

This makes SVD the perfect tool for visualizing how $A$ "distorts" geometry.

#### Stretching and Rank

- If all singular values are positive, the ellipsoid has full dimension (no collapse).
- If some singular values are zero, $A$ flattens the sphere along certain directions, lowering the rank.
- The rank of $A$ equals the number of nonzero singular values.

Thus, rank-deficient matrices literally squash space into lower dimensions.

#### Distance and Energy Preservation

- The largest singular value $\sigma_1$ is how much $A$ can stretch a vector.
- The smallest nonzero singular value $\sigma_r$ (where $r = \text{rank}(A)$) measures how much the matrix compresses.
- The condition number $\kappa(A) = \sigma_1 / \sigma_r$ measures distortion: small values mean nearly spherical stretching, large values mean extreme elongation.

#### Everyday Analogies

- Elastic band: Stretching a circular band into an ellipse, with major and minor axes as singular values.
- Maps: A globe projected onto flat paper distorts distances differently along latitude and longitude-like singular values stretching some directions more than others.
- Clothing: Pulling fabric in one direction stretches it more along that axis while leaving other directions less affected.

#### Applications of the Geometry

1. Data Compression: Keeping only the largest singular values keeps the "major axes" of variation.
2. PCA: Data is analyzed along orthogonal axes of greatest variance (singular vectors).
3. Numerical Analysis: Geometry of SVD shows why ill-conditioned systems amplify errors-because some directions are squashed almost flat.
4. Signal Processing: Elliptical distortions correspond to filtering out certain frequency components.
5. Machine Learning: Dimensionality reduction is essentially projecting data onto the largest singular directions.

#### Why It Matters

- SVD transforms algebraic equations into geometric pictures.
- It reveals exactly how matrices warp space, offering intuition behind abstract operations.
- By interpreting ellipses, singular values, and orthogonal vectors, we gain visual clarity for problems in data, physics, and computation.

#### Try It Yourself

1. Draw the unit circle in $\mathbb{R}^2$, apply the matrix

   $$
   A = \begin{bmatrix}2 & 0 \\ 1 & 3\end{bmatrix},
   $$

   and sketch the resulting ellipse. Identify its axes and lengths.
2. Verify numerically that $Av_i = \sigma_i u_i$ for computed singular vectors and singular values.
3. For a rank-1 matrix, sketch how the unit circle collapses to a line segment.
4. Challenge: Prove that the set of vectors with maximum stretch under $A$ are precisely the first right singular vectors.

The geometry of SVD gives us a universal lens: every linear transformation is a controlled distortion of space, built from orthogonal rotations and directional scalings.

