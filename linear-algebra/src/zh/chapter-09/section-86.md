### 86. 伪逆（Moore–Penrose）与求解病态系统

在线性代数中，矩阵的逆是一个强大的工具：如果 $A$ 是可逆的，那么求解 $Ax = b$ 就像 $x = A^{-1}b$ 一样简单。但是，当 $A$ 不是方阵，或者不可逆时，会发生什么呢？在实践中，这才是常态：许多问题涉及矩形矩阵（方程数多于未知数，或未知数多于方程数），或者是奇异的方阵。Moore–Penrose 伪逆（通常记为 $A^+$）将逆的概念推广到了所有矩阵，为普通逆失效时寻找解或最佳近似解提供了一种系统的方法。

#### 为什么普通逆会失效

- **非方阵**：如果 $A$ 是 $m \times n$ 且 $m \neq n$，不存在标准逆矩阵。
- **奇异矩阵**：即使 $A$ 是方阵，如果 $\det(A) = 0$，它也没有逆。
- **病态问题**：在现实世界的数据中，可能不存在精确解（矛盾方程组），或者解不唯一（欠定方程组）。

尽管存在这些障碍，我们仍然需要一种系统的方法来求解或近似 $Ax = b$。

#### 伪逆的定义

Moore–Penrose 伪逆 $A^+$ 被定义为满足以下四个性质的唯一矩阵：

1. $AA^+A = A$.
2. $A^+AA^+ = A^+$.
3. $(AA^+)^T = AA^+$.
4. $(A^+A)^T = A^+A$.

这些条件确保 $A^+$ 在最广泛的一致意义上充当“逆”的角色。

> **注意**：对于任何矩阵（无论形状或秩如何），满足这四个条件的矩阵 $A^+$ 存在且唯一。

#### 利用 SVD 构造伪逆

给定 $A$ 的奇异值分解（SVD）：

$$
A = U \Sigma V^T,
$$

其中 $\Sigma$ 是对角矩阵，包含奇异值 $\sigma_1, \dots, \sigma_r$，则伪逆为：

$$
A^+ = V \Sigma^+ U^T,
$$

其中 $\Sigma^+$ 是通过 invert 非零奇异值并转置矩阵形成的。具体来说：

- 如果 $\sigma_i \neq 0$，将其替换为 $1/\sigma_i$。
- 如果 $\sigma_i = 0$，保持为 0。

这个定义适用于所有矩阵，无论是方阵还是矩形矩阵。

> **提示**：这是计算伪逆最数值稳定的方法。在实际编程中，我们通常依赖基于 SVD 的算法。

```python
import numpy as np

# 演示利用 SVD 手动构造伪逆
A = np.array([[1, 1], [1, 1]])  # 一个奇异矩阵
U, s, Vt = np.linalg.svd(A)

# 构造 Sigma^+
# 设置一个阈值来处理数值误差，避免除以极小的数
tol = 1e-10
s_inv = np.array([1/si if si > tol else 0 for si in s])
Sigma_plus = np.zeros((A.shape[1], A.shape[0]))
np.fill_diagonal(Sigma_plus, s_inv)

# 计算 A^+ = V * Sigma^+ * U^T
A_pinv_manual = Vt.T @ Sigma_plus @ U.T

# 与 numpy 内置函数对比
A_pinv_np = np.linalg.pinv(A)

print("手动计算的伪逆:\n", A_pinv_manual)
print("numpy 计算的伪逆:\n", A_pinv_np)
```

#### 利用 $A^+$ 求解线性系统

1. **超定系统**（$m > n$，方程数多于未知数）：

   - 通常不存在精确解。
   - 伪逆给出**最小二乘解**：

     $$
     x = A^+ b,
     $$

     该解最小化 $\|Ax - b\|$。

2. **欠定系统**（$m < n$，未知数多于方程数）：

   - 存在无穷多解。
   - 伪逆选择**范数最小**的解：

     $$
     x = A^+ b,
     $$

     该解在所有解中最小化 $\|x\|$。

3. **方阵但奇异系统**：

   - 某些解存在，但不唯一。
   - 伪逆再次选择最小范数解。

#### 示例 1：超定系统

假设我们要解：

$$
\begin{bmatrix}1 & 1 \\ 1 & -1 \\ 1 & 0\end{bmatrix} x = \begin{bmatrix}2 \\ 0 \\ 1\end{bmatrix}.
$$

这个 $3 \times 2$ 系统没有精确解。使用伪逆，我们可以获得最小二乘解，使其最好地同时拟合所有三个方程。

#### 示例 2：欠定系统

对于

