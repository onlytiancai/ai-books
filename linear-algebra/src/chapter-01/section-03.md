### 3. Vector Addition and Scalar Multiplication

Once we know how to describe vectors with components and arrows, the next step is to learn how to combine them. Two fundamental operations form the backbone of linear algebra: adding vectors together and scaling vectors with numbers (scalars). These two moves, though simple, generate everything else we'll build later. With them, we can describe motion, forces, data transformations, and more.

#### Vector Addition in Coordinates

Suppose we have two vectors in 2D:  
$\mathbf{u} = (u_1, u_2), \quad \mathbf{v} = (v_1, v_2)$.

Their sum is defined as:  
$$
\mathbf{u} + \mathbf{v} = (u_1 + v_1, \; u_2 + v_2).
$$

In words, you add corresponding components.  
This works in higher dimensions too:  

$$
(u_1, u_2, \ldots, u_n) + (v_1, v_2, \ldots, v_n) = (u_1 + v_1, \; u_2 + v_2, \; \ldots, \; u_n + v_n).
$$

Example:
$$
(2, 3) + (-1, 4) = (2 - 1, \; 3 + 4) = (1, 7).
$$


#### Vector Addition as Geometry

The geometric picture is even more illuminating. If you draw vector u as an arrow, then place the tail of v at the head of u, the arrow from the start of u to the head of v is u + v. This is called the tip-to-tail rule. The parallelogram rule is another visualization: place u and v tail-to-tail, form a parallelogram, and the diagonal is their sum.

Example:
u = (3, 1), v = (2, 2). Draw both from the origin. Their sum (5, 3) is exactly the diagonal of the parallelogram they span.

#### Scalar Multiplication in Coordinates

Scalars stretch or shrink vectors.  
If $\mathbf{u} = (u_1, u_2, \ldots, u_n)$ and $c$ is a scalar, then:  

$$
c \cdot \mathbf{u} = (c \cdot u_1, \; c \cdot u_2, \; \ldots, \; c \cdot u_n).
$$

Example:

$$
2 \cdot (3, 4) = (6, 8).
$$  

$$
(-1) \cdot (3, 4) = (-3, -4).
$$

Multiplying by a positive scalar stretches or compresses the arrow while keeping the direction the same. 
Multiplying by a negative scalar flips the arrow to point the opposite way.

#### Scalar Multiplication as Geometry

Imagine the vector (1, 2). Draw it on graph paper: it goes right 1, up 2. Now double it: (2, 4). The arrow points in the same direction but is twice as long. Halve it: (0.5, 1). It's the same direction but shorter. Negate it: (–1, –2). Now the arrow points backward.

This geometric picture explains why we call these numbers "scalars": they scale the vector.

#### Combining Both: Linear Combinations

Vector addition and scalar multiplication are not just separate tricks-they combine to form the heart of linear algebra: linear combinations.  

A linear combination of vectors $u$ and $v$ is any vector of the form  
$a \cdot u + b \cdot v$, where $a$ and $b$ are scalars.

Example:  
If $u = (1, 0)$ and $v = (0, 1)$, then  
$3 \cdot u + 2 \cdot v = (3, 2)$.

This shows how any point on the grid can be reached by scaling and adding these two basic vectors.  
That’s the essence of constructing spaces.

#### Algebraic Properties

Vector addition and scalar multiplication obey rules that mirror arithmetic with numbers:

- Commutativity: $u + v = v + u$  
- Associativity: $(u + v) + w = u + (v + w)$  
- Distributivity over scalars: $c \cdot (u + v) = c \cdot u + c \cdot v$  
- Distributivity over numbers: $(a + b) \cdot u = a \cdot u + b \cdot u$

These rules are not trivial bookkeeping - they guarantee that linear algebra behaves predictably,  
which is why it works as the language of science.

#### Everyday Analogies

- Walking directions: If you walk 3 steps north and then 4 steps east, that's like adding (0, 3) + (4, 0) = (4, 3).
- Forces in physics: If two people push on a box in different directions, the total force is the vector sum of their pushes.
- Budget planning: Think of income and expenses as vectors of numbers. Combining them is just vector addition.

#### Why It Matters

With only these two operations-addition and scaling-you can already describe lines, planes, and entire spaces. Any system that grows by combining influences, like physics, economics, or machine learning, is built on these simple rules. Later, when we define matrix multiplication, dot products, and eigenvalues, they all reduce to repeated patterns of adding and scaling vectors.

#### Try It Yourself

1. Add (2, 3) and (–1, 4). Draw the result on graph paper.
2. Multiply (1, –2) by 3, and then add (0, 5). What is the final vector?
3. For a deeper challenge: Let u = (1, 2) and v = (2, –1). Sketch all vectors of the form a·u + b·v for integer values of a, b between –2 and 2. Notice the grid of points you create-that's the span of these two vectors.

This simple practice shows you how combining two basic vectors through addition and scaling generates a whole structured space, the first glimpse of linear algebra's real power.

