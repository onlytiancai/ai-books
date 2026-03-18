### 97. Recommender Systems and Low-Rank Models (Fill the Missing Entries)

Recommender systems-such as those used by Netflix, Amazon, or Spotify-are built on the principle that preferences can be captured by low-dimensional structures hidden inside large, sparse data. Linear algebra gives us the machinery to expose and exploit these structures, especially through low-rank models.

#### The Matrix of Preferences

We begin with a user–item matrix $R \in \mathbb{R}^{m \times n}$:

- Rows represent users.
- Columns represent items (movies, books, songs).
- Entries $R_{ij}$ store the rating (say 1–5 stars) or interaction (clicks, purchases).

In practice, most entries are missing-users rate only a small subset of items. The central challenge: predict the missing entries.

#### Why Low-Rank Structure?

Despite its size, $R$ often lies close to a low-rank approximation:

$$
R \approx U V^T
$$

- $U \in \mathbb{R}^{m \times k}$: user factors.
- $V \in \mathbb{R}^{n \times k}$: item factors.
- $k \ll \min(m, n)$.

Here, each user and each item is represented in a shared latent feature space.

- Example: For movies, latent dimensions might capture "action vs. romance," "old vs. new," or "mainstream vs. indie."
- A user's preference vector in this space interacts with an item's feature vector to generate a predicted rating.

This factorization explains correlations: if you liked Movie A and B, and Movie C shares similar latent features, the system predicts you'll like C too.

#### Singular Value Decomposition (SVD) Approach

If $R$ were complete (no missing entries), we could compute the SVD:

$$
R = U \Sigma V^T.
$$

- Keep the top $k$ singular values to form a rank-$k$ approximation.
- This captures the dominant patterns in user preferences.
- Geometric view: project the massive data cloud onto a smaller $k$-dimensional subspace where structure is clearer.

But real data is incomplete. That leads to matrix completion problems.

#### Matrix Completion

Matrix completion tries to infer missing entries of $R$ by assuming low rank. The optimization problem is:

$$
\min_{X} \ \text{rank}(X) \quad \text{s.t. } X_{ij} = R_{ij} \text{ for observed entries}.
$$

Since minimizing rank is NP-hard, practical algorithms instead minimize the nuclear norm (sum of singular values) or use alternating minimization:

- Initialize $U, V$ randomly.
- Iteratively solve for one while fixing the other.
- Converge to a low-rank factorization that fits the observed ratings.

#### Alternating Least Squares (ALS)

ALS is a standard approach:

1. Fix $V$, solve least squares for $U$.
2. Fix $U$, solve least squares for $V$.
3. Repeat until convergence.

Each subproblem is straightforward linear regression, solvable with normal equations or QR decomposition.

#### Stochastic Gradient Descent (SGD)

Another approach: treat each observed rating as a training sample. Update latent vectors by minimizing squared error:

$$
\ell = (R_{ij} - u_i^T v_j)^2.
$$

Iteratively adjust user vector $u_i$ and item vector $v_j$ along gradients. This scales well to huge datasets, making it common in practice.

#### Regularization

To prevent overfitting:

$$
\ell = (R_{ij} - u_i^T v_j)^2 + \lambda (\|u_i\|^2 + \|v_j\|^2).
$$

- Regularization shrinks factors, discouraging extreme values.
- Geometrically, it keeps latent vectors within a reasonable ball in feature space.

#### Cold Start Problem

- New users: Without ratings, $u_i$ is unknown. Solutions: use demographic features or ask for a few initial ratings.
- New items: Similarly, items need side information (metadata, tags) to generate initial latent vectors.

This is where hybrid models combine matrix factorization with content-based features.

#### Example: Movie Ratings

Imagine 1,000 users and 5,000 movies.

- The raw $R$ matrix has 5 million entries, but each user has rated only ~50 movies.
- Matrix completion with rank $k = 20$ recovers a dense approximation.
- Each user is represented by 20 latent "taste" factors; each movie by 20 latent "theme" factors.
- Prediction: the dot product of user and movie vectors.

#### Beyond Ratings: Implicit Feedback

In practice, systems often lack explicit ratings. Instead, they use:

- Views, clicks, purchases, skips.
- These signals are indirect but abundant.
- Factorization can handle them by treating interactions as weighted observations.

#### Connections to Other Linear Algebra Tools

- SVD (Chapter 9): The backbone of factorization methods.
- Pseudoinverse (Chapter 9): Useful when solving small regression subproblems in ALS.
- Conditioning (Chapter 9): Factorization stability depends on well-scaled latent factors.
- PCA (Chapter 96): PCA is essentially a low-rank approximation, so PCA and recommenders share the same mathematics.

#### Why It Matters

Recommender systems personalize the modern internet. Every playlist suggestion, book recommendation, or ad placement is powered by linear algebra hidden in a massive sparse matrix. Low-rank modeling shows how even incomplete, noisy data can be harnessed to reveal patterns of preference and behavior.

#### Try It Yourself

1. Take a small user–item matrix with missing entries. Apply rank-2 approximation via SVD to fill in gaps.
2. Implement one step of ALS: fix movie factors and update user factors with least squares.
3. Compare predictions with and without regularization. Notice how regularization stabilizes results.
4. Explore the cold-start problem: simulate a new user and try predicting preferences from minimal data.

Low-rank models reveal a powerful truth: behind the enormous variety of human choices lies a surprisingly small set of underlying patterns-and linear algebra is the key to uncovering them.

