### 80. Polynomial and Multifeature Least Squares

Least squares problems become especially powerful when extended to fitting polynomials or handling multiple features at once. Instead of a single straight line through data, we can fit curves of higher degree or surfaces in higher dimensions. These generalizations lie at the heart of regression, data analysis, and scientific modeling.

#### From Line to Polynomial

The simplest least squares model is a straight line:

$$
y \approx \beta_0 + \beta_1 x.
$$

But many relationships are nonlinear. Polynomial least squares generalizes the model to:

$$
y \approx \beta_0 + \beta_1 x + \beta_2 x^2 + \dots + \beta_d x^d.
$$

Here, each power of $x$ is treated as a new feature. The problem reduces to ordinary least squares on the design matrix:

$$
A = \begin{bmatrix}
1 & x_1 & x_1^2 & \dots & x_1^d \\
1 & x_2 & x_2^2 & \dots & x_2^d \\
\vdots & \vdots & \vdots & & \vdots \\
1 & x_n & x_n^2 & \dots & x_n^d
\end{bmatrix},
\quad
\beta = \begin{bmatrix}\beta_0 \\ \beta_1 \\ \vdots \\ \beta_d\end{bmatrix}.
$$

The least squares solution minimizes $\|A\beta - y\|$.

#### Multiple Features

When data involves several predictors, we extend the model to:

$$
y \approx \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_p x_p.
$$

In matrix form:

$$
y \approx A\beta,
$$

where $A$ is the design matrix with columns corresponding to features (including a column of ones for the intercept).

The least squares solution is still given by the normal equations:

$$
\hat{\beta} = (A^T A)^{-1} A^T y,
$$

or more stably by QR or SVD factorizations.

#### Example: Polynomial Fit

Suppose we have data points $(1,1), (2,2.2), (3,2.9), (4,4.1)$. Fitting a quadratic model $y \approx \beta_0 + \beta_1 x + \beta_2 x^2$:

1. Construct design matrix:

   $$
   A = \begin{bmatrix}
   1 & 1 & 1 \\
   1 & 2 & 4 \\
   1 & 3 & 9 \\
   1 & 4 & 16
   \end{bmatrix}.
   $$

2. Solve least squares problem $\min \|A\beta - y\|$.

3. The result gives coefficients $\beta_0, \beta_1, \beta_2$ that best approximate the curve.

The same process works for higher-degree polynomials or multiple features.

#### Geometric Meaning

- In polynomial least squares, the feature space expands: instead of points on a line, data lives in a higher-dimensional feature space $(1, x, x^2, \dots, x^d)$.
- In multifeature least squares, the column space of $A$ spans all possible linear combinations of features.
- The least squares solution projects the observed output vector $y$ onto this subspace.

Thus, whether polynomial or multifeature, the geometry is the same: projection onto the model space.

#### Everyday Analogies

- Forecasting growth: Linear models capture trends, but quadratic or cubic fits capture acceleration and curvature.
- House prices: Price depends on multiple features (size, location, number of rooms). Multifeature least squares fits them simultaneously.
- Sports performance: A player's score may depend on training time, rest, and nutrition-multiple interacting predictors.
- Physics experiments: Data often follows quadratic or higher-order laws (projectile motion, energy vs. displacement).

#### Practical Challenges

1. Overfitting: Higher-degree polynomials fit noise, not just signal.
2. Multicollinearity: Features may be correlated, making $A^T A$ nearly singular.
3. Scaling: Features with different magnitudes should be normalized.
4. Regularization: Adding penalty terms (ridge or LASSO) stabilizes the solution.

#### Applications

1. Regression in Statistics: Extending linear regression to handle multiple predictors or polynomial terms.
2. Machine Learning: Basis expansion for feature engineering (before neural nets, this was the standard).
3. Engineering: Curve fitting for calibration, modeling, and prediction.
4. Economics: Forecasting models with many variables (inflation, interest rates, spending).
5. Physics and Chemistry: Polynomial regression to model experimental data.

#### Why It Matters

- Polynomial least squares captures curvature in data.
- Multifeature least squares allows multiple predictors to explain outcomes.
- Both generalizations turn linear algebra into a practical modeling tool across science and society.

#### Try It Yourself

1. Fit a quadratic curve through points $(0,1), (1,2), (2,5), (3,10)$. Compare to a straight-line fit.
2. Construct a multifeature design matrix for predicting exam scores based on hours studied, sleep, and prior grades.
3. Show that polynomial regression is just linear regression on transformed features.
4. Challenge: Derive the bias–variance tradeoff in polynomial least squares-why higher degrees increase variance.

Polynomial and multifeature least squares extend the reach of linear algebra from straight lines to complex patterns, giving us a universal framework for modeling relationships in data.

#### Closing 
```
Closest lines are drawn,
errors fall away to rest,
angles guard the truth.
```

## Chapter 9. SVD, PCA, and conditioning 
### Opening 
```
Closest lines are drawn,
errors fall away to rest,
angles guard the truth.
```

