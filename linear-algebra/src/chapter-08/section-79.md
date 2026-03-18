### 79. Fourier Viewpoint

The Fourier viewpoint is one of the most profound connections in linear algebra: the idea that complex signals, data, or functions can be decomposed into sums of simpler, orthogonal waves. Instead of describing information in its raw form (time, space, or coordinates), we express it in terms of frequencies. This perspective reshapes how we analyze, compress, and understand information across mathematics, physics, and engineering.

#### Fourier Series: The Basic Idea

Suppose we have a periodic function $f(x)$ defined on $[-\pi, \pi]$. The Fourier series expresses $f(x)$ as:

$$
f(x) = a_0 + \sum_{n=1}^\infty \left( a_n \cos(nx) + b_n \sin(nx) \right).
$$

- The coefficients $a_n, b_n$ are found using inner products with sine and cosine functions.
- Each sine and cosine is orthogonal to the others under the inner product

  $$
  \langle f, g \rangle = \int_{-\pi}^\pi f(x) g(x) \, dx.
  $$

Thus, Fourier series is nothing more than expanding a function in an orthonormal basis of trigonometric functions.

#### Fourier Transform: From Time to Frequency

For non-periodic signals, the Fourier transform generalizes this expansion. For a function $f(t)$,

$$
\hat{f}(\omega) = \int_{-\infty}^\infty f(t) e^{-i \omega t} dt
$$

transforms it into frequency space. The inverse transform reconstructs $f(t)$ from its frequencies.

This is again an inner product viewpoint: the exponential functions $e^{i \omega t}$ act as orthogonal basis functions on $\mathbb{R}$.

#### Orthogonality of Waves

The trigonometric functions $\{\cos(nx), \sin(nx)\}$ and the complex exponentials $\{e^{i\omega t}\}$ form orthogonal families.

- Two different sine waves have zero inner product over a full period.
- Likewise, exponentials with different frequencies are orthogonal.

This is exactly like orthogonal vectors in $\mathbb{R}^n$, except here the space is infinite-dimensional.

#### Discrete Fourier Transform (DFT)

In computational settings, we don't work with infinite integrals but with finite data. The DFT expresses an $n$-dimensional vector $x = (x_0, \dots, x_{n-1})$ as a linear combination of orthogonal complex exponentials:

$$
X_k = \sum_{j=0}^{n-1} x_j e^{-2\pi i jk / n}, \quad k=0,\dots,n-1.
$$

This is simply a change of basis: from the standard basis (time domain) to the Fourier basis (frequency domain).

The Fast Fourier Transform (FFT) computes this in $O(n \log n)$ time, making Fourier analysis practical at scale.

#### Geometric Meaning

- In the time domain, data is expressed as a sequence of raw values.
- In the frequency domain, data is expressed as amplitudes of orthogonal waves.
- The Fourier viewpoint is just a rotation into a new orthogonal coordinate system, exactly like diagonalizing a matrix or changing basis.

#### Everyday Analogies

- Music: Any chord is a mixture of pure notes. The Fourier viewpoint extracts the individual notes (frequencies) from the sound.
- Light: A beam of light is a mixture of colors (frequencies of waves). A prism "performs" a Fourier decomposition.
- Finance: A price signal is decomposed into long-term trends (low frequencies) and short-term fluctuations (high frequencies).
- Cooking: A dish is made from distinct ingredients-Fourier analysis tells you what proportions of each ingredient are in the mix.

#### Applications

1. Signal Processing: Filtering unwanted noise corresponds to removing high-frequency components.
2. Image Compression: JPEG uses Fourier-like transforms (cosine transforms) to compress images.
3. Data Analysis: Identifying cycles and periodic patterns in time series.
4. Physics: Quantum states are represented in both position and momentum bases, linked by Fourier transform.
5. Partial Differential Equations: Solutions are simplified by moving to frequency space, where derivatives become multipliers.

#### Why It Matters

- Fourier methods turn difficult problems into simpler ones: convolution becomes multiplication, differentiation becomes scaling.
- They provide a universal language for analyzing periodicity, oscillation, and wave phenomena.
- They are linear algebra at heart: orthogonal expansions in special bases.

#### Try It Yourself

1. Compute the Fourier series coefficients for $f(x) = x$ on $[-\pi,\pi]$.
2. For the sequence $(1,0,0,0)$, compute the 4-point DFT and interpret the result.
3. Show that $\int_{-\pi}^\pi \sin(mx)\cos(nx) dx = 0$.
4. Challenge: Prove that the Fourier basis $\{e^{i2\pi k t}\}_{k=0}^{n-1}$ is orthonormal in $\mathbb{C}^n$.

The Fourier viewpoint reveals that every signal, no matter how complex, can be seen as a combination of simple, orthogonal waves. It is a perfect marriage of geometry, algebra, and analysis, and one of the most important ideas in modern mathematics.

