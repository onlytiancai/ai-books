### 76. 正交投影与最小二乘法

线性代数中最深刻的联系之一，便是**正交投影**与**最小二乘法**之间的纽带。当方程组没有精确解时，最小二乘法能找到“最佳近似”解。这背后的理论完全是几何性的：最佳解其实就是向量在子空间上的投影。

#### 背景设定：超定方程组

考虑方程组 $Ax = b$，其中：

- $A$ 是一个 $m \times n$ 矩阵，且 $m > n$（方程个数多于未知数个数）。
- $b \in \mathbb{R}^m$ 可能不在 $A$ 的列空间内。

这意味着：

- 可能不存在精确解。
- 因此，我们想要找到一个 $x$，使得 $Ax$ 尽可能接近 $b$。

> **注意**：这种方程个数多于未知数的情况称为**超定系统**（Overdetermined System）。在实际数据拟合中非常常见，因为数据点通常多于模型参数。

#### 最小二乘问题

最小二乘解旨在最小化误差的平方范数：

$$
\min_x \|Ax - b\|^2.
$$

在这里：

- $Ax$ 是 $b$ 在 $A$ 的列空间上的投影。
- 误差向量 $b - Ax$ 与列空间正交。

这正是**正交分解定理**在向量 $b$ 上的应用。

#### 正规方程的推导

我们希望残差 $r = b - Ax$ 与 $A$ 的每一列都正交。用矩阵语言描述，即 $r$ 与 $A$ 的列空间正交：

$$
A^T (b - Ax) = 0.
$$

整理该项：

$$
A^T A x = A^T b.
$$

这个方程组被称为**正规方程**（Normal Equations）。它的解 $x$ 即为最小二乘近似解。

> **提示**：为什么左乘 $A^T$？因为 $A^T r = 0$ 意味着残差向量 $r$ 与 $A$ 的所有列向量内积为零，即垂直于列空间。这是投影的核心几何性质。

#### 最小二乘中的投影矩阵

$b$ 在 $\text{Col}(A)$ 上的投影为：

$$
\hat{b} = A(A^T A)^{-1} A^T b,
$$

假设 $A^T A$ 是可逆的。

在这里：

- $P = A(A^T A)^{-1} A^T$ 是投影到 $A$ 列空间上的**投影矩阵**。
- 拟合向量为 $\hat{b} = Pb$。
- 残差 $r = b - \hat{b}$ 位于 $\text{Col}(A)$ 的正交补中。

> **注意**：$A^T A$ 可逆的充要条件是 $A$ 的列向量线性无关（即 $A$ 满列秩）。如果 $A$ 列相关，则需要使用广义逆。

#### 示例

假设 $A = \begin{bmatrix}1 \\ 2 \\ 3\end{bmatrix}$，$b = \begin{bmatrix}2 \\ 2 \\ 4\end{bmatrix}$。

- $A$ 的列空间：向量 $(1,2,3)$ 的张成空间。
- 投影公式（此时退化为向量投影）：

  $$
  \hat{b} = \frac{\langle b, A \rangle}{\langle A, A \rangle} A.
  $$
- 计算：$\langle b,A\rangle = 2\cdot1+2\cdot2+4\cdot3 = 18$。
  $\langle A,A\rangle = 1^2+2^2+3^2=14$。
- 投影：

  $$
  \hat{b} = \frac{18}{14}(1,2,3) = \left(\tfrac{9}{7}, \tfrac{18}{7}, \tfrac{27}{7}\right).
  $$
- 残差：

  $$
  r = b - \hat{b} = \left(\tfrac{5}{7}, -\tfrac{4}{7}, \tfrac{1}{7}\right).
  $$

检验：$\langle r,A\rangle = 0$，说明它们确实正交。

#### 几何意义

- 最小二乘解是 $\text{Col}(A)$ 中距离 $b$ 最近的点。
- 误差向量垂直于该子空间。
- 这就像从 $b$ 向子空间 $\text{Col}(A)$ 做垂线。

