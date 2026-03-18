### 2. Vector Notation, Components, and Arrows

Linear algebra gives us powerful ways to describe and manipulate vectors, but before we can do anything with them, we need a precise notation system. Notation is not just cosmetic-it tells us how to read, write, and think about vectors clearly and unambiguously. In this section, we'll explore how vectors are written, how their components are represented, and how we can interpret them visually as arrows.

#### Writing Vectors

Vectors are usually denoted by lowercase letters in bold (like $\mathbf{v}, \mathbf{w}, \mathbf{x}$)  
or with an arrow overhead (like $\vec{v}$).  

For instance, the vector $\mathbf{v} = (2, 5)$ is the same as $\vec{v} = (2, 5)$.  

The style depends on context: mathematicians often use bold, physicists often use arrows.  
In handwritten notes, people sometimes underline vectors (e.g., $\underline{v}$) to avoid confusion with scalars.  

The important thing is to distinguish vectors from scalars at a glance.


#### Components of a Vector

A vector in two dimensions has two components, written as $(x, y)$.  
In three dimensions, it has three components: $(x, y, z)$.  
More generally, an $n$-dimensional vector has $n$ components: $(v_1, v_2, \ldots, v_n)$.  
Each component tells us how far the vector extends along one axis of the coordinate system.

For example:

- $\mathbf{v} = (3, 4)$ means the vector extends 3 units along the $x$-axis and 4 units along the $y$-axis.
- $\mathbf{w} = (-2, 0, 5)$ means the vector extends $-2$ units along the $x$-axis, $0$ along the $y$-axis, and 5 along the $z$-axis.

We often refer to the $i$-th component of a vector $\mathbf{v}$ as $v_i$.  
So, for $\mathbf{v} = (3, 4, 5)$, we have $v_1 = 3$, $v_2 = 4$, $v_3 = 5$.

#### Column vs. Row Vectors

Vectors can be written in two common ways:

- As a row vector: $(v_1, v_2, v_3)$  
- As a column vector:  

  $$
  \begin{bmatrix}
  v_1 \\
  v_2 \\
  v_3
  \end{bmatrix}
  $$

Both represent the same abstract object.  
Row vectors are convenient for quick writing, while column vectors are essential when we start multiplying by matrices, because the dimensions must align.


#### Vectors as Arrows

The most intuitive way to picture a vector is as an arrow:

- It starts at the origin (0, 0, …).
- It ends at the point given by its components.

For example, the vector (2, 3) in 2D is drawn as an arrow from (0, 0) to (2, 3). The arrow has both direction (where it points) and magnitude (its length). This geometric picture makes abstract algebraic manipulations much easier to grasp.

#### Position Vectors vs. Free Vectors

There are two common interpretations of vectors:

1. Position vector - a vector that points from the origin to a specific point in space. Example: (2, 3) is the position vector for the point (2, 3).
2. Free vector - an arrow with length and direction, but not tied to a specific starting point. For instance, an arrow of length 5 pointing northeast can be drawn anywhere, but it still represents the same vector.

In linear algebra, we often treat vectors as free vectors, because their meaning does not depend on where they are drawn.

#### Example: Reading a Vector

Suppose u = (–3, 2).

- The first component (–3) means move 3 units left along the x-axis.
- The second component (2) means move 2 units up along the y-axis.
  So the arrow points to the point (–3, 2). Even without a diagram, the components tell us exactly what the arrow would look like.

#### Why It Matters

Clear notation is the backbone of linear algebra. Without it, equations quickly become unreadable, and intuition about direction and size is lost. The way we write vectors determines how easily we can connect the algebra (numbers and symbols) to the geometry (arrows and spaces). This dual perspective-symbolic and visual-is what makes linear algebra powerful and practical.

#### Try It Yourself

1. Write down the vector (4, –1). Draw it on graph paper.
2. Rewrite the same vector as a column vector.
3. Translate the vector (4, –1) by moving its starting point to (2, 3) instead of the origin. Notice that the arrow looks the same-it just starts elsewhere.
4. For a harder challenge: draw the 3D vector (2, –1, 3). Even if you can't draw perfectly in 3D, try to show each component along the x, y, and z axes.

By practicing both the notation and the arrow picture, you'll develop fluency in switching between abstract symbols and concrete visualizations. This skill will make every later concept in linear algebra far more intuitive.

