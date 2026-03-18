### 37. Rank–Nullity Theorem

The rank–nullity theorem is one of the central results of linear algebra. It gives a precise balance between two fundamental aspects of a matrix: the dimension of its column space (rank) and the dimension of its null space (nullity). It shows that no matter how complicated a matrix looks, the distribution of information between its "visible" outputs and its "hidden" null directions always obeys a strict law.

#### Statement of the Theorem

Let $A$ be an $m \times n$ matrix (mapping $\mathbb{R}^n \to \mathbb{R}^m$):

$$
\text{rank}(A) + \text{nullity}(A) = n
$$

where:

- rank(A) = dimension of the column space of $A$.
- nullity(A) = dimension of the null space of $A$.
- $n$ = number of columns of $A$, i.e., the number of variables.

#### Intuition

Think of a matrix as a machine that transforms input vectors into outputs:

- Rank measures how many independent output directions survive.
- Nullity measures how many input directions get "lost" (mapped to zero).
- The theorem says: total inputs = useful directions (rank) + wasted directions (nullity).

This ensures nothing disappears mysteriously-every input direction is accounted for.

#### Example 1: Full Rank

$$
A = \begin{bmatrix}  
1 & 0 \\  
0 & 1 \\  
\end{bmatrix}.
$$

- Rank = 2 (two independent columns).
- Null space = $\{0\}$, so nullity = 0.
- Rank + nullity = 2 = number of variables.

#### Example 2: Dependent Columns

$$
A = \begin{bmatrix}  
1 & 2 \\  
2 & 4 \\  
3 & 6 \\  
\end{bmatrix}.
$$

- Second column is a multiple of the first. Rank = 1.
- Null space contains all vectors $(x,y)$ with $y = -2x$. Nullity = 1.
- Rank + nullity = 1 + 1 = 2 = number of variables.

#### Example 3: Larger System

$$
A = \begin{bmatrix}  
1 & 0 & 1 \\  
0 & 1 & 1  
\end{bmatrix}.
$$

- Columns: $(1,0), (0,1), (1,1)$.
- Only two independent columns → Rank = 2.
- Null space: solve $x + z = 0, y + z = 0 \Rightarrow (x,y,z) = (-t,-t,t)$. Nullity = 1.
- Rank + nullity = 2 + 1 = 3 = number of variables.

#### Proof Sketch (Conceptual)

1. Row reduce $A$ to echelon form.
2. Pivots correspond to independent columns → count = rank.
3. Free variables correspond to null space directions → count = nullity.
4. Each column is either a pivot column or corresponds to a free variable, so:

   $$
   \text{rank} + \text{nullity} = \text{number of columns}.
   $$

#### Geometric Meaning

- In $\mathbb{R}^3$, if a transformation collapses all vectors onto a plane (rank = 2), then one direction disappears entirely (nullity = 1).
- In $\mathbb{R}^4$, if a matrix has rank 2, then its null space has dimension 2, meaning half the input directions vanish.

The theorem guarantees the geometry of "surviving" and "vanishing" directions always adds up consistently.

#### Applications

1. Solving systems $Ax = b$:

   - Rank determines consistency and structure of solutions.
   - Nullity tells how many free parameters exist in the solution.

2. Data compression: Rank identifies independent features; nullity shows redundancy.

3. Computer graphics: Rank–nullity explains how 3D coordinates collapse into 2D images: one dimension of depth is lost.

4. Machine learning: Rank signals how much real information a dataset contains; nullity indicates degrees of freedom that add nothing new.

#### Everyday Analogies

- Work team: Rank = number of independent workers contributing new ideas. Nullity = number of workers repeating what others already said. Total team members = contributors + redundant voices.
- Travel: Rank = number of useful directions on a map; nullity = directions that lead nowhere.
- Languages: Rank = unique words, nullity = synonyms. Total vocabulary size is always the sum.

#### Why It Matters

1. The rank–nullity theorem connects the abstract ideas of rank and nullity into a single, elegant formula.
2. It ensures conservation of dimension: no information magically appears or disappears.
3. It is essential in understanding solutions of systems, dimensions of subspaces, and the structure of linear transformations.
4. It prepares the ground for deeper results in algebra, topology, and differential equations.

#### Try It Yourself

1. Verify rank–nullity for

   $$
   A = \begin{bmatrix}  
   1 & 2 & 3 \\  
   4 & 5 & 6  
   \end{bmatrix}.
   $$

2. For a $4 \times 5$ matrix of rank 3, what is its nullity?

3. In $\mathbb{R}^3$, suppose a matrix maps all of space onto a line. What are its rank and nullity?

4. Challenge: Prove rigorously that the row space and null space are orthogonal complements, and use this to derive rank–nullity again.

The rank–nullity theorem is the law of balance in linear algebra: every input dimension is accounted for, either as a surviving direction (rank) or as one that vanishes (nullity).

