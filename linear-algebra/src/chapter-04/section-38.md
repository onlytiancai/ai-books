### 38. Coordinates Relative to a Basis

Once a basis for a vector space is chosen, every vector in that space can be described uniquely in terms of the basis. These descriptions are called coordinates. Coordinates transform abstract vectors into concrete lists of numbers, making computation possible. Changing the basis changes the coordinates, but the underlying vector remains the same.

#### The Core Idea

Given a vector space $V$ and a basis $B = \{v_1, v_2, \dots, v_n\}$, every vector $x \in V$ can be written uniquely as:

$$
x = a_1 v_1 + a_2 v_2 + \dots + a_n v_n.
$$

The coefficients $(a_1, a_2, \dots, a_n)$ are the coordinates of $x$ with respect to the basis $B$.

This representation is unique because basis vectors are independent.

#### Example in $\mathbb{R}^2$

1. Standard basis: $B = \{(1,0), (0,1)\}$.

   - Vector $x = (3,5)$.
   - Coordinates relative to $B$: $(3,5)$.

2. Non-standard basis: $B = \{(1,1), (1,-1)\}$.

   - Write $x = (3,5)$ as $a(1,1) + b(1,-1)$.
   - Solve:

     $$
     a+b = 3, \quad a-b = 5.
     $$

     Adding: $2a = 8 \implies a = 4$.
     Subtracting: $2b = -2 \implies b = -1$.
   - Coordinates relative to this basis: $(4, -1)$.

The same vector looks different depending on the chosen basis.

#### Example in $\mathbb{R}^3$

Let $B = \{(1,0,0), (1,1,0), (1,1,1)\}$.
Find coordinates of $x = (2,3,4)$.

Solve $a(1,0,0) + b(1,1,0) + c(1,1,1) = (2,3,4)$.
This gives system:

$$
a+b+c = 2, \quad b+c = 3, \quad c = 4.
$$

From $c=4$, we get $b+c=3 \implies b=-1$.
Then $a+b+c=2 \implies a-1+4=2 \implies a=-1$.
Coordinates: $(-1, -1, 4)$.

#### Matrix Formulation

If $B = \{v_1, \dots, v_n\}$, form the basis matrix

$$
P = [v_1 \ v_2 \ \dots \ v_n].
$$

Then for a vector $x$, its coordinate vector $[x]_B$ satisfies

$$
P [x]_B = x.
$$

Thus,

$$
[x]_B = P^{-1}x.
$$

This shows coordinate transformation is simply matrix multiplication.

#### Changing Coordinates

Suppose a vector has coordinates $[x]_B$ relative to basis $B$. If we switch to another basis $C$, we use a change-of-basis matrix to convert coordinates:

$$
[x]_C = (P_C^{-1} P_B) [x]_B.
$$

This process is fundamental in computer graphics, robotics, and data transformations.

#### Geometric Meaning

- A basis defines a coordinate system: axes in the space.
- Coordinates are the "addresses" of vectors relative to those axes.
- Changing basis is like rotating or stretching the grid: the address changes, but the point does not.

#### Everyday Analogies

- Maps: Latitude and longitude are coordinates relative to Earth's axis. If we change the map projection, the coordinates change, but the physical location stays the same.
- Languages: Describing the same object in English or French yields different words (coordinates), but the object (vector) is unchanged.
- Music: The same melody can be written in different keys (bases); the notes shift, but the tune remains.

#### Why It Matters

1. Coordinates make abstract vectors computable.
2. They allow us to represent functions, polynomials, and geometric objects numerically.
3. Changing basis simplifies problems-e.g., diagonalization makes matrices easy to analyze.
4. They connect the abstract (spaces, bases) with the concrete (numbers, matrices).

#### Try It Yourself

1. Express $x=(4,2)$ relative to basis $\{(1,1),(1,-1)\}$.
2. Find coordinates of $x=(2,1,3)$ relative to basis $\{(1,0,1),(0,1,1),(1,1,0)\}$.
3. If basis $B$ is the standard basis and basis $C=\{(1,1),(1,-1)\}$, compute the change-of-basis matrix from $B$ to $C$.
4. Challenge: Show that if $P$ is invertible, its columns form a basis, and explain why this guarantees uniqueness of coordinates.

Coordinates relative to a basis are the bridge between geometry and algebra: they turn abstract spaces into numerical systems where computation, reasoning, and transformation become systematic and precise.

