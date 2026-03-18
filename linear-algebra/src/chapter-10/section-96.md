### 96. PCA in Practice (Dimensionality Reduction Workflow)

Principal Component Analysis (PCA) is one of the most widely used tools in applied linear algebra. At its heart, PCA identifies the directions (principal components) along which data varies the most, and then re-expresses the data in terms of those directions. In practice, PCA is not just a mathematical curiosity-it is a complete workflow for reducing dimensionality, denoising data, and extracting patterns from high-dimensional datasets.

#### The Motivation

Modern datasets often have thousands or even millions of features:

- Images: each pixel is a feature.
- Genomics: each gene expression level is a feature.
- Text: each word in a vocabulary becomes a dimension.

Working in such high dimensions is expensive (computationally) and fragile (noise accumulates). PCA provides a systematic way to reduce the feature space to a smaller set of dimensions that still captures most of the variability.

#### Step 1: Organizing the Data

We start with a data matrix $X \in \mathbb{R}^{n \times p}$:

- $n$: number of samples (observations).
- $p$: number of features (variables).

Each row is a sample; each column is a feature.

Centering is the first preprocessing step: subtract the mean of each column so the dataset has mean zero. This ensures that PCA describes variance rather than being biased by offsets.

$$
X_{centered} = X - \mathbf{1}\mu^T
$$

#### Step 2: Covariance Matrix

Next, compute the covariance matrix:

$$
\Sigma = \frac{1}{n} X_{centered}^T X_{centered}.
$$

- Diagonal entries: variance of each feature.
- Off-diagonal entries: how features co-vary.

The structure of $\Sigma$ determines the directions of maximal variation in the data.

#### Step 3: Eigen-Decomposition or SVD

Two equivalent approaches:

1. Eigen-decomposition: Solve $\Sigma v = \lambda v$.

   - Eigenvectors $v$ are the principal components.
   - Eigenvalues $\lambda$ measure variance along those directions.

2. Singular Value Decomposition (SVD): Directly decompose the centered data matrix:

   $$
   X_{centered} = U \Sigma V^T.
   $$

   - Columns of $V$ = principal directions.
   - Squared singular values correspond to variances.

SVD is preferred in practice for numerical stability and efficiency, especially when $p$ is very large.

#### Step 4: Choosing the Number of Components

We order eigenvalues $\lambda_1 \geq \lambda_2 \geq \dots \geq \lambda_p$.

- Explained variance ratio:

  $$
  \text{EVR}(k) = \frac{\sum_{i=1}^k \lambda_i}{\sum_{i=1}^p \lambda_i}.
  $$
- We choose $k$ such that EVR exceeds some threshold (e.g., 90–95%).
- This balances dimensionality reduction with information preservation.

Graphically, a scree plot shows eigenvalues, and we look for the "elbow" point where additional components add little variance.

#### Step 5: Projecting Data

Once we select $k$ components, we project onto them:

$$
X_{PCA} = X_{centered} V_k,
$$

where $V_k$ contains the top $k$ eigenvectors.

Result:

- $X_{PCA} \in \mathbb{R}^{n \times k}$.
- Each row is now a $k$-dimensional representation of the original sample.

#### Worked Example: Face Images

Suppose we have a dataset of grayscale images, each $100 \times 100$ pixels ($p = 10,000$).

1. Center each pixel value.
2. Compute covariance across all images.
3. Find eigenvectors = eigenfaces. These are characteristic patterns like "glasses," "mouth shape," or "lighting direction."
4. Keep top 50 components. Each face is now represented as a 50-dimensional vector instead of 10,000.

This drastically reduces storage and speeds up recognition while keeping key features.

#### Practical Considerations

- Standardization: If features have different scales (e.g., age in years vs. income in thousands), we must scale them before PCA.
- Computational shortcuts: For very large $p$, it's often faster to compute PCA via truncated SVD on $X$ directly.
- Noise filtering: Small eigenvalues often correspond to noise; truncating them denoises the dataset.
- Interpretability: Principal components are linear combinations of features. Sometimes these combinations are interpretable, sometimes not.

#### Connections to Other Concepts

- Whitening (Chapter 94): PCA followed by scaling eigenvalues to 1 is whitening.
- SVD (Chapter 9): PCA is essentially an application of SVD.
- Regression (Chapter 95): PCA can be used before regression to reduce collinearity among predictors (PCA regression).
- Machine learning pipelines: PCA is often used before clustering, classification, or neural networks.

#### Why It Matters

PCA turns raw, unwieldy data into a compact form without losing essential structure. It enables visualization (2D/3D plots of high-dimensional data), faster learning, and noise reduction. Many breakthroughs-from face recognition to gene expression analysis-rely on PCA as the first preprocessing step.

#### Try It Yourself

1. Take a dataset with 3 features. Manually compute covariance, eigenvalues, and eigenvectors.
2. Project the data onto the first two principal components and plot. Compare to the original 3D scatter.
3. Download an image dataset and apply PCA to compress it. Reconstruct the images with 10, 50, 100 components. Observe the trade-off between compression and fidelity.
4. Compute explained variance ratios and decide how many components to keep.

PCA is the bridge between raw data and meaningful representation: it reduces complexity while sharpening patterns. It shows how linear algebra can reveal hidden order in high-dimensional chaos.

