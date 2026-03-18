### 16. 单位矩阵、逆矩阵与转置

在掌握了矩阵加法、数乘和矩阵乘法之后，我们现在引入三个特殊的运算和对象，它们构成了矩阵代数的 backbone（骨干）：**单位矩阵**、**矩阵的逆**以及**矩阵的转置**。每一个概念都捕捉到了一个基本原理——中性性（neutrality）、可逆性（reversibility）和对称性（symmetry）。它们共同提供了代数结构，使得线性代数如此强大。

#### 单位矩阵 (The Identity Matrix)

单位矩阵在矩阵乘法中的作用，相当于数字 1 在普通乘法中的作用。

- **定义**：单位矩阵 $I_n$ 是一个 $n \times n$ 的矩阵，其主对角线上的元素为 1，其余位置的元素均为 0。

示例 (3×3)：

$$
I_3 = \begin{bmatrix} 
1 & 0 & 0 \\ 
0 & 1 & 0 \\ 
0 & 0 & 1 
\end{bmatrix}.
$$

- **性质**：对于任意 $n \times n$ 矩阵 $A$，

  $$
  AI_n = I_nA = A.
  $$

- **机器视角**：$I$ 什么都不做——它将每个向量映射为其自身。

> **注意**：单位矩阵必须是方阵（行数等于列数）。在不同维度的空间中，单位矩阵的大小不同（例如 $I_2$ 是 $2 \times 2$，$I_3$ 是 $3 \times 3$）。

**Python 示例：创建单位矩阵**

```python
import numpy as np

# 创建 3x3 单位矩阵
I = np.eye(3)
print("单位矩阵 I_3:\n", I)

# 验证 AI = A
A = np.array([[1, 2, 3], 
              [4, 5, 6], 
              [7, 8, 9]])
print("验证 AI = A:\n", np.allclose(A @ I, A))
```

#### 矩阵的逆 (The Inverse of a Matrix)

逆矩阵相当于数字的倒数。

- **定义**：对于方阵 $A$，其逆矩阵 $A^{-1}$ 是满足以下条件的矩阵：

  $$
  AA^{-1} = A^{-1}A = I.
  $$

- **并非所有矩阵都有逆**。当且仅当矩阵是方阵且其行列式（determinant）不为零时，矩阵才是可逆的。

示例：

$$
A = \begin{bmatrix} 
2 & 1 \\ 
1 & 1 
\end{bmatrix}, 
\quad 
A^{-1} = \begin{bmatrix} 
1 & -1 \\ 
-1 & 2 
\end{bmatrix}.
$$

验证：

$$
AA^{-1} = \begin{bmatrix} 
2 & 1 \\ 
1 & 1 
\end{bmatrix}
\begin{bmatrix} 
1 & -1 \\ 
-1 & 2 
\end{bmatrix}
=
\begin{bmatrix} 
1 & 0 \\ 
0 & 1 
\end{bmatrix} = I.
$$

- **机器视角**：应用 $A$ 会变换一个向量。应用 $A^{-1}$ 则会撤销该变换，恢复原始输入。

> **提示**：在计算中，我们通常不直接计算逆矩阵来解方程，因为数值上可能不稳定。但在理论推导中，$A^{-1}$ 的概念至关重要。

**Python 示例：计算逆矩阵**

```python
# 定义矩阵 A
A = np.array([[2, 1], 
              [1, 1]])

# 计算逆矩阵
A_inv = np.linalg.inv(A)
print("A 的逆矩阵:\n", A_inv)

# 验证 A * A_inv = I
I_check = A @ A_inv
print("验证 A * A_inv:\n", I_check)
```

#### 不可逆矩阵 (Non-Invertible Matrices)

有些矩阵无法求逆。这些矩阵被称为**奇异矩阵 (singular)**。

- **示例**：

  $$
  B = \begin{bmatrix} 
  2 & 4 \\ 
  1 & 2 
  \end{bmatrix}.
  $$

  在这里，第二列是第一列的倍数。这种变换将向量“压扁”到一条直线上，丢失了信息——因此无法逆转。

这将可逆性与几何联系了起来：** collapse 维度的变换是无法撤销的。**

> **注意**：如果矩阵的行列式为 0，则它是奇异的，不可逆。这通常意味着矩阵的列向量线性相关。

#### 矩阵的转置 (The Transpose of a Matrix)

转置是将矩阵沿其主对角线进行翻转。

- **定义**：对于 $A = [a_{ij}]$，

  $$
  A^T = [a_{ji}].
  $$

