### 4. Linear Combinations and Span

After learning to add vectors and scale them, the natural next question is: *what can we build from these two operations?* The answer is the concept of linear combinations, which leads directly to one of the most fundamental ideas in linear algebra: the span of a set of vectors. These ideas tell us not only what individual vectors can do, but how groups of vectors can shape entire spaces.

#### What Is a Linear Combination?

A linear combination is any vector formed by multiplying vectors with scalars and then adding the results together.

Formally, given vectors $v_1, v_2, \ldots, v_k$ and scalars $a_1, a_2, \ldots, a_k$, a linear combination looks like:

$$
a_1 \cdot v_1 + a_2 \cdot v_2 + \cdots + a_k \cdot v_k.
$$

This is nothing more than repeated addition and scaling, but the idea is powerful because it describes how vectors combine to generate new ones.

Example:  
Let $u = (1, 0)$ and $v = (0, 1)$. Then any linear combination $a \cdot u + b \cdot v = (a, b)$.  
This shows that every point in the 2D plane can be expressed as a linear combination of these two simple vectors.

#### Geometric Meaning

Linear combinations are about mixing directions and magnitudes. Each vector acts like a "directional ingredient," and the scalars control how much of each ingredient you use.

- With one vector: You can only reach points on a single line through the origin.
- With two non-parallel vectors in 2D: You can reach every point in the plane.
- With three non-coplanar vectors in 3D: You can reach all of 3D space.

This progression shows that the power of linear combinations depends not just on the vectors themselves but on how they relate to each other.

#### The Span of a Set of Vectors

The span of a set of vectors is the collection of all possible linear combinations of them.  
It answers the question: *"What space do these vectors generate?"*

Notation:

$$
\text{Span}\{v_1, v_2, \ldots, v_k\} =
\{a_1 v_1 + a_2 v_2 + \cdots + a_k v_k \;|\; a_i \in \mathbb{R}\}.
$$

Examples:

- $\text{Span}\{(1, 0)\}$ = all multiples of $(1, 0)$, which is the $x$-axis.  
- $\text{Span}\{(1, 0), (0, 1)\}$ = all of $\mathbb{R}^2$, the entire plane.  
- $\text{Span}\{(1, 2), (2, 4)\}$ = just the line through $(1, 2)$, because the second vector is a multiple of the first.  

So the span depends heavily on whether the vectors add new directions or just duplicate what’s already there.

#### Parallel and Independent Vectors

If vectors point in the same or opposite directions (one is a scalar multiple of another), then their span is just a line. They don't add any new coverage of space. But if they point in different directions, they open up new dimensions. This leads to the critical idea of linear independence, which we'll explore later: vectors are independent if none of them is a linear combination of the others.

#### Visualizing Span in Different Dimensions

- In 2D:

  - One vector spans a line.
  - Two independent vectors span the whole plane.

- In 3D:

  - One vector spans a line.
  - Two independent vectors span a plane.
  - Three independent vectors span all of 3D space.

- In higher dimensions: The same pattern continues. A set of k independent vectors spans a k-dimensional subspace inside the larger space.

#### Everyday Analogies

- Color mixing: Red and blue paints can mix to make purple shades. Add yellow, and you can cover a broader spectrum. Similarly, vectors combine to produce new ones.
- Cooking recipes: Ingredients (vectors) can be scaled up or down and combined in different amounts. The span is the full menu of dishes you can create with those ingredients.
- Directions in navigation: If you can only walk north and south, your span is a line. Add east-west walking, and suddenly you can reach any location in the city grid.

#### Algebraic Properties

- The span of vectors always includes the zero vector, because you can choose all scalars = 0.
- The span is always a subspace, meaning it's closed under addition and scalar multiplication. If you add two vectors in the span, the result stays in the span.
- The span grows when you add new independent vectors, but not if the new vector is just a combination of the old ones.

#### Why It Matters

Linear combinations and span are the foundation for almost everything else in linear algebra:

- They define what it means for vectors to be independent or dependent.
- They form the basis for solving linear systems (solutions are often described as spans).
- They explain how dimensions arise in vector spaces.
- They underpin practical methods like principal component analysis, where data is projected onto the span of a few important vectors.

In short, the span tells us the "reach" of a set of vectors, and linear combinations are the mechanism to explore that reach.

#### Try It Yourself

1. Take vectors (1, 0) and (0, 1). Write down three different linear combinations and plot them. What shape do you notice?
2. Try vectors (1, 2) and (2, 4). Write down three different linear combinations. Plot them. What's different from the previous case?
3. In 3D, consider (1, 0, 0) and (0, 1, 0). Describe their span. Add (0, 0, 1). How does the span change?
4. Challenge: Pick vectors (1, 2, 3) and (4, 5, 6). Do they span a plane or all of 3D space? How can you tell?

By experimenting with simple examples, you'll see clearly how the idea of span captures the richness or limitations of combining vectors.

