### 35. Basis and Coordinates

The concepts of span and linear independence come together in the powerful idea of a basis. A basis gives us the minimal set of building blocks needed to generate an entire vector space, with no redundancy. Once a basis is chosen, every vector in the space can be described uniquely by a list of numbers called its coordinates.

#### What Is a Basis?

A basis of a vector space $V$ is a set of vectors $\{v_1, v_2, \dots, v_k\}$ that satisfies two properties:

1. Spanning property: $\text{span}\{v_1, \dots, v_k\} = V$.
2. Independence property: The vectors are linearly independent.

In short: a basis is a spanning set with no redundancy.

#### Example: Standard Bases

1. In $\mathbb{R}^2$, the standard basis is $\{(1,0), (0,1)\}$.
2. In $\mathbb{R}^3$, the standard basis is $\{(1,0,0), (0,1,0), (0,0,1)\}$.
3. In $\mathbb{R}^n$, the standard basis is the collection of unit vectors, each with a 1 in one position and 0 elsewhere.

These are called standard because they are the default way of describing coordinates.

#### Uniqueness of Coordinates

One of the most important facts about bases is that they provide unique representations of vectors.

- Given a basis $\{v_1, \dots, v_k\}$, any vector $x \in V$ can be written uniquely as:

  $$
  x = a_1 v_1 + a_2 v_2 + \dots + a_k v_k.
  $$
- The coefficients $(a_1, a_2, \dots, a_k)$ are the coordinates of $x$ relative to that basis.

This uniqueness distinguishes bases from arbitrary spanning sets, where redundancy allows multiple representations.

#### Example in $\mathbb{R}^2$

Let basis = $\{(1,0), (0,1)\}$.

- Vector $(3,5) = 3(1,0) + 5(0,1)$.
- Coordinates relative to this basis: $(3,5)$.

If we switch to a different basis, the coordinates change even though the vector itself does not.

#### Example with Non-Standard Basis

Basis = $\{(1,1), (1,-1)\}$ in $\mathbb{R}^2$.
Find coordinates of $x = (2,0)$.

Solve $a(1,1) + b(1,-1) = (2,0)$.
This gives system:

$$
a + b = 2, \quad a - b = 0.
$$

So $a=1, b=1$.
Coordinates relative to this basis: $(1,1)$.

Notice: coordinates depend on basis choice.

#### Basis of Function Spaces

1. For polynomials of degree ≤ 2: basis = $\{1, x, x^2\}$.

   - Example: $2 + 3x + 5x^2$ has coordinates $(2,3,5)$.
2. For continuous functions on $[0,1]$, one possible basis is the infinite set $\{1, x, x^2, \dots\}$.

This shows bases are not restricted to geometric vectors.

#### Dimension

The number of vectors in a basis is the dimension of the vector space.

- $\mathbb{R}^2$ has dimension 2.
- $\mathbb{R}^3$ has dimension 3.
- The space of polynomials of degree ≤ 3 has dimension 4.

Dimension tells us how many independent directions exist in the space.

#### Change of Basis

- Switching from one basis to another is like translating between languages.
- The same vector looks different depending on which "dictionary" (basis) you use.
- Change-of-basis matrices allow systematic translation between coordinate systems.

#### Geometric Interpretation

- A basis is like setting up coordinate axes in a space.
- In 2D, two independent vectors define a grid.
- In 3D, three independent vectors define a full coordinate system.
- Different bases = different grids overlaying the same space.

#### Everyday Analogies

- Language: A basis is like an alphabet. Every word (vector) can be spelled uniquely from the letters (basis vectors).
- Colors: RGB is a basis for color space. Any color can be described uniquely by mixing red, green, and blue.
- Music: Musical notes form a basis. Every chord or melody is a combination of them.

#### Why It Matters

1. Bases provide the simplest possible description of a vector space.
2. They allow us to assign unique coordinates to vectors.
3. They connect the abstract structure of a space with concrete numerical representations.
4. The concept underlies almost all of linear algebra: dimension, transformations, eigenvectors, and more.

#### Try It Yourself

1. Show that $\{(1,2), (3,4)\}$ is a basis of $\mathbb{R}^2$.
2. Express $(4,5)$ in terms of basis $\{(1,1), (1,-1)\}$.
3. Prove that no basis of $\mathbb{R}^3$ can have more than 3 vectors.
4. Challenge: Show that the set $\{1, \cos x, \sin x\}$ is a basis for the space of all linear combinations of $1, \cos x, \sin x$.

A basis is the minimal, elegant foundation of a vector space, turning the infinite into the manageable by providing a finite set of independent building blocks.

