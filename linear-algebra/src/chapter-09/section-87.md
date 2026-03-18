### 87. Conditioning and Sensitivity (How Errors Amplify)

Linear algebra is not only about exact solutions-it is also about how *stable* those solutions are when data is perturbed. In real-world applications, every dataset contains noise: measurement errors in physics experiments, rounding errors in financial computations, or floating-point precision limits in numerical software. Conditioning is the study of how sensitive the solution of a problem is to small changes in input. A well-conditioned problem reacts gently to perturbations; an ill-conditioned one amplifies errors dramatically.

#### The Basic Idea

Suppose we solve the linear system:

$$
Ax = b.
$$

Now imagine we slightly change $b$ to $b + \delta b$. The new solution is $x + \delta x$.

- If $\|\delta x\|$ is about the same size as $\|\delta b\|$, the problem is well-conditioned.
- If $\|\delta x\|$ is much larger, the problem is ill-conditioned.

Conditioning measures this amplification factor.

#### Condition Number

The central tool is the condition number of a matrix $A$:

$$
\kappa(A) = \|A\| \cdot \|A^{-1}\|,
$$

where $\|\cdot\|$ is a matrix norm (often the 2-norm).

- If $\kappa(A)$ is close to 1, the problem is well-conditioned.
- If $\kappa(A)$ is large (say, $10^6$ or higher), the problem is ill-conditioned.

Interpretation:

- $\kappa(A)$ estimates the maximum relative error in the solution compared to the relative error in the data.
- In practical terms, every digit of accuracy in $b$ may be lost in $x$ if $\kappa(A)$ is too large.

#### Singular Values and Conditioning

Condition number in 2-norm can be expressed using singular values:

$$
\kappa(A) = \frac{\sigma_{\max}}{\sigma_{\min}},
$$

where $\sigma_{\max}$ and $\sigma_{\min}$ are the largest and smallest singular values of $A$.

- If the smallest singular value is tiny compared to the largest, $A$ nearly collapses some directions, making inversion unstable.
- This explains why nearly singular matrices are so problematic in numerical computation.

#### Example 1: A Stable System

$$
A = \begin{bmatrix}2 & 0 \\ 0 & 3\end{bmatrix}.
$$

Here, $\sigma_{\max} = 3, \sigma_{\min} = 2$.
So $\kappa(A) = 3/2 = 1.5$. Very well-conditioned: small changes in input produce small changes in output.

#### Example 2: An Ill-Conditioned System

$$
A = \begin{bmatrix}1 & 1 \\ 1 & 1.0001\end{bmatrix}.
$$

The determinant is very small, so the system is nearly singular.

- One singular value is about 2.0.
- The other is about 0.0001.
- Condition number: $\kappa(A) \approx 20000$.

This means even tiny changes in $b$ can wildly change $x$.

#### Geometric Intuition

A matrix transforms a unit sphere into an ellipse.

- The longest axis of the ellipse = $\sigma_{\max}$.
- The shortest axis = $\sigma_{\min}$.
- The ratio $\sigma_{\max} / \sigma_{\min}$ shows how stretched the transformation is.

If the ellipse is nearly flat, directions aligned with the short axis almost vanish, and recovering them is highly unstable.

#### Everyday Analogies

- Whispering in a noisy room: If the signal is much weaker than the background noise, any message is drowned out. That's an ill-conditioned system.
- Balancing a broomstick on your finger: Small wobbles cause big movements-sensitive, unstable, ill-conditioned.
- Maps: A distorted map stretches some regions (well-measured) and squashes others (poorly represented). That's condition number in geometry.

#### Why Conditioning Matters in Computation

1. Numerical Precision: Computers store numbers with limited precision (floating-point). An ill-conditioned system magnifies rounding errors, leading to unreliable results.
2. Regression: In statistics, highly correlated features make the design matrix ill-conditioned, destabilizing coefficient estimates.
3. Machine Learning: Ill-conditioning leads to unstable training, exploding or vanishing gradients.
4. Engineering: Control systems based on ill-conditioned models may be hypersensitive to measurement errors.

#### Techniques for Handling Ill-Conditioning

- Regularization: Add a penalty term, like ridge regression ($\lambda I$), to stabilize inversion.
- Truncated SVD: Ignore tiny singular values that only amplify noise.
- Scaling and Preconditioning: Rescale data or multiply by a well-chosen matrix to improve conditioning.
- Avoiding Explicit Inverses: Use factorizations (LU, QR, SVD) rather than computing $A^{-1}$.

#### Connection to Previous Topics

- Pseudoinverse: Ill-conditioning is visible when singular values approach zero, making $A^+$ unstable.
- Low-rank approximation: Truncating small singular values both compresses data and improves conditioning.
- PCA: Discarding low-variance components is essentially a conditioning improvement step.

#### Why It Matters

Conditioning bridges abstract algebra and numerical reality. Linear algebra promises solutions, but conditioning tells us whether those solutions are trustworthy. Without it, one might misinterpret noise as signal, or lose all accuracy in computations that look fine on paper.

#### Try It Yourself

1. Compute the condition number of $\begin{bmatrix}1 & 1 \\ 1 & 1.0001\end{bmatrix}$. Solve for $x$ in $Ax = b$ for several slightly different $b$. Watch how solutions swing dramatically.
2. Take a dataset with nearly collinear features. Compute the condition number of its covariance matrix. Relate this to instability in regression coefficients.
3. Simulate numerical errors: Add random noise of size $10^{-6}$ to an ill-conditioned system and observe solution errors.
4. Prove that $\kappa(A) \geq 1$ always holds.

Conditioning reveals the hidden fragility of problems. It warns us when algebra says "solution exists" but computation whispers "don't trust it."