$$
\begin{bmatrix}1 & 0 & 0 \\ 0 & 1 & 0\end{bmatrix} x = \begin{bmatrix}3 \\ 4\end{bmatrix},
$$

系统有无穷多解，因为 $x_3$ 是自由的。伪逆给出：

$$
x = \begin{bmatrix}3 \\ 4 \\ 0\end{bmatrix},
$$

选择了范数最小的解。

```python
# 演示超定和欠定系统的求解
# 示例 1: 超定系统
A_over = np.array([[1, 1], [1, -1], [1, 0]])
b_over = np.array([2, 0, 1])
x_over = np.linalg.pinv(A_over) @ b_over
print("超定系统解:", x_over)
# 验证残差
print("残差范数:", np.linalg.norm(A_over @ x_over - b_over))

# 示例 2: 欠定系统
A_under = np.array([[1, 0, 0], [0, 1, 0]])
b_under = np.array([3, 4])
x_under = np.linalg.pinv(A_under) @ b_under
print("欠定系统解:", x_under)
# 验证范数是否最小 (对比另一个解，例如 x=[3, 4, 5])
x_other = np.array([3, 4, 5])
print("伪逆解范数:", np.linalg.norm(x_under))
print("其他解范数:", np.linalg.norm(x_other))
```

#### 几何解释

- 伪逆的作用类似于投影到子空间。
- 对于超定系统，它将 $b$ 投影到 $A$ 的列空间上，然后找到最近的 $x$。
- 对于欠定系统，它在解空间中选择离原点最近的点。

因此，$A^+$ 体现了在这种情况下“最佳可能逆”的原则。

#### 日常类比

- **GPS 三角定位**：如果多颗卫星给出不一致的测量值，伪逆提供使总误差最小化的位置。
- **试穿衣服**：如果衬衫不完全合身，你会选择整体最接近的尺寸；这就是最小二乘法的作用。
- **平衡天平**：当过多的约束向不同方向拉扯时，伪逆找到最能平衡它们的妥协方案。

#### 应用场景

1. **最小二乘回归**：通过 $A^+$ 求解 $\min_x \|Ax - b\|^2$。
2. **信号处理**：从不完整或噪声数据中重建信号。
3. **控制理论**：当无法精确控制时设计输入。
4. **机器学习**：训练设计矩阵不可逆的模型。
5. **统计学**：计算协方差矩阵的广义逆。

#### 局限性

- **对极小奇异值敏感**：可能会出现数值不稳定性。
- **正则化**：在噪声环境中，通常首选正则化（如岭回归）。
- **计算成本**：对于非常大的矩阵，计算开销较大，尽管截断 SVD 可以提供帮助。

> **注意**：当矩阵接近奇异时，$1/\sigma_i$ 会变得非常大，放大噪声。这就是为什么在实际机器学习中，我们经常在损失函数中加入正则化项，而不是直接使用伪逆。

#### 为什么它很重要

伪逆是一个统一的概念：它用一个公式处理不一致、欠定或奇异的问题。即使经典代数说“无解”或“无穷多解”，它也能确保我们始终有一个原则性的答案。在真实数据分析中，几乎每个问题都在某种程度上是病态的，这使得伪逆成为现代应用线性代数的实用基石。

#### 练习题与详细解答 (Try It Yourself)

1. **手动计算**：使用 SVD 手动计算一个简单的 $2 \times 2$ 奇异矩阵的伪逆。
2. **系统求解**：使用 $A^+$ 分别求解一个超定（$3 \times 2$）和一个欠定（$2 \times 3$）系统。与直观预期进行比较。
3. **数值探索**：探索当奇异值非常小时数值上会发生什么。尝试截断它们——这与正则化有关。

---

##### **解答 1：手动计算奇异矩阵的伪逆**

**题目**：计算 $A = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}$ 的伪逆。

**解答过程**：

1.  **计算 $A^T A$ 的特征值和特征向量**：
    $$
    A^T A = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix} \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 2 & 2 \\ 2 & 2 \end{bmatrix}
    $$
    特征方程为 $\det(A^T A - \lambda I) = (2-\lambda)^2 - 4 = \lambda^2 - 4\lambda = 0$。
    特征值为 $\lambda_1 = 4, \lambda_2 = 0$。
    奇异值为 $\sigma_1 = \sqrt{4} = 2, \sigma_2 = 0$。

2.  **构造 $\Sigma$ 和 $\Sigma^+$**：
    $$
    \Sigma = \begin{bmatrix} 2 & 0 \\ 0 & 0 \end{bmatrix}, \quad \Sigma^+ = \begin{bmatrix} 1/2 & 0 \\ 0 & 0 \end{bmatrix}
    $$

