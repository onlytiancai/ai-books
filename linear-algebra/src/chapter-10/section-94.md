### 94. Data Preprocessing as Linear Operations (Centering, Whitening, Scaling)

Before any sophisticated model can be trained, raw data must be preprocessed. Surprisingly, many of the most common preprocessing steps-centering, scaling, whitening-are nothing more than linear algebra operations in disguise. Understanding them this way not only clarifies why they work, but also shows how they connect to broader concepts like covariance, eigenvalues, and singular value decomposition.

#### The Nature of Preprocessing

Most datasets are stored as a matrix: rows correspond to samples (observations) and columns correspond to features (variables). For instance, in a dataset of 1,000 people with height, weight, and age recorded, we'd have a $1000 \times 3$ matrix. Linear algebra allows us to systematically reshape, scale, and rotate this matrix to prepare it for downstream analysis.

#### Centering: Shifting the Origin

Centering means subtracting the mean of each column (feature) from all entries in that column.

$$
X_{centered} = X - \mathbf{1}\mu^T
$$

- Here $X$ is the data matrix, $\mu$ is the vector of column means, and $\mathbf{1}$ is a column of ones.
- Effect: moves the dataset so that each feature has mean zero.
- Geometric view: translates the cloud of points so its "center of mass" sits at the origin.
- Why important: covariance and correlation formulas assume data are mean-centered; otherwise, cross-terms are skewed.

Example:
If people's heights average 170 cm, subtract 170 from every height. After centering, "height = 0" corresponds to the average person.

#### Scaling: Normalizing Variability

Raw features can have different units or magnitudes (e.g., weight in kg, income in thousands of dollars). To compare them fairly, we scale:

$$
X_{scaled} = X D^{-1}
$$

where $D$ is a diagonal matrix of feature standard deviations.

- Each feature now has variance 1.
- Geometric view: rescales axes so all dimensions have equal "spread."
- Common in machine learning: ensures gradient descent does not disproportionately focus on features with large raw values.

Example:
If weight varies around 60 kg ± 15, dividing by 15 makes its spread comparable to that of height (±10 cm).

#### Whitening: Removing Correlations

Even after centering and scaling, features can remain correlated (e.g., height and weight). Whitening transforms the data so features become uncorrelated with unit variance.

- Let $\Sigma = \frac{1}{n} X^T X$ be the covariance matrix of centered data.
- Perform eigendecomposition: $\Sigma = Q \Lambda Q^T$.
- Whitening transform:

$$
X_{white} = X Q \Lambda^{-1/2} Q^T
$$

Result:

1. The covariance matrix of $X_{white}$ is the identity matrix.
2. Each new feature is a rotated combination of old features, with no redundancy.

Geometric view: whitening "spheres" the data cloud, turning an ellipse into a perfect circle.

#### Covariance Matrix as the Key Player

The covariance matrix itself arises naturally from preprocessing:

$$
\Sigma = \frac{1}{n} X^T X \quad \text{(if \(X\) is centered).}
$$

- Diagonal entries: variances of features.
- Off-diagonal entries: covariances, measuring linear relationships.
- Preprocessing operations (centering, scaling, whitening) are designed to reshape data so $\Sigma$ becomes easier to interpret and more stable for learning algorithms.

#### Connections to PCA

- Centering is required before PCA, otherwise the first component just points to the mean.
- Scaling ensures PCA does not overweight large-variance features.
- Whitening is closely related to PCA itself: PCA diagonalizes the covariance, and whitening goes one step further by rescaling eigenvalues to unity.

Thus, PCA can be seen as a preprocessing pipeline plus an analysis step.

#### Practical Workflows

1. Centering and Scaling (Standardization): The default for many algorithms like logistic regression or SVM.
2. Whitening: Often used in signal processing (e.g., removing correlations in audio or images).
3. Batch Normalization in Deep Learning: A variant of centering + scaling applied layer by layer during training.
4. Whitening in Image Processing: Ensures features like pixel intensities are decorrelated, improving compression and recognition.

#### Worked Example

Suppose we have three features: height, weight, and age.

1. Raw data:

   - Mean height = 170 cm, mean weight = 65 kg, mean age = 35 years.
   - Variance differs widely: age varies less, weight more.

2. After centering:

   - Mean of each feature is zero.
   - A person of average height now has value 0 in that feature.

3. After scaling:

   - All features have unit variance.
   - Algorithms can treat age and weight equally.

4. After whitening:

   - Correlation between height and weight disappears.
   - Features become orthogonal directions in feature space.

#### Why It Matters

Without preprocessing, models may be misled by scale, units, or correlations. Preprocessing makes features comparable, balanced, and independent-a crucial condition for algorithms that rely on geometry (distances, angles, inner products).

In essence, preprocessing is the bridge from messy, real-world data to the clean structures linear algebra expects.

#### Try It Yourself

1. For a small dataset, compute the covariance matrix before and after centering. What changes?
2. Scale the dataset so each feature has unit variance. Check the new covariance.
3. Perform whitening via eigendecomposition and verify the covariance matrix becomes the identity.
4. Plot the data points in 2D before and after whitening. Notice how an ellipse becomes a circle.

Preprocessing through linear algebra shows that preparing data is not just housekeeping-it's a fundamental reshaping of the problem's geometry.

