### 85. Principal Component Analysis (Variance and Directions)

Principal Component Analysis (PCA) is one of the most widely used techniques in statistics, data analysis, and machine learning. It provides a method to reduce the dimensionality of a dataset while retaining as much important information as possible. The central insight is that data often varies more strongly in some directions than others, and by focusing on those directions we can summarize the dataset with fewer dimensions, less noise, and more interpretability.

#### The Basic Question

Suppose we have data points in high-dimensional space, say $x_1, x_2, \dots, x_m \in \mathbb{R}^n$. Each point might be:

- A face image flattened into thousands of pixels.
- A customer's shopping history across hundreds of products.
- A gene expression profile across thousands of genes.

Storing and working with all features directly is expensive, and many features may be redundant or correlated. PCA asks:

*Can we re-express this data in a smaller set of directions that capture the most variability?*

#### Variance as Information

The guiding principle of PCA is variance.

- Variance measures how spread out the data is along a direction.
- High variance directions capture meaningful structure (e.g., different facial expressions, major spending habits).
- Low variance directions often correspond to noise or unimportant fluctuations.

Thus, PCA searches for the directions (called principal components) along which the variance of the data is maximized.

#### Centering and Covariance

To begin, we center the data by subtracting the mean vector:

$$
X_c = X - \mathbf{1}\mu^T,
$$

where $\mu$ is the average of all data points.

The covariance matrix is then:

$$
C = \frac{1}{m} X_c^T X_c.
$$

- The diagonal entries measure variance of each feature.
- Off-diagonal entries measure how features vary together.

Finding principal components is equivalent to finding the eigenvectors of this covariance matrix.

#### The Eigenview

1. The eigenvectors of $C$ are the directions (principal components).
2. The corresponding eigenvalues tell us how much variance lies along each component.
3. Sorting eigenvalues from largest to smallest gives the most informative to least informative directions.

If we keep the top $k$ eigenvectors, we project data into a $k$-dimensional subspace that preserves most variance.

#### The SVD View

Another perspective uses the Singular Value Decomposition (SVD):

$$
X_c = U \Sigma V^T.
$$

- Columns of $V$ are the principal directions.
- Singular values squared ($\sigma_i^2$) correspond to eigenvalues of the covariance matrix.
- Projecting onto the first $k$ columns of $V$ gives the reduced representation.

This makes PCA and SVD essentially the same computation.

#### A Simple Example

Imagine we measure height and weight of 1000 people. Plotting them shows a strong correlation: taller people are often heavier. The cloud of points stretches along a diagonal.

- PCA's first component is this diagonal line: the direction of maximum variance.
- The second component is perpendicular, capturing the much smaller differences (like people of equal height but slightly different weights).
- Keeping only the first component reduces two features into one while retaining most of the information.

#### Geometric Picture

- PCA rotates the coordinate system so that axes align with directions of greatest variance.
- Projecting onto the top $k$ components flattens the data into a lower-dimensional space, like flattening a tilted pancake onto its broadest plane.

#### Everyday Analogies

- Photography: PCA is like adjusting the angle of a camera to capture the most important part of a scene in one shot.
- Summarizing a book: Instead of every page, you keep only the main themes.
- Music: A symphony can be broken into a few dominant melodies; the rest are variations.

#### Applications

1. Data Compression: Reduce storage by keeping only leading components (e.g., compressing images).
2. Noise Reduction: Small-variance directions often correspond to measurement noise; discarding them yields cleaner data.
3. Visualization: Reducing data to 2D or 3D for scatterplots helps us see clusters and patterns.
4. Preprocessing in Machine Learning: Many models train faster and generalize better on PCA-transformed data.
5. Genomics and Biology: PCA finds major axes of variation across thousands of genes.
6. Finance: PCA summarizes correlated movements of stocks into a few principal "factors."

#### Trade-Offs and Limitations

- Interpretability: Principal components are linear combinations of original features, sometimes hard to explain in plain terms.
- Linearity: PCA only captures linear relationships; nonlinear methods (like kernel PCA, t-SNE, or UMAP) may be better for curved manifolds.
- Scaling: Features must be normalized properly; otherwise, PCA might overemphasize units with large raw variance.
- Global Method: PCA captures overall variance, not local structures (e.g., small clusters within the data).

#### Mathematical Guarantees

PCA has an optimality guarantee:

- Among all $k$-dimensional linear subspaces, the PCA subspace minimizes the reconstruction error (squared Euclidean distance between data and its projection).
- This is essentially the low-rank approximation theorem seen earlier, applied to covariance matrices.

#### Why It Matters

PCA shows how linear algebra transforms raw data into insight. By focusing on variance, it provides a principled way to filter noise, compress information, and reveal hidden patterns. It is simple, computationally efficient, and foundational-almost every modern data pipeline uses PCA, explicitly or implicitly.

#### Try It Yourself

1. Take a dataset of two correlated features (like height and weight). Compute the covariance matrix, eigenvectors, and project onto the first component. Visualize before and after.
2. For a grayscale image stored as a matrix, flatten it into vectors and apply PCA. How many components are needed to reconstruct it with 90% accuracy?
3. Use PCA on the famous Iris dataset (4 features). Plot the data in 2D using the first two components. Notice how species separate in this reduced space.
4. Prove that the first principal component is the unit vector $v$ that maximizes $\|X_c v\|^2$.

PCA distills complexity into clarity: it tells us not just where the data is, but where it *really goes*.