#### 生活类比

- **数据拟合**：拟合一条直线穿过数据点。直线不会经过每一个点，但它最小化了垂直距离的平方和。
- **谈判妥协**：你无法满足所有要求，但你可以达成一个“最接近”的妥协方案。
- **预算削减**：你无法完全匹配每一项支出，但你可以最小化总体偏差。
- **图像压缩**：你无法存储所有细节，但你可以保留最接近的低维版本。

#### 应用领域

1. **统计学**：线性回归使用最小二乘法将模型拟合到数据。
2. **工程学**：曲线拟合、系统辨识和校准。
3. **计算机图形学**：最佳拟合变换（例如 Procrustes 分析）。
4. **机器学习**：线性模型的优化（在使用非线性方法之前）。
5. **数值方法**：求解不一致的方程组。

#### 为什么它很重要

- 正交投影解释了为什么最小二乘法能给出最佳近似。
- 它们揭示了回归背后的几何结构：数据被投影到了模型空间上。
- 它们将线性代数与统计学、优化论及应用科学联系在了一起。

#### 动手练习 (Try It Yourself)

1. 求解 $\min_x \|Ax-b\|$，其中 $A = \begin{bmatrix}1 & 1 \\ 1 & 2 \\ 1 & 3\end{bmatrix}$，$b=(1,2,2)^T$。解释结果。
2. 推导该系统的投影矩阵 $P$。
3. 证明残差与 $A$ 的每一列正交。
4. **挑战**：证明在所有可能的近似 $Ax$ 中，当且仅当 $A^T A$ 可逆时，最小二乘解是唯一的。

---

#### 练习题详细解答与代码演示

下面我们将逐一解答上述练习题，并使用 Python (`numpy`) 进行数值验证。

##### 1. 求解最小二乘解

**解答过程：**

我们需要解正规方程 $A^T A x = A^T b$。

首先计算 $A^T A$：
$$
A^T A = \begin{bmatrix} 1 & 1 & 1 \\ 1 & 2 & 3 \end{bmatrix} \begin{bmatrix}1 & 1 \\ 1 & 2 \\ 1 & 3\end{bmatrix} = \begin{bmatrix} 3 & 6 \\ 6 & 14 \end{bmatrix}.
$$

接着计算 $A^T b$：
$$
A^T b = \begin{bmatrix} 1 & 1 & 1 \\ 1 & 2 & 3 \end{bmatrix} \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix} = \begin{bmatrix} 1+2+2 \\ 1+4+6 \end{bmatrix} = \begin{bmatrix} 5 \\ 11 \end{bmatrix}.
$$

现在解方程组 $\begin{bmatrix} 3 & 6 \\ 6 & 14 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = \begin{bmatrix} 5 \\ 11 \end{bmatrix}$。

计算系数矩阵的行列式：$\det(A^T A) = 3 \times 14 - 6 \times 6 = 42 - 36 = 6$。
求逆矩阵：
$$
(A^T A)^{-1} = \frac{1}{6} \begin{bmatrix} 14 & -6 \\ -6 & 3 \end{bmatrix}.
$$
求解 $x$：
$$
x = (A^T A)^{-1} A^T b = \frac{1}{6} \begin{bmatrix} 14 & -6 \\ -6 & 3 \end{bmatrix} \begin{bmatrix} 5 \\ 11 \end{bmatrix} = \frac{1}{6} \begin{bmatrix} 70 - 66 \\ -30 + 33 \end{bmatrix} = \frac{1}{6} \begin{bmatrix} 4 \\ 3 \end{bmatrix} = \begin{bmatrix} 2/3 \\ 1/2 \end{bmatrix}.
$$

**结果解释**：
最优解为 $x = \begin{bmatrix} 2/3 \\ 1/2 \end{bmatrix}$。这意味着在由 $A$ 的列向量张成的平面中，向量 $Ax$ 是距离 $b$ 最近的点。

