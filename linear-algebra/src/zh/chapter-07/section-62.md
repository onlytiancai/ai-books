### 62. 特征多项式

为了揭示矩阵的特征值，我们使用一个核心工具：**特征多项式**（Characteristic Polynomial）。这个多项式编码了矩阵与其特征值之间的内在关系。多项式的根恰好就是特征值，这使得它成为通往谱分析（spectral analysis）的代数 gateway。

#### 定义

对于一个 $n \times n$ 的方阵 $A \in \mathbb{R}^{n \times n}$，其特征多项式定义为：

$$
p_A(\lambda) = \det(A - \lambda I).
$$

- $I$ 是与 $A$ 同阶的单位矩阵。
- 多项式 $p_A(\lambda)$ 的次数为 $n$。
- $A$ 的特征值恰好是 $p_A(\lambda)$ 的根。

> **注意**：有些教材定义为 $\det(\lambda I - A)$。这两种定义仅相差一个符号因子 $(-1)^n$，它们的根（即特征值）是完全相同的。我们这里采用 $\det(A - \lambda I)$ 的形式。

#### 原理分析

为什么这个定义有效？回顾特征值方程：

$$
Av = \lambda v \quad \iff \quad (A - \lambda I)v = 0.
$$

对于非零特征向量 $v$（即非平凡解），矩阵 $A - \lambda I$ 必须是**奇异**的（不可逆）：

$$
\det(A - \lambda I) = 0.
$$

因此，特征值正是那些使得行列式为零的标量 $\lambda$。

> **提示**：行列式为零意味着矩阵的列向量线性相关，从而存在非零向量 $v$ 被映射为零向量。

#### 示例：2×2 矩阵情形

设

$$
A = \begin{bmatrix} 4 & 2 \\ 1 & 3 \end{bmatrix}.
$$

计算特征多项式：

$$
p_A(\lambda) = \det \begin{bmatrix} 4-\lambda & 2 \\ 1 & 3-\lambda \end{bmatrix}.
$$

展开行列式：

$$
p_A(\lambda) = (4-\lambda)(3-\lambda) - 2.
$$

$$
= \lambda^2 - 7\lambda + 10.
$$

求解根得到 $\lambda = 5$ 和 $\lambda = 2$。这就是 $A$ 的特征值。

我们可以使用 Python 的 `numpy` 库来验证这一计算过程：

```python
import numpy as np

# 定义矩阵 A
A = np.array([[4, 2],
              [1, 3]])

# 1. 计算特征值
eigenvalues = np.linalg.eigvals(A)
print("特征值:", eigenvalues)

# 2. 验证特征多项式的系数
# numpy.poly 返回多项式系数，最高次项在前
# 对于 lambda^2 - 7lambda + 10，系数应为 [1, -7, 10]
coeffs = np.poly(A)
print("特征多项式系数:", coeffs)

# 3. 验证迹和行列式
print("迹 (Trace):", np.trace(A), "应等于特征值之和:", np.sum(eigenvalues))
print("行列式 (Det):", np.linalg.det(A), "应等于特征值之积:", np.prod(eigenvalues))
```

#### 示例：3×3 矩阵情形

对于

$$
B = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 3 & 4 \\ 0 & 4 & 9 \end{bmatrix},
$$

$$
p_B(\lambda) = \det \begin{bmatrix} 2-\lambda & 0 & 0 \\ 0 & 3-\lambda & 4 \\ 0 & 4 & 9-\lambda \end{bmatrix}.
$$

按第一行展开：

$$
p_B(\lambda) = (2-\lambda)\big[(3-\lambda)(9-\lambda) - 16\big].
$$

$$
= (2-\lambda)(\lambda^2 - 12\lambda + 11).
$$

根为：$\lambda = 2, 1, 11$。

#### 特征多项式的性质

1.  **次数**：始终为 $n$ 次多项式。
2.  **首项**：$(-1)^n \lambda^n$。
3.  **常数项**：$\det(A)$（即 $\lambda=0$ 时的值）。
4.  **$\lambda^{n-1}$ 的系数**：$-\text{tr}(A)$，其中 $\text{tr}(A)$ 是迹（对角线元素之和）。

因此，多项式的一般形式可以写为：

$$
p_A(\lambda) = (-1)^n \lambda^n + (\text{tr}(A))(-1)^{n-1}\lambda^{n-1} + \cdots + \det(A).
$$

这将迹、行列式和特征值通过一个多项式联系在了一起。

> **注意**：对于 2×2 矩阵，特征多项式常写为 $\lambda^2 - \text{tr}(A)\lambda + \det(A) = 0$。这是一个非常有用的记忆公式。

#### 几何意义

- 特征多项式的根告诉我们在**不变方向**上的缩放因子。
- 在 2D 空间中：多项式编码了面积缩放比例（$\det(A)$）和总拉伸量（$\text{tr}(A)$）。
- 在高维空间中：它将矩阵 $A$ 的复杂性浓缩为一个方程，其解揭示了谱（spectrum）。

#### 生活类比