3.  **确定 $U$ 和 $V$**：
    由于 $A$ 是对称的，$U$ 和 $V$ 相同（忽略符号）。
    对于 $\lambda_1=4$，特征向量满足 $\begin{bmatrix} -2 & 2 \\ 2 & -2 \end{bmatrix}v = 0 \Rightarrow v_1 = \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \end{bmatrix}$。
    对于 $\lambda_2=0$，特征向量满足 $\begin{bmatrix} 2 & 2 \\ 2 & 2 \end{bmatrix}v = 0 \Rightarrow v_2 = \begin{bmatrix} 1/\sqrt{2} \\ -1/\sqrt{2} \end{bmatrix}$。
    所以 $V = U = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$。

4.  **计算 $A^+$**：
    $$
    A^+ = V \Sigma^+ U^T = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix} \begin{bmatrix} 1/2 & 0 \\ 0 & 0 \end{bmatrix} \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}
    $$
    $$
    = \frac{1}{2} \begin{bmatrix} 1 & 0 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix} = \frac{1}{2} \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 0.25 & 0.25 \\ 0.25 & 0.25 \end{bmatrix}
    $$

**结论**：$A^+ = \begin{bmatrix} 0.25 & 0.25 \\ 0.25 & 0.25 \end{bmatrix}$。你可以验证 $A A^+ A = A$。

---

##### **解答 2：超定与欠定系统求解**

**题目**：
1. 超定：$\begin{bmatrix}1 & 0 \\ 0 & 1 \\ 1 & 1\end{bmatrix} x = \begin{bmatrix}1 \\ 1 \\ 3\end{bmatrix}$
2. 欠定：$\begin{bmatrix}1 & 1 & 1\end{bmatrix} x = \begin{bmatrix}3\end{bmatrix}$

**解答过程**：

1.  **超定系统**：
    直观上，前两个方程暗示 $x_1=1, x_2=1$，但第三个方程要求 $x_1+x_2=3$。这是矛盾的。
    使用伪逆求解最小二乘解。
    $$
    A^T A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}, \quad A^T b = \begin{bmatrix} 4 \\ 4 \end{bmatrix}
    $$
    正规方程 $(A^T A)x = A^T b$ 解得 $x_1 = 4/3, x_2 = 4/3$。
    伪逆解 $x = A^+ b$ 应给出相同结果。
    **结果**：$x \approx \begin{bmatrix} 1.33 \\ 1.33 \end{bmatrix}$。这是使误差平方和最小的妥协解。

2.  **欠定系统**：
    方程为 $x_1 + x_2 + x_3 = 3$。有无穷多解（例如 $[3,0,0]^T, [1,1,1]^T$）。
    伪逆选择最小范数解。根据对称性，最小范数解应当均分权重。
    **结果**：$x = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$。
    验证范数：$\|[1,1,1]^T\| = \sqrt{3} \approx 1.732$，而 $\|[3,0,0]^T\| = 3$。伪逆确实选择了更短的向量。

---

##### **解答 3：小奇异值与截断**

**题目**：观察小奇异值对伪逆的影响。

**解答过程**：

考虑矩阵 $A = \begin{bmatrix} 1 & 0 \\ 0 & \epsilon \end{bmatrix}$，其中 $\epsilon = 10^{-10}$。
精确伪逆应为 $A^+ = \begin{bmatrix} 1 & 0 \\ 0 & 1/\epsilon \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 10^{10} \end{bmatrix}$。

如果 $b = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$，则 $x = A^+ b = \begin{bmatrix} 1 \\ 10^{10} \end{bmatrix}$。
注意第二个分量被放大了 $10^{10}$ 倍。如果 $b$ 中包含微小的噪声，解 $x$ 将会被噪声主导，导致数值爆炸。

**截断策略（正则化思想）**：
如果我们设定阈值，将小于 $10^{-5}$ 的奇异值视为 0。
则 $\Sigma^+_{trunc} = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}$。
此时 $x_{trunc} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$。

**结论**：
- 直接使用伪逆在处理小奇异值时会导致解极其不稳定。
- 截断小奇异值（Truncated SVD）相当于忽略那些对信号贡献极小但会放大噪声的方向，这是一种有效的正则化手段。

```python
# 演示小奇异值的影响
epsilon = 1e-10
A_small = np.array([[1, 0], [0, epsilon]])
b = np.array([1, 1])

# 直接伪逆
x_pinv = np.linalg.pinv(A_small) @ b
print("直接伪逆解:", x_pinv)  # 第二个分量会非常大

# 截断 SVD (手动模拟正则化)
U, s, Vt = np.linalg.svd(A_small)
tol = 1e-5
s_trunc = np.array([1/si if si > tol else