##### 2. 推导投影矩阵 $P$

**解答过程：**

公式为 $P = A(A^T A)^{-1} A^T$。我们已知 $(A^T A)^{-1} = \frac{1}{6} \begin{bmatrix} 14 & -6 \\ -6 & 3 \end{bmatrix}$。

$$
\begin{aligned}
P &= \begin{bmatrix}1 & 1 \\ 1 & 2 \\ 1 & 3\end{bmatrix} \left( \frac{1}{6} \begin{bmatrix} 14 & -6 \\ -6 & 3 \end{bmatrix} \right) \begin{bmatrix} 1 & 1 & 1 \\ 1 & 2 & 3 \end{bmatrix} \\
&= \frac{1}{6} \begin{bmatrix}1 & 1 \\ 1 & 2 \\ 1 & 3\end{bmatrix} \begin{bmatrix} 14-6 & 14-12 & 14-18 \\ -6+3 & -6+6 & -6+9 \end{bmatrix} \\
&= \frac{1}{6} \begin{bmatrix}1 & 1 \\ 1 & 2 \\ 1 & 3\end{bmatrix} \begin{bmatrix} 8 & 2 & -4 \\ -3 & 0 & 3 \end{bmatrix} \\
&= \frac{1}{6} \begin{bmatrix} 5 & 2 & -1 \\ 2 & 2 & 2 \\ -1 & 2 & 5 \end{bmatrix}.
\end{aligned}
$$

所以，投影矩阵为：
$$
P = \begin{bmatrix} 5/6 & 1/3 & -1/6 \\ 1/3 & 1/3 & 1/3 \\ -1/6 & 1/3 & 5/6 \end{bmatrix}.
$$

##### 3. 证明残差正交性

**解答过程：**

首先计算拟合向量 $\hat{b} = Ax$：
$$
\hat{b} = \begin{bmatrix}1 & 1 \\ 1 & 2 \\ 1 & 3\end{bmatrix} \begin{bmatrix} 2/3 \\ 1/2 \end{bmatrix} = \begin{bmatrix} 2/3 + 1/2 \\ 2/3 + 1 \\ 2/3 + 3/2 \end{bmatrix} = \begin{bmatrix} 7/6 \\ 5/3 \\ 13/6 \end{bmatrix}.
$$
计算残差 $r = b - \hat{b}$：
$$
r = \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix} - \begin{bmatrix} 7/6 \\ 10/6 \\ 13/6 \end{bmatrix} = \begin{bmatrix} -1/6 \\ 2/6 \\ -1/6 \end{bmatrix} = \frac{1}{6} \begin{bmatrix} -1 \\ 2 \\ -1 \end{bmatrix}.
$$
验证 $A^T r = 0$：
$$
A^T r = \begin{bmatrix} 1 & 1 & 1 \\ 1 & 2 & 3 \end{bmatrix} \frac{1}{6} \begin{bmatrix} -1 \\ 2 \\ -1 \end{bmatrix} = \frac{1}{6} \begin{bmatrix} -1+2-1 \\ -1+4-3 \end{bmatrix} = \frac{1}{6} \begin{bmatrix} 0 \\ 0 \end{bmatrix} = \mathbf{0}.
$$
得证，残差与 $A$ 的每一列正交。

##### 4. 挑战：唯一性证明

**命题**：在所有可能的近似 $Ax$ 中，最小二乘解是唯一的，当且仅当 $A^T A$ 可逆。

**证明过程：**

我们需要证明：最小二乘解唯一 $\Leftrightarrow$ $A^T A$ 可逆。

**（充分性）假设 $A^T A$ 可逆 $\Rightarrow$ 解唯一**

最小二乘解满足正规方程 $A^T A x = A^T b$。

如果 $A^T A$ 可逆，则可以直接写出唯一解：
$$
x = (A^T A)^{-1} A^T b.
$$
由于矩阵的逆（如果存在）是唯一的，因此 $x$ 唯一确定。

