### 58. Permutations and the Sign of the Determinant

Behind every determinant formula lies a hidden structure: permutations. Determinants can be expressed as a weighted sum over all possible ways of selecting one entry from each row and each column of a matrix. The weight for each selection is determined by the sign of the permutation used. This viewpoint reveals why determinants encode orientation and why their formulas alternate between positive and negative terms.

#### The Permutation Definition

Let $S_n$ denote the set of all permutations of $n$ elements. Each permutation $\sigma \in S_n$ rearranges the numbers $\{1, 2, \ldots, n\}$.

The determinant of an $n \times n$ matrix $A = [a_{ij}]$ is defined as:

$$
\det(A) = \sum_{\sigma \in S_n} \text{sgn}(\sigma) \prod_{i=1}^n a_{i, \sigma(i)}.
$$

- Each product $\prod_{i=1}^n a_{i, \sigma(i)}$ picks one entry from each row and each column, according to $\sigma$.
- The factor $\text{sgn}(\sigma)$ is $+1$ if $\sigma$ is an even permutation (achieved by an even number of swaps), and $-1$ if it is odd.

#### Why Permutations Appear

A determinant requires:

1. Linearity in each row.
2. Alternating property (row swaps flip the sign).
3. Normalization ($\det(I)=1$).

When you expand by multilinearity, all possible combinations of choosing one entry per row and column arise. The alternating rule enforces that terms with repeated columns vanish, leaving only permutations. The sign of each permutation enforces the orientation flip.

#### Example: 2×2 Case

$$
A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}.
$$

There are two permutations in $S_2$:

- Identity $(1,2)$: sign $+1$, contributes $a \cdot d$.
- Swap $(2,1)$: sign $-1$, contributes $-bc$.

So,

$$
\det(A) = ad - bc.
$$

#### Example: 3×3 Case

$$
A = \begin{bmatrix} a & b & c \\ d & e & f \\ g & h & i \end{bmatrix}.
$$

There are $3! = 6$ permutations:

1. $(1,2,3)$: even, $+aei$.
2. $(1,3,2)$: odd, $-afh$.
3. $(2,1,3)$: odd, $-bdi$.
4. $(2,3,1)$: even, $+bfg$.
5. $(3,1,2)$: even, $+cdh$.
6. $(3,2,1)$: odd, $-ceg$.

So,

$$
\det(A) = aei + bfg + cdh - ceg - bdi - afh.
$$

This is exactly the cofactor expansion result, but now explained as a permutation sum.

#### Geometric Meaning of Signs

- Even permutations correspond to consistent orientation of basis vectors.
- Odd permutations correspond to flipped orientation.
- The determinant alternates signs because flipping axes reverses handedness.

#### Counting Growth

- For $n=4$, there are $4! = 24$ terms.
- For $n=5$, $5! = 120$ terms.
- In general, $n!$ terms make this formula impractical for large matrices.
- Still, it gives the deepest definition of determinants, from which all other rules follow.

#### Everyday Analogies

- Seating arrangements: Each way to assign seats corresponds to a permutation; the determinant weights each arrangement with a sign.
- Logistics: Assigning workers to tasks one-to-one has many possibilities; some align consistently, others "flip" the structure.
- DNA sequences: Permutations rearrange bases; the sign tracks whether the sequence orientation is preserved.

#### Applications

1. Abstract algebra: Determinant definition via permutations works over any field.
2. Combinatorics: Determinants encode signed sums over permutations, connecting to permanents.
3. Theoretical proofs: Many determinant properties, like multiplicativity, emerge cleanly from the permutation definition.
4. Leibniz formula: Explicit but impractical formula for computation.
5. Advanced math: Determinants generalize to alternating multilinear forms in linear algebra and differential geometry.

#### Why It Matters

- Provides the most fundamental definition of determinants.
- Explains alternating signs in formulas naturally.
- Bridges algebra, geometry, and combinatorics.
- Shows how orientation emerges from row/column arrangements.

#### Try It Yourself

1. Write out all 6 terms in the 3×3 determinant expansion and verify the sign of each permutation.
2. Compute the determinant of
   $\begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}$
   using the permutation definition.
3. Show that if two columns are equal, all permutation terms cancel, giving $\det(A)=0$.
4. Challenge: Prove that swapping two rows changes the sign of every permutation term, flipping the total determinant.

Determinants may look like algebraic puzzles, but the permutation formula reveals their true nature: a grand sum over all possible ways of matching rows to columns, with signs recording whether orientation is preserved or reversed.