- **指纹**：特征多项式唯一地标识了矩阵的特征值，就像指纹标识一个人一样。
- **食谱比例**：就像比例决定味道一样，多项式的系数编码了迹和行列式如何控制特征值。
- **投资组合**：多项式将增长率（特征值）总结为一个紧凑的公式。

#### 应用领域

1.  **特征值计算**：是对角化和谱理论的基础。
2.  **控制理论**：系统的稳定性取决于特征值（特征多项式的根）。
3.  **微分方程**：特征多项式描述了系统的固有频率和振荡模式。
4.  **图论**：邻接矩阵的特征多项式编码了图的结构属性。
5.  **量子力学**：量子系统的能级来自于求解算子特征多项式。

#### 为什么它很重要

- 提供了一种系统化的、代数的方法来寻找特征值。
- 将迹和行列式与更深层的谱性质联系起来。
- 架起了线性代数、多项式理论和几何之间的桥梁。
- 构成了现代计算方法（如 QR 迭代）的基础。

#### Try It Yourself

1.  计算矩阵 $\begin{bmatrix} 1 & 1 \\ 0 & 2 \end{bmatrix}$ 的特征多项式。找出其特征值。
2.  验证特征值的乘积等于行列式。
3.  验证特征值的和等于迹。
4.  **挑战**：证明对于任意同阶方阵 $A, B$，有 $p_{AB}(\lambda) = p_{BA}(\lambda)$。

---

#### 练习题参考答案与解析

**1. 计算特征多项式及特征值**

设 $M = \begin{bmatrix} 1 & 1 \\ 0 & 2 \end{bmatrix}$。

$$
p_M(\lambda) = \det \begin{bmatrix} 1-\lambda & 1 \\ 0 & 2-\lambda \end{bmatrix}
$$

$$
= (1-\lambda)(2-\lambda) - 0 \cdot 1
$$

$$
= \lambda^2 - 3\lambda + 2.
$$

令 $p_M(\lambda) = 0$，解得：
$$
(\lambda - 1)(\lambda - 2) = 0 \implies \lambda_1 = 1, \lambda_2 = 2.
$$

**2. 验证特征值之积等于行列式**

- 特征值之积：$\lambda_1 \cdot \lambda_2 = 1 \times 2 = 2$.
- 矩阵行列式：$\det(M) = 1 \times 2 - 1 \times 0 = 2$.
- **结论**：$2 = 2$，验证成立。

**3. 验证特征值之和等于迹**

- 特征值之和：$\lambda_1 + \lambda_2 = 1 + 2 = 3$.
- 矩阵的迹：$\text{tr}(M) = 1 + 2 = 3$.
- **结论**：$3 = 3$，验证成立。

**Python 验证代码：**

```python
import numpy as np

M = np.array([[1, 1],
              [0, 2]])

eigs = np.linalg.eigvals(M)
print(f"特征值: {eigs}")
print(f"特征值之和: {np.sum(eigs)}, 迹: {np.trace(M)}")
print(f"特征值之积: {np.prod(eigs)}, 行列式: {np.linalg.det(M)}")
```

**4. 挑战题证明：$p_{AB}(\lambda) = p_{BA}(\lambda)$**

**证明思路：**

我们需要证明 $\det(AB - \lambda I) = \det(BA - \lambda I)$。

**情形 1：$A$ 是可逆矩阵**
如果 $A$ 可逆，我们可以利用相似矩阵的性质。
注意到：
$$
AB = A(BA)A^{-1}.
$$
这意味着 $AB$ 和 $BA$ 是**相似矩阵**。
相似矩阵具有相同的特征多项式。
具体推导：
$$
\det(AB - \lambda I) = \det(A(BA)A^{-1} - \lambda A I A^{-1})
$$
$$
= \det(A(BA - \lambda I)A^{-1})
$$
$$
= \det(A) \det(BA - \lambda I) \det(A^{-1})
$$
$$
= \det(A) \det(A)^{-1} \det(BA - \lambda I)
$$
$$
= \det(BA - \lambda I).
$$
所以在 $A$ 可逆时成立。

**情形 2：$A$ 不可逆**
当 $A$ 不可逆时，我们可以使用**连续性论证**（Continuity Argument）。
考虑矩阵 $A_\epsilon = A + \epsilon I$。对于足够小的 $\epsilon$，只要 $\epsilon$ 不是 $-A$ 的特征值，$A_\epsilon$ 就是可逆的。
根据情形 1，对于可逆的 $A_\epsilon$，我们有：
$$
\det(A_\epsilon B - \lambda I) = \det(B A_\epsilon - \lambda I).
$$
行列式是矩阵元素的连续函数。当 $\epsilon \to 0$ 时，$A_\epsilon \to A$。
因此，等式两边取极限：
$$
\lim_{\epsilon \to 0} \det(A_\epsilon B - \lambda I) = \det(AB - \lambda I),
$$
$$
\lim_{\epsilon \to 0} \det(B A_\epsilon - \lambda I) = \det(BA - \lambda I).
$$
所以，$p_{AB}(\lambda) = p_{BA}(\lambda)$ 对任意方阵成立。

> **提示**：这个结论非常重要，它意味着即使 $AB \neq BA$，它们的非零特征值集合也是相同的（包括重数）。