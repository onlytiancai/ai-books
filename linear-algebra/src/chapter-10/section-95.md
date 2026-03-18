### 95. Linear Regression and Classification (From Model to Matrix)

Linear algebra provides the foundation for two of the most widely used tools in data science and applied statistics: linear regression (predicting continuous outcomes) and linear classification (separating categories). Both problems reduce to expressing data in matrix form and then applying linear operations to estimate parameters.

#### The Regression Setup

Suppose we want to predict an output $y \in \mathbb{R}^n$ from features collected in a data matrix $X \in \mathbb{R}^{n \times p}$, where:

- $n$ = number of observations (samples).
- $p$ = number of features (variables).

We assume a linear model:

$$
y \approx X\beta,
$$

where $\beta \in \mathbb{R}^p$ is the vector of coefficients (weights). Each entry of $\beta$ tells us how much its feature contributes to the prediction.

#### The Normal Equations

We want to minimize the squared error:

$$
\min_\beta \|y - X\beta\|^2.
$$

Differentiating leads to the normal equations:

$$
X^T X \beta = X^T y.
$$

- If $X^T X$ is invertible:

$$
\hat{\beta} = (X^T X)^{-1} X^T y.
$$

- If not invertible (multicollinearity, too many features), we use the pseudoinverse via SVD:

$$
\hat{\beta} = X^+ y.
$$

#### Geometric Interpretation

- $X\beta$ is the projection of $y$ onto the column space of $X$.
- The residual $r = y - X\hat{\beta}$ is orthogonal to all columns of $X$.
- This "closest fit" property is why regression is a projection problem.

#### Classification with Linear Models

Instead of predicting continuous outputs, sometimes we want to separate categories (e.g., spam vs. not spam).

- Linear classifier: decides based on the sign of a linear function.

$$
\hat{y} = \text{sign}(w^T x + b).
$$

- Geometric view: $w$ defines a hyperplane in feature space. Points on one side are labeled positive, on the other side negative.
- Relation to regression: logistic regression replaces squared error with a log-likelihood loss, but still solves for weights via iterative linear-algebraic methods.

#### Multiclass Extension

- For $k$ classes, we use a weight matrix $W \in \mathbb{R}^{p \times k}$.
- Prediction:

$$
\hat{y} = \arg \max_j (XW)_{ij}.
$$

- Each class has a column of $W$, and the classifier picks the column with the largest score.

#### Example: Predicting House Prices

- Features: size, number of rooms, distance to city center.
- Target: price.
- $X$ = matrix of features, $y$ = price vector.
- Regression solves for coefficients showing how strongly each factor influences price.

If we switch to classification (predicting "expensive" vs. "cheap"), we treat price as a label and solve for a hyperplane separating the two categories.

#### Computational Aspects

- Directly solving normal equations: $O(p^3)$ (matrix inversion).
- QR factorization: numerically more stable.
- SVD: best when $X$ is ill-conditioned or rank-deficient.
- Modern libraries: exploit sparsity or use gradient-based methods for large datasets.

#### Connections to Other Topics

- Least Squares (Chapter 8): Regression is the canonical least-squares problem.
- SVD (Chapter 9): Pseudoinverse gives regression when columns are dependent.
- Regularization (Chapter 9): Ridge regression adds a penalty $\lambda \|\beta\|^2$ to improve stability.
- Classification (Chapter 10): Forms the foundation of more complex models like support vector machines and neural networks.

#### Why It Matters

Linear regression and classification show the direct link between linear algebra and real-world decisions. They combine geometry (projection, hyperplanes), algebra (solving systems), and computation (factorizations). Despite their simplicity, they remain indispensable: they are interpretable, fast, and often competitive with more complex models.

#### Try It Yourself

1. Given three features and five samples, construct $X$ and $y$. Solve for $\beta$ using the normal equations.
2. Show that residuals are orthogonal to all columns of $X$.
3. Write down a linear classifier separating two clusters of points in 2D. Sketch the separating hyperplane.
4. Explore what happens when two features are highly correlated (collinear). Use pseudoinverse to recover a stable solution.

Linear regression and classification are proof that linear algebra is not just abstract-it is the engine of practical prediction.

