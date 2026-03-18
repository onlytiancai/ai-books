### 45. Composition, Powers, and Iteration

Linear transformations are not isolated operations-they can be combined, repeated, and layered to build more complex effects. This leads us to the ideas of composition, powers of transformations, and iteration. These concepts form the backbone of linear dynamics, algorithms, and many real-world systems where repeated actions accumulate into surprising results.

#### Composition of Linear Transformations

If $T: U \to V$ and $S: V \to W$ are linear transformations, then their composition is another transformation

$$
S \circ T : U \to W, \quad (S \circ T)(u) = S(T(u)).
$$

- Composition is associative: $(R \circ S) \circ T = R \circ (S \circ T)$.
- Composition is linear: the result of composing two linear maps is still linear.
- In terms of matrices, if $T(x) = Ax$ and $S(x) = Bx$, then

  $$
  (S \circ T)(x) = B(Ax) = (BA)x.
  $$

  Notice that the order matters: composition corresponds to matrix multiplication.

Example:

1. $T(x,y) = (x+2y, y)$.
2. $S(x,y) = (2x, x-y)$.
   Then $(S \circ T)(x,y) = S(x+2y,y) = (2(x+2y), (x+2y)-y) = (2x+4y, x+y)$.
   Matrix multiplication confirms the same result.

#### Powers of Transformations

If $T: V \to V$, we can apply it repeatedly:

$$
T^2 = T \circ T, \quad T^3 = T \circ T \circ T, \quad \dots
$$

- These are called powers of $T$.
- If $T(x) = Ax$, then $T^k(x) = A^k x$.
- Powers of transformations capture repeated processes, like compounding interest, population growth, or iterative algorithms.

Example:
Let $T(x,y) = (2x, 3y)$. Then

$$
T^n(x,y) = (2^n x, 3^n y).
$$

Each iteration amplifies the scaling along different directions.

#### Iteration and Dynamical Systems

Iteration means applying the same transformation repeatedly to study long-term behavior:

$$
x_{k+1} = T(x_k), \quad x_0 \text{ given}.
$$

- This creates a discrete dynamical system.
- Depending on $T$, vectors may grow, shrink, oscillate, or stabilize.

Example 1 (Markov Chains):
If $T$ is a stochastic matrix, iteration describes probability evolution over time. Eventually, the system may converge to a steady-state distribution.

Example 2 (Population Models):
If $T$ describes how sub-populations interact, iteration simulates generations. Eigenvalues dictate whether populations explode, stabilize, or vanish.

Example 3 (Computer Graphics):
Repeated affine transformations create fractals like the Sierpinski triangle.

#### Stability and Eigenvalues

The behavior of $T^n(x)$ depends heavily on eigenvalues of the transformation.

- If $|\lambda| < 1$, repeated application shrinks vectors in that direction to zero.
- If $|\lambda| > 1$, repeated application causes exponential growth.
- If $|\lambda| = 1$, vectors rotate or oscillate without changing length.

This link between powers and eigenvalues underpins many algorithms in numerical analysis and physics.

#### Geometric Interpretation

- Composition = chaining geometric actions (rotate then reflect, scale then shear).
- Powers = applying the same action repeatedly (rotating 90° four times = identity).
- Iteration = exploring the "orbit" of a vector under repeated transformations.

#### Everyday Analogies

- Assembly line: Each station performs a transformation. The entire process is the composition of all steps.
- Compound interest: Repeated multiplication by a growth factor is iteration.
- Dance choreography: One step repeated many times creates a rhythm-like powers of a transformation.
- Social media algorithms: Iterative recommendations amplify some signals while suppressing others-much like eigenvalues controlling growth or decay.

#### Applications

1. Search engines: PageRank is computed by iterating a linear transformation until it stabilizes.
2. Economics: Input–output models iterate to predict long-term equilibrium of industries.
3. Physics: Time evolution of quantum states is modeled by repeated application of unitary operators.
4. Numerical methods: Iterative solvers (like power iteration) approximate eigenvectors.
5. Computer graphics: Iterated function systems generate self-similar fractals.

#### Why It Matters

1. Composition unifies matrix multiplication and transformation chaining.
2. Powers reveal exponential growth, decay, and oscillation.
3. Iteration is the core of modeling dynamic processes in mathematics, science, and engineering.
4. The link to eigenvalues makes these ideas the foundation of stability analysis.

#### Try It Yourself

1. Let $T(x,y) = (x+y, y)$. Compute $T^2(x,y)$ and $T^3(x,y)$. What happens as $n \to \infty$?
2. Consider rotation by 90° in $\mathbb{R}^2$. Show that $T^4 = I$.
3. For matrix $A = \begin{bmatrix} 0.5 & 0.5 \\ 0.5 & 0.5 \end{bmatrix}$, iterate $A^n$. What happens to arbitrary vectors?
4. Challenge: Prove that if $A$ is diagonalizable as $A = PDP^{-1}$, then $A^n = PD^nP^{-1}$. Use this to analyze long-term behavior.

Composition, powers, and iteration take linear algebra beyond static equations into the world of processes over time. They explain how small, repeated steps shape long-term outcomes-whether stabilizing systems, amplifying signals, or creating infinite complexity.

