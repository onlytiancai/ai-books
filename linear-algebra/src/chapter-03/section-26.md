### 26. Detecting Inconsistency

Not every system of linear equations has a solution. Some are inconsistent, meaning the equations contradict one another and no vector $\mathbf{x}$ can satisfy them all at once. Detecting such inconsistency early is crucial: it saves wasted effort trying to solve an impossible system and reveals important geometric and algebraic properties.

#### What Inconsistency Looks Like Algebraically

Consider the system:

$$
\begin{cases}  
x + y = 1 \\  
x + y = 3  
\end{cases}
$$

Clearly, the two equations cannot both be true. In augmented matrix form:

$$
\begin{bmatrix}  
1 & 1 & | & 1 \\  
1 & 1 & | & 3  
\end{bmatrix}.
$$

Row reduction gives:

$$
\begin{bmatrix}  
1 & 1 & | & 1 \\  
0 & 0 & | & 2  
\end{bmatrix}.
$$

The bottom row says $0 = 2$, a contradiction. This is the hallmark of inconsistency: a row of zeros in the coefficient part, with a nonzero constant in the augmented part.

#### General Rule for Detection

A system $A\mathbf{x} = \mathbf{b}$ is inconsistent if, after row reduction, the augmented matrix contains a row of the form:

$$
[0 \;\; 0 \;\; \dots \;\; 0 \;|\; c], \quad c \neq 0.
$$

This indicates that all variables vanish from the equation, leaving an impossible statement like $0 = c$.

#### Example 1: Parallel Lines in 2D

$$
\begin{cases}  
x + y = 2 \\  
2x + 2y = 5  
\end{cases}
$$

Augmented matrix:

$$
\begin{bmatrix}  
1 & 1 & | & 2 \\  
2 & 2 & | & 5  
\end{bmatrix}.
$$

Row reduce:

- $R_2 \to R_2 - 2R_1$:

$$
\begin{bmatrix}  
1 & 1 & | & 2 \\  
0 & 0 & | & 1  
\end{bmatrix}.
$$

Contradiction: no solution. Geometrically, the two equations are parallel lines that never intersect.

#### Example 2: Contradictory Planes in 3D

$$
\begin{cases}  
x + y + z = 1 \\  
2x + 2y + 2z = 2 \\  
x + y + z = 3  
\end{cases}
$$

The first and third equations already conflict: the same plane equation is forced to equal two different constants.

Augmented matrix reduces to:

$$
\begin{bmatrix}  
1 & 1 & 1 & | & 1 \\  
0 & 0 & 0 & | & 0 \\  
0 & 0 & 0 & | & 2  
\end{bmatrix}.
$$

Contradiction: no solution. The "planes" fail to intersect in common.

#### Geometry of Inconsistency

- In 2D: Inconsistent systems correspond to parallel lines with different intercepts.
- In 3D: They correspond to planes that are parallel but offset, or planes arranged in a way that leaves a "gap" (no shared intersection).
- In higher dimensions: Inconsistency means the target vector $\mathbf{b}$ lies outside the column space of $A$.

#### Rank Test for Consistency

Another way to detect inconsistency is using ranks.

- Let $\text{rank}(A)$ be the number of pivots in the coefficient matrix.
- Let $\text{rank}([A|\mathbf{b}])$ be the number of pivots in the augmented matrix.

Rule:

- If $\text{rank}(A) = \text{rank}([A|\mathbf{b}])$, the system is consistent.
- If $\text{rank}(A) < \text{rank}([A|\mathbf{b}])$, the system is inconsistent.

This rank condition is fundamental and works in any dimension.

#### Everyday Analogies

- Meeting schedules: If one friend says "meet at 2pm" and another says "meet at 2pm and 3pm simultaneously," the instructions contradict-no meeting possible.
- Construction blueprints: If two architects specify identical walls but with different lengths, the building plan is impossible.
- Cooking instructions: If one step requires "boil pasta until firm" and another says "the same pasta must already be raw," the recipe cannot be carried out.

#### Why It Matters

1. Inconsistency reveals overdetermined or contradictory data in real problems (physics, engineering, statistics).
2. The ability to detect inconsistency quickly through row reduction or rank saves computation.
3. It connects geometry (non-intersecting spaces) with algebra (contradictory rows).
4. It prepares the way for least-squares methods, where inconsistent systems are approximated instead of solved exactly.

#### Try It Yourself

1. Reduce the augmented matrix

$$
\begin{bmatrix}  
1 & -1 & | & 2 \\  
2 & -2 & | & 5  
\end{bmatrix}
$$

and decide if the system is consistent.

2. Show geometrically why the system

$$
x + y = 0, \quad x + y = 1
$$

is inconsistent.

3. Use the rank test to check consistency of

$$
\begin{cases}  
x + y + z = 2 \\  
2x + 2y + 2z = 4 \\  
3x + 3y + 3z = 5  
\end{cases}
$$

4. Challenge: Explain why $\text{rank}(A) < \text{rank}([A|\mathbf{b}])$ implies inconsistency, using the concept of the column space.

Detecting inconsistency is not just about spotting contradictions-it connects algebra, geometry, and linear transformations, showing exactly when a system cannot possibly fit together.