**（必要性）假设解唯一 $\Rightarrow$ $A^T A$ 可逆**

我们用逆否命题证明：若 $A^T A$ 不可逆，则解不唯一。

假设 $A^T A$ 不可逆。那么齐次方程 $A^T A x = 0$ 存在非零解（因为不可逆矩阵的零空间非平凡）。

设 $x^*$ 是一个非零向量使得 $A^T A x^* = 0$。

**关键引理**：$A^T A x^* = 0 \Leftrightarrow A x^* = 0$。

*引理证明*：
- 若 $Ax^* = 0$，显然 $A^T A x^* = 0$。
- 若 $A^T A x^* = 0$，则 $x^{*T} A^T A x^* = 0$，即 $(Ax^*)^T (Ax^*) = 0$，也就是 $\|Ax^*\|^2 = 0$，故 $Ax^* = 0$。

因此，存在非零向量 $x^*$ 使得 $A x^* = 0$，即 $A$ 的列向量线性相关（$A$ 不是满列秩）。

现在，设 $x_0$ 是正规方程的一个解：$A^T A x_0 = A^T b$。

对于任意实数 $t$，有：
$$
A^T A (x_0 + t x^*) = A^T A x_0 + t A^T A x^* = A^T b + t \cdot 0 = A^T b.
$$
所以 $x_0 + t x^*$ 也是解。由于 $t$ 可以取任意值，解不唯一。

**综上**，最小二乘解唯一 $\Leftrightarrow$ $A^T A$ 可逆。

> **几何解释**：$A^T A$ 可逆等价于 $A$ 满列秩（列向量线性无关）。此时 $A$ 的列空间是 $\mathbb{R}^m$ 的一个 $n$ 维子空间，$b$ 在这个子空间上的投影是唯一的。如果 $A$ 的列相关，则列空间的维数小于 $n$，存在多个 $x$ 给出相同的投影 $Ax$。

##### Python 代码验证

以下代码使用 `numpy` 验证上述计算结果。

```python
import numpy as np

# 定义矩阵 A 和向量 b
A = np.array([[1, 1], 
              [1, 2], 
              [1, 3]])
b = np.array([1, 2, 2])

# 1. 使用正规方程求解
ATA = A.T @ A
ATb = A.T @ b
x_normal = np.linalg.inv(ATA) @ ATb

# 2. 使用 numpy 内置的最小二乘函数验证
x_lstsq, residuals, rank, s = np.linalg.lstsq(A, b, rcond=None)

# 3. 计算投影矩阵 P
P = A @ np.linalg.inv(ATA) @ A.T

# 4. 计算残差并验证正交性
b_hat = A @ x_normal
r = b - b_hat
orthogonality_check = A.T @ r

print("=== 最小二乘问题数值验证 ===")
print(f"正规方程解 x: \n{x_normal}")
print(f"numpy lstsq 解 x: \n{x_lstsq}")
print(f"投影矩阵 P: \n{P}")
print(f"残差向量 r: \n{r}")
print(f"正交性检验 (A^T * r 应接近 0): \n{orthogonality_check}")

# 验证解是否一致
if np.allclose(x_normal, x_lstsq):
    print("\n[成功] 手动计算与 numpy 库结果一致。")
else:
    print("\n[失败] 结果不一致。")

if np.allclose(orthogonality_check, 0):
    print("[成功] 残差与列空间正交。")
else:
    print("[失败] 正交性检验未通过。")
```

**代码运行预期输出说明：**
- `x_normal` 应接近 `[0.666..., 0.5]`。
- `orthogonality_check` 应接近 `[0., 0.]`（考虑到浮点数误差）。
- 投影矩阵 $P$ 的对角线元素应接近 `[0.833, 0.333, 0.833]`。

正交投影将超定方程组那个混乱、无解的世界，转化为了一个寻求最佳可能近似的世界。最小二乘法不仅仅是一个代数技巧——它是高维空间中“接近性”的几何本质。