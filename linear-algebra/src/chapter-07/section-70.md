### 70. Linear Differential Systems

Many natural and engineered processes evolve continuously over time. When these processes can be expressed as linear relationships, they lead to systems of linear differential equations. The analysis of such systems relies almost entirely on eigenvalues and eigenvectors, which determine the behavior of solutions: whether they oscillate, decay, grow, or stabilize.

#### The General Setup

Consider a system of first-order linear differential equations:

$$
\frac{d}{dt}x(t) = A x(t),
$$

where:

- $x(t) \in \mathbb{R}^n$ is the state vector at time $t$.
- $A \in \mathbb{R}^{n \times n}$ is a constant coefficient matrix.

The task is to solve for $x(t)$, given an initial state $x(0)$.

#### The Matrix Exponential

The formal solution is:

$$
x(t) = e^{At} x(0),
$$

where $e^{At}$ is the matrix exponential defined as:

$$
e^{At} = I + At + \frac{(At)^2}{2!} + \frac{(At)^3}{3!} + \cdots.
$$

But how do we compute $e^{At}$ in practice? The answer comes from diagonalization and Jordan form.

#### Case 1: Diagonalizable Matrices

If $A$ is diagonalizable:

$$
A = P D P^{-1}, \quad D = \text{diag}(\lambda_1, \ldots, \lambda_n).
$$

Then:

$$
e^{At} = P e^{Dt} P^{-1}, \quad e^{Dt} = \text{diag}(e^{\lambda_1 t}, \ldots, e^{\lambda_n t}).
$$

Thus the solution is:

$$
x(t) = P \begin{bmatrix} e^{\lambda_1 t} & & \\ & \ddots & \\ & & e^{\lambda_n t} \end{bmatrix} P^{-1} x(0).
$$

Each eigenvalue $\lambda_i$ dictates the time behavior along its eigenvector direction.

#### Case 2: Non-Diagonalizable Matrices

If $A$ is defective, use its Jordan form $J = P^{-1}AP$:

$$
e^{At} = P e^{Jt} P^{-1}.
$$

For a Jordan block of size 2:

$$
J = \begin{bmatrix} \lambda & 1 \\ 0 & \lambda \end{bmatrix}, \quad
e^{Jt} = e^{\lambda t} \begin{bmatrix} 1 & t \\ 0 & 1 \end{bmatrix}.
$$

Polynomial terms in $t$ appear, multiplying the exponential part. This explains why repeated eigenvalues with insufficient eigenvectors yield solutions with extra polynomial factors.

#### Real vs. Complex Eigenvalues

- Real eigenvalues: solutions grow or decay exponentially along eigenvector directions.

  - If $\lambda < 0$: exponential decay → stability.
  - If $\lambda > 0$: exponential growth → instability.

- Complex eigenvalues: $\lambda = a \pm bi$. Solutions involve oscillations:

  $$
  e^{(a+bi)t} = e^{at}(\cos(bt) + i \sin(bt)).
  $$

  - If $a < 0$: decaying oscillations.
  - If $a > 0$: growing oscillations.
  - If $a = 0$: pure oscillations, neutrally stable.

#### Example 1: Real Eigenvalues

$$
A = \begin{bmatrix} -2 & 0 \\ 0 & -3 \end{bmatrix}.
$$

Eigenvalues: $-2, -3$.
Solution:

$$
x(t) = \begin{bmatrix} c_1 e^{-2t} \\ c_2 e^{-3t} \end{bmatrix}.
$$

Both terms decay → stable equilibrium at the origin.

#### Example 2: Complex Eigenvalues

$$
A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}.
$$

Eigenvalues: $\pm i$.
Solution:

$$
x(t) = c_1 \begin{bmatrix} \cos t \\ \sin t \end{bmatrix} + c_2 \begin{bmatrix} -\sin t \\ \cos t \end{bmatrix}.
$$

Pure oscillation → circular motion around the origin.

#### Example 3: Mixed Stability

$$
A = \begin{bmatrix} 1 & 0 \\ 0 & -2 \end{bmatrix}.
$$

Eigenvalues: $1, -2$.
Solution:

$$
x(t) = \begin{bmatrix} c_1 e^t \\ c_2 e^{-2t} \end{bmatrix}.
$$

One direction grows, one decays → unstable overall, since divergence in one direction dominates.

#### Geometric Meaning

- The eigenvectors form the "axes of flow" of the system.
- The eigenvalues determine whether the flow along those axes spirals, grows, or shrinks.
- The phase portrait of the system-trajectories in the plane-is shaped by this interplay.

For example:

- Negative eigenvalues → trajectories funnel into the origin.
- Positive eigenvalues → trajectories repel outward.
- Complex eigenvalues → spirals or circles.

#### Everyday Analogies

- Population dynamics: Growth rates correspond to eigenvalues. Negative rates → extinction; positive rates → explosion.
- Engineering vibrations: Eigenvalues determine resonance frequencies and damping.
- Finance: Interest rates with oscillatory components (complex eigenvalues) describe cyclical economies.
- Climate models: Stability of equilibria (e.g., greenhouse gas balance) comes from sign of eigenvalues.

#### Applications

1. Control theory: Stability analysis of systems requires eigenvalue placement in the left-half plane.
2. Physics: Vibrations, quantum oscillations, and decay processes all follow eigenvalue rules.
3. Biology: Population models evolve according to linear differential equations.
4. Economics: Linear models of markets converge or diverge depending on eigenvalues.
5. Neuroscience: Neural firing dynamics can be modeled as linear ODE systems.

#### Why It Matters

- Linear differential systems bridge linear algebra with real-world dynamics.
- Eigenvalues determine not just numbers, but behaviors over time: growth, decay, oscillation, or equilibrium.
- They provide the foundation for analyzing nonlinear systems, which are often studied by linearizing around equilibrium points.

#### Try It Yourself

1. Solve $\frac{dx}{dt} = \begin{bmatrix} -1 & 2 \\ -2 & -1 \end{bmatrix}x$. Interpret the solution.
2. For $A = \begin{bmatrix} 0 & -2 \\ 2 & 0 \end{bmatrix}$, compute eigenvalues and describe the motion.
3. Verify that $e^{At} = P e^{Dt} P^{-1}$ works when $A$ is diagonalizable.
4. Challenge: Show that if all eigenvalues of $A$ have negative real parts, then $\lim_{t \to \infty} x(t) = 0$ for any initial condition.

Linear differential systems show how eigenvalues control the flow of time itself in models. They explain why some processes die out, others oscillate, and others grow without bound-providing the mathematical skeleton behind countless real-world phenomena.

#### Closing 
```
Spectra guide the flow,
growth and decay intertwining,
future sings through roots.
```

## Chapter 8. Orthogonality, least squars, and QR
#### Opening
```
Perpendiculars,
meeting without crossing paths,
balance in silence.
```

