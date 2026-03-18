### 44. Invertibility and Isomorphisms

Linear transformations come in many forms: some collapse space into lower dimensions, others stretch it, and a special group preserves all information perfectly. These special transformations are invertible, meaning they can be reversed exactly. When two vector spaces are related by such a transformation, we say they are isomorphic-structurally identical, even if they look different on the surface.

#### Invertibility of Linear Transformations

A linear transformation $T: V \to W$ is invertible if there exists another linear transformation $S: W \to V$ such that:

$$
S \circ T = I_V \quad \text{and} \quad T \circ S = I_W,
$$

where $I_V$ and $I_W$ are identity maps on $V$ and $W$.

- $S$ is called the inverse of $T$.
- If such an inverse exists, $T$ is a bijection: both one-to-one (injective) and onto (surjective).
- In finite-dimensional spaces, this is equivalent to saying that $T$ is represented by an invertible matrix.

#### Invertible Matrices

An $n \times n$ matrix $A$ is invertible if there exists another $n \times n$ matrix $A^{-1}$ such that:

$$
AA^{-1} = A^{-1}A = I.
$$

Characterizations of Invertibility:

1. $A$ is invertible ⇔ $\det(A) \neq 0$.
2. ⇔ Columns of $A$ are linearly independent.
3. ⇔ Columns of $A$ span $\mathbb{R}^n$.
4. ⇔ Rank of $A$ is $n$.
5. ⇔ The system $Ax=b$ has exactly one solution for every $b$.

All these properties tie together: invertibility means no information is lost when transforming vectors.

#### Isomorphisms of Vector Spaces

Two vector spaces $V$ and $W$ are isomorphic if there exists a bijective linear transformation $T: V \to W$.

- This means $V$ and $W$ are "the same" in structure, though they may look different.
- For finite-dimensional spaces:

  $$
  V \cong W \quad \text{if and only if} \quad \dim(V) = \dim(W).
  $$
- Example: $\mathbb{R}^2$ and the set of all polynomials of degree ≤ 1 are isomorphic, because both have dimension 2.

#### Examples of Invertibility

1. Rotation in the plane:
   Every rotation matrix has an inverse (rotation by the opposite angle).

   $$
   R(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}, \quad R(\theta)^{-1} = R(-\theta).
   $$

2. Scaling by nonzero factor:
   $T(x) = ax$ with $a \neq 0$. Inverse is $T^{-1}(x) = \tfrac{1}{a}x$.

3. Projection onto a line:
   Not invertible, because depth is lost. The kernel is nontrivial.

4. Differentiation on polynomials of degree ≤ n:
   Not invertible, since constant terms vanish in the kernel.

5. Differentiation on exponential functions:
   Invertible: the inverse is integration (up to constants).

#### Geometric Interpretation

- Invertible transformations preserve dimension: no flattening or collapsing occurs.
- They may rotate, shear, stretch, or reflect, but every input vector can be uniquely recovered.
- The determinant tells the "volume scaling" of the transformation: invertibility requires this volume not to collapse to zero.

#### Everyday Analogies

- Secret codes: An invertible transformation is like an encryption that can be decrypted; non-invertible codes lose information permanently.
- Recipes: Doubling a recipe is invertible (just halve it back); baking a cake is not invertible (you can't get raw ingredients back).
- Translations: Moving every point on a map 5 units east is invertible (move 5 units west to undo). Flattening a 3D globe into a 2D map loses depth and is not invertible.

#### Applications

1. Computer graphics: Invertible matrices allow smooth transformations where no information is lost. Non-invertible maps (like projections) create 2D renderings from 3D worlds.
2. Cryptography: Encryption systems rely on invertible linear maps for encoding/decoding.
3. Robotics: Transformations between joint and workspace coordinates must often be invertible for precise control.
4. Data science: PCA often reduces dimension (non-invertible), but whitening transformations are invertible within the chosen subspace.
5. Physics: Coordinate changes (e.g., Galilean or Lorentz transformations) are invertible, ensuring that physical laws remain consistent.

#### Why It Matters

1. Invertible maps preserve the entire structure of a vector space.
2. They classify vector spaces: if two have the same dimension, they are fundamentally the same via isomorphism.
3. They allow reversible modeling, essential in physics, cryptography, and computation.
4. They highlight the delicate balance between lossless transformations (invertible) and lossy ones (non-invertible).

#### Try It Yourself

1. Prove that the matrix $\begin{bmatrix} 2 & 1 \\ 3 & 2 \end{bmatrix}$ is invertible by computing its determinant and its inverse.
2. Show that projection onto the x-axis in $\mathbb{R}^2$ is not invertible. Identify its kernel.
3. Construct an explicit isomorphism between $\mathbb{R}^3$ and the space of polynomials of degree ≤ 2.
4. Challenge: Prove that if $T$ is an isomorphism, then it maps bases to bases.

Invertibility and isomorphism are the gateways from "linear rules" to the grand idea of equivalence. They allow us to say, with mathematical precision, when two spaces are truly the same in structure-different clothes, same skeleton.

