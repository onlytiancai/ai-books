### 23. Row-Echelon and Reduced Row-Echelon Forms

After introducing row operations, the natural question is: *what are we trying to achieve by performing them?* The answer is to transform a matrix into a standardized, simplified form where the solutions to the corresponding system of equations can be read off directly. Two such standardized forms are central in linear algebra: row-echelon form (REF) and reduced row-echelon form (RREF).

#### Row-Echelon Form (REF)

A matrix is in row-echelon form if:

1. All nonzero rows are above any rows of all zeros.
2. In each nonzero row, the first nonzero entry (called the leading entry or pivot) is to the right of the leading entry of the row above it.
3. All entries below a pivot are zero.

Example of REF:

$$
\begin{bmatrix}  
1 & 2 & 3 & | & 4 \\  
0 & 1 & -1 & | & 2 \\  
0 & 0 & 5 & | & -3 \\  
0 & 0 & 0 & | & 0  
\end{bmatrix}.
$$

Here, the pivots are the first 1 in row 1, the 1 in row 2, and the 5 in row 3. Each pivot is to the right of the one above it, and all entries below pivots are zero.

#### Reduced Row-Echelon Form (RREF)

A matrix is in reduced row-echelon form if, in addition to the rules of REF:

1. Each pivot is equal to 1.
2. Each pivot is the only nonzero entry in its column (everything above and below pivots is zero).

Example of RREF:

$$
\begin{bmatrix}  
1 & 0 & 0 & | & 3 \\  
0 & 1 & 0 & | & -2 \\  
0 & 0 & 1 & | & 1  
\end{bmatrix}.
$$

This form is so simplified that solutions can be read directly: here, $x=3$, $y=-2$, $z=1$.

#### Relationship Between REF and RREF

- REF is easier to reach-it only requires eliminating entries below pivots.
- RREF requires going further-clearing entries above pivots and scaling pivots to 1.
- Every matrix can be reduced to REF (many possible versions), but RREF is unique: no matter how you proceed, if you carry out all row operations fully, you end with the same RREF.

#### Example: Step-by-Step to RREF

System:

$$
\begin{cases}  
x + 2y + z = 4 \\  
2x + 5y + z = 7 \\  
3x + 6y + 2z = 10  
\end{cases}
$$

Augmented matrix:

$$
\begin{bmatrix}  
1 & 2 & 1 & | & 4 \\  
2 & 5 & 1 & | & 7 \\  
3 & 6 & 2 & | & 10  
\end{bmatrix}.
$$

1. Eliminate below first pivot (the 1 in row 1, col 1):

   - $R_2 \to R_2 - 2R_1$
   - $R_3 \to R_3 - 3R_1$

   $$
   \begin{bmatrix}  
   1 & 2 & 1 & | & 4 \\  
   0 & 1 & -1 & | & -1 \\  
   0 & 0 & -1 & | & -2  
   \end{bmatrix}.
   $$

   This is now in REF.

2. Scale pivots and eliminate above them:

   - $R_3 \to -R_3$ to make pivot 1.
   - $R_2 \to R_2 + R_3$.
   - $R_1 \to R_1 - R_2 - R_3$.

   Final:

   $$
   \begin{bmatrix}  
   1 & 0 & 0 & | & 2 \\  
   0 & 1 & 0 & | & 1 \\  
   0 & 0 & 1 & | & 2  
   \end{bmatrix}.
   $$

Solution: $x=2, y=1, z=2$.

#### Geometry of REF and RREF

- REF corresponds to simplifying the system step by step, making it "triangular" so variables can be solved one after another.
- RREF corresponds to a system that is fully disentangled-each variable isolated, with its value or free-variable relationship explicitly visible.

#### Everyday Analogies

- Filing papers: REF is like stacking documents in neat piles, but still grouped. RREF is like sorting every document individually into labeled folders.
- Solving a puzzle: REF gives you partial progress (pieces are grouped), while RREF finishes the puzzle so each piece is in its exact place.
- Cooking: REF is like preparing ingredients into rough categories (vegetables chopped, meat trimmed). RREF is the final stage where every dish is cooked and plated, fully ready.

#### Why It Matters

1. REF is the foundation of Gaussian elimination, the workhorse algorithm for solving systems.
2. RREF gives complete clarity: unique representation of solution sets, revealing free and pivot variables.
3. RREF underlies algorithms in computer algebra systems, symbolic solvers, and educational tools.
4. Understanding these forms builds intuition for rank, null space, and solution structure.

#### Try It Yourself

1. Reduce

   $$
   \begin{bmatrix}  
   2 & 4 & | & 6 \\  
   1 & 3 & | & 5  
   \end{bmatrix}
   $$

   to REF, then RREF.

2. Find the RREF of

   $$
   \begin{bmatrix}  
   1 & 1 & 1 & | & 3 \\  
   2 & 3 & 4 & | & 8 \\  
   1 & 2 & 3 & | & 5  
   \end{bmatrix}.
   $$

3. Explain why two different elimination sequences can lead to different REF but the same RREF.

4. Challenge: Prove that every matrix has a unique RREF by considering the effect of row operations systematically.

Reaching row-echelon and reduced row-echelon forms transforms messy systems into structured ones, turning algebraic clutter into an organized path to solutions.

