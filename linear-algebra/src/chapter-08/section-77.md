### 77. QR Decomposition

QR decomposition is a factorization of a matrix into an orthogonal part and a triangular part. It grows directly out of orthogonality and the Gram–Schmidt process, and it plays a central role in numerical linear algebra, providing a stable and efficient way to solve systems, compute least squares solutions, and analyze matrices.

#### Definition

For a real $m \times n$ matrix $A$ with linearly independent columns:

$$
A = QR,
$$

where:

- $Q$ is an $m \times n$ matrix with orthonormal columns ($Q^T Q = I$).
- $R$ is an $n \times n$ upper triangular matrix.

This decomposition is unique if we require $R$ to have positive diagonal entries.

#### Connection to Gram–Schmidt

The Gram–Schmidt process applied to the columns of $A$ produces the orthonormal columns of $Q$. The coefficients used during the orthogonalization steps naturally form the entries of $R$.

- Each column of $A$ is expressed as a combination of the orthonormal columns of $Q$.
- The coefficients of this expression populate the triangular matrix $R$.

#### Example

Let

$$
A = \begin{bmatrix} 1 & 1 \\ 1 & 0 \\ 0 & 1 \end{bmatrix}.
$$

1. Apply Gram–Schmidt to the columns:

   - $v_1 = (1,1,0)^T$, normalize:

     $$
     u_1 = \frac{1}{\sqrt{2}}(1,1,0)^T.
     $$
   - Subtract projection from $v_2=(1,0,1)^T$:

     $$
     w_2 = v_2 - \langle v_2,u_1\rangle u_1.
     $$

     Compute $\langle v_2,u_1\rangle = \tfrac{1}{\sqrt{2}}(1+0+0)=\tfrac{1}{\sqrt{2}}$.
     So

     $$
     w_2 = (1,0,1)^T - \tfrac{1}{\sqrt{2}}(1,1,0)^T = \left(\tfrac{1}{2}, -\tfrac{1}{2}, 1\right)^T.
     $$

     Normalize:

     $$
     u_2 = \frac{1}{\sqrt{1.5}} \left(\tfrac{1}{2}, -\tfrac{1}{2}, 1\right)^T.
     $$

2. Construct $Q = [u_1, u_2]$.

3. Compute $R = Q^T A$.

The result is $A = QR$, with $Q$ orthonormal and $R$ triangular.

#### Geometric Meaning

- $Q$ represents an orthogonal change of basis-rotations and reflections that preserve length and angle.
- $R$ encodes scaling and shear in the new orthonormal coordinate system.
- Together, they show how $A$ transforms space: first rotate into a clean basis, then apply triangular distortion.

#### Everyday Analogies

- Changing perspective: QR decomposition is like rotating your view so the structure of a problem becomes simpler, then measuring distortion in this aligned frame.
- Team roles: $Q$ represents independent, orthogonal roles, while $R$ shows how much each role contributes to the final outcome.
- Navigation: $Q$ gives perfectly aligned compass directions, while $R$ records how far you move along each.

#### Applications

1. Least Squares: Instead of solving $A^T A x = A^T b$, we use $QR$:

   $$
   Ax = b \quad \Rightarrow \quad QRx = b.
   $$

   Multiply by $Q^T$:

   $$
   Rx = Q^T b.
   $$

   Since $R$ is triangular, solving for $x$ is efficient and numerically stable.

2. Eigenvalue Algorithms: The QR algorithm iteratively applies QR factorizations to approximate eigenvalues.

3. Numerical Stability: Orthogonal transformations minimize numerical errors compared to solving normal equations.

4. Machine Learning: Many algorithms (e.g., linear regression, PCA) use QR decomposition for efficiency and stability.

5. Computer Graphics: Orthogonal factors preserve shapes; triangular factors simplify transformations.

#### Why It Matters

- QR decomposition bridges theory (Gram–Schmidt orthogonalization) and computation (matrix factorization).
- It avoids pitfalls of normal equations, improving numerical stability.
- It underpins algorithms across statistics, engineering, and computer science.

#### Try It Yourself

1. Compute the QR decomposition of

   $$
   A = \begin{bmatrix}1 & 2 \\ 2 & 3 \\ 4 & 5\end{bmatrix}.
   $$
2. Verify that $Q^T Q = I$ and $R$ is upper triangular.
3. Use QR to solve the least squares problem $Ax \approx b$ with $b=(1,1,1)^T$.
4. Challenge: Show that if $A$ is square and orthogonal, then $R=I$ and $Q=A$.

QR decomposition turns the messy process of solving least squares into a clean, geometric procedure-rotating into a better coordinate system before solving. It is one of the most powerful tools in the linear algebra toolkit.