- **通俗来说**：行变成列，列变成行。

示例：

$$
A = \begin{bmatrix} 
1 & 2 & 3 \\ 
4 & 5 & 6 
\end{bmatrix}, 
\quad 
A^T = \begin{bmatrix} 
1 & 4 \\ 
2 & 5 \\ 
3 & 6 
\end{bmatrix}.
$$

- **性质**：

  - $(A^T)^T = A$.
  - $(A + B)^T = A^T + B^T$.
  - $(cA)^T = cA^T$.
  - $(AB)^T = B^T A^T$ (**注意顺序反转！**).

> **关键提示**：矩阵乘积的转置等于转置的反序乘积。这是一个常见的易错点，务必记住 $(AB)^T \neq A^T B^T$。

**Python 示例：矩阵转置**

```python
A = np.array([[1, 2, 3], 
              [4, 5, 6]])

# 计算转置
A_T = A.T
print("A 的转置:\n", A_T)

# 验证 (AB)^T = B^T A^T
B = np.array([[1, 0], 
              [0, 1], 
              [1, 1]])
lhs = (A @ B).T
rhs = B.T @ A.T
print("验证 (AB)^T = B^T A^T:", np.allclose(lhs, rhs))
```

#### 对称矩阵与正交矩阵 (Symmetric and Orthogonal Matrices)

从转置操作中衍生出两类重要的矩阵：

- **对称矩阵 (Symmetric matrices)**：$A = A^T$。示例：

  $$
  \begin{bmatrix} 
  2 & 3 \\ 
  3 & 5 
  \end{bmatrix}.
  $$

  它们具有优美的性质：实特征值和正交特征向量。

- **正交矩阵 (Orthogonal matrices)**：$Q^TQ = I$。它们的列构成标准正交基，代表纯粹的旋转或反射。

#### 日常类比 (Everyday Analogies)

- **单位矩阵**：一面不会扭曲你影像的镜子——它让一切保持不变。
- **逆矩阵**：一个“反向食谱”——如果一步是混合，逆步骤就是分离（在可能的情况下）。
- **转置**：通过翻转行和列来重新组织电子表格。

#### 为什么这很重要 (Why It Matters)

1. 单位矩阵保证了乘法的中性元素。
2. 逆矩阵提供了一种通过 $\mathbf{x} = A^{-1}\mathbf{b}$ 求解方程 $A\mathbf{x} = \mathbf{b}$ 的方法。
3. 转置将矩阵与几何、内积和对称性联系起来。
4. 它们共同为更深层次的主题奠定了代数基础：行列式、特征值、分解和数值方法。

如果没有这些工具，矩阵代数将缺乏结构和可逆性。

#### 动手试一试 (Try It Yourself)

1. 计算以下矩阵的转置：

$$
\begin{bmatrix} 
1 & 0 & 2 \\ 
-3 & 4 & 5 
\end{bmatrix}.
$$

2. 验证 $(AB)^T = B^TA^T$，其中：

$$
A = \begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}, \quad 
B = \begin{bmatrix} 4 & 0 \\ 5 & 6 \end{bmatrix}.
$$

3. 求以下矩阵的逆：

$$
\begin{bmatrix} 
3 & 2 \\ 
1 & 1 
\end{bmatrix}.
$$

4. **挑战**：证明如果 $Q$ 是正交矩阵，则 $Q^{-1} = Q^T$。从几何上解释这意味着“旋转可以通过转置来撤销”。

#### 练习题解答与解析

以下是上述练习题的详细解答过程及 Python 验证代码。

**1. 计算转置**

**解答过程**：
转置操作将原矩阵的行变为列。
原矩阵第一行 $[1, 0, 2]$ 变为新矩阵的第一列。
原矩阵第二行 $[-3, 4, 5]$ 变为新矩阵的第二列。

$$
\begin{bmatrix} 
1 & 0 & 2 \\ 
-3 & 4 & 5 
\end{bmatrix}^T
=
\begin{bmatrix} 
1 & -3 \\ 
0 & 4 \\ 
2 & 5 
\end{bmatrix}.
$$

**Python 验证**：
```python
M1 = np.array([[1, 0, 2], 
               [-3, 4, 5]])
print("习题 1 结果:\n", M1.T)
```

---

**2. 验证 $(AB)^T = B^TA^T$**

**解答过程**：
首先计算 $AB$：
$$
AB = \begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix} \begin{bmatrix} 4 & 0 \\ 5 & 6 \end{bmatrix} 
= \begin{bmatrix} 1\cdot4 + 2\cdot5 & 1\cdot0 + 2\cdot6 \\ 0\cdot4 + 3\cdot5 & 0\cdot0 + 3\cdot6 \end{bmatrix} 
= \begin{bmatrix} 14 & 12 \\ 15 & 18 \end{bmatrix}.
$$
然后计算 $(AB)^T$：
$$
(AB)^T = \begin{bmatrix} 14 & 15 \\ 12 & 18 \end{bmatrix}.
$$

接下来计算 $B^T$ 和 $A^T$：
$$
A^T = \begin{bmatrix} 1 & 0 \\ 2 & 3 \end{bmatrix}, \quad 
B^T = \begin{bmatrix} 4 & 5 \\ 0 & 6 \end{bmatrix}.
$$
计算 $B^T A^T$：
$$
B^T A^T = \begin{bmatrix} 4 & 5 \\ 0 & 6 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 2 & 3 \end{bmatrix} 
= \begin{bmatrix} 4\cdot1 + 5\cdot2 & 4\cdot0 + 5\cdot3 \\ 0\cdot1 + 6\cdot2 & 0\cdot0 + 6\cdot3 \end{bmatrix} 
= \begin{bmatrix} 14 & 15 \\ 12 & 18 \end{bmatrix}.
$$
两者相等，验证成立。

**Python 验证**：
```python
A = np.array([[1, 2], [0, 3]])
B = np.array([[4, 0], [5, 6]])

lhs = (A @ B).T
rhs = B.T @ A.T

print("习题 2 验证 (AB)^T:", lhs)
print("习题 2 验证 B^T A^T:", rhs)
print("是否相等:", np.allclose(lhs, rhs))
```

---

**3. 求逆矩阵**

**解答过程**：
对于 $2 \times 2$ 矩阵 $M = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$，其逆矩阵公式为：
$$
M^{-1} = \frac{1}{ad-bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}.
$$
这里 $a=3, b=2, c=1, d=1$。
行列式 $\det(M) = ad - bc = 3(1) - 2(1) = 1$。
因为行列式不为 0，逆矩阵存在。

$$
\begin{bmatrix} 
3 & 2 \\ 
1 & 1 
\end{bmatrix}^{-1} 
= \frac{1}{1} \begin{bmatrix} 1 & -2 \\ -1 & 3 \end{bmatrix} 
= \begin{bmatrix} 1 & -2 \\ -1 & 3 \end{bmatrix}.
$$

**Python 验证**：
```python
M3 = np.array([[3, 2], [1, 1]])
M3_inv = np.linalg.inv(M3)
print("习题 3 结果:\n", M3_inv)
```

---

**4. 挑战：正交矩阵的逆**

**解答过程**：
**证明**：
根据正交矩阵的定义，$Q$ 是正交矩阵意味着其列向量是标准正交的，数学表达为：
$$
Q^T Q = I.
$$
根据逆矩阵的定义，如果存在矩阵 $B$ 使得 $BQ = I$ 且 $QB = I$，则 $B = Q^{-1}$。
由 $Q^T Q = I$ 可知，$Q^T$ 左乘 $Q$ 得到单位矩阵。
对于方阵，若 $XY=I$，则 $YX=I$ 也成立（这是线性代数中的一个重要定理）。
因此，$Q Q^T = I$ 也成立。
既然 $Q^T Q = I$ 且 $Q Q^T = I$，根据逆矩阵的唯一性，我们可以得出：
$$
Q^{-1} = Q^T.
$$
证毕。

**几何解释**：
正交矩阵通常代表旋转或反射变换。
- 旋转一个角度 $\theta$ 的逆操作是旋转 $-\theta$。
- 转置操作在正交矩阵中恰好对应于这种“反向”操作。
- 这意味着，如果你用正交矩阵 $Q$ 旋转了一个向量，想要恢复原状，不需要复杂地计算逆矩阵，只需要简单地转置该矩阵（即应用 $Q^T$）即可。这在计算机图形学和数值计算中极大地提高了效率。

**Python 验证**：
```python
# 创建一个旋转矩阵 (例如旋转 90 度)
theta = np.pi / 2
Q = np.array([[np.cos(theta), -np.sin(theta)], 
              [np.sin(theta), np.cos(theta)]])

# 计算逆矩阵
Q_inv = np.linalg.inv(Q)
# 计算转置
Q_T = Q.T

print("习题 4 验证 Q^-1:\n", Q_inv)
print("习题 4 验证 Q^T:\n", Q_T)
print("是否相等:", np.allclose(Q_inv, Q_T))
```