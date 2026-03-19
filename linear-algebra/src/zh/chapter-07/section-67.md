### 67. 亏损矩阵与若尔当标准型（初探）

并非所有矩阵都能完全简化为对角形式。有些矩阵虽然具有重复的特征值，但没有足够的独立特征向量来张成整个空间。这类矩阵被称为**亏损矩阵（Defective Matrices）**。理解它们需要引入**若尔当标准型（Jordan Canonical Form）**，这是对对角化的一种推广，专门用于处理这些棘手的情况。

#### 亏损矩阵

一个方阵 $A \in \mathbb{R}^{n \times n}$ 被称为亏损的，如果满足以下条件：

- 它有一个特征值 $\lambda$，其代数重数（Algebraic Multiplicity, AM）严格大于其几何重数（Geometric Multiplicity, GM）。
- 等价地说，$A$ 没有足够的线性无关特征向量来形成 $\mathbb{R}^n$ 的完整基。

**示例：**

$$
A = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}.
$$

- 特征多项式：$(\lambda - 2)^2$，因此代数重数 AM = 2。
- 求解 $(A - 2I)v = 0$：

  $$
  \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}v = 0 \quad \Rightarrow \quad v = \begin{bmatrix} 1 \\ 0 \end{bmatrix}.
  $$

  只有一个独立特征向量 → 几何重数 GM = 1。
- 由于 GM < AM，该矩阵是亏损的。

**注意**：亏损矩阵无法被对角化。

```python
import numpy as np

# 定义亏损矩阵
A = np.array([[2, 1], 
              [0, 2]])

# 计算特征值和特征向量
eigenvalues, eigenvectors = np.linalg.eig(A)

print("特征值:", eigenvalues)
print("特征向量矩阵:\n", eigenvectors)

# 检查秩来确定几何重数
# 对于 lambda=2, 计算 A - 2I 的零空间维数
A_shifted = A - 2 * np.eye(2)
rank = np.linalg.matrix_rank(A_shifted)
geo_mult = A.shape[0] - rank

print(f"特征值 2 的几何重数: {geo_mult}")
print(f"特征值 2 的代数重数: 2")
```

#### 为什么存在亏损矩阵

对角化要求每个特征值副本对应一个独立特征向量。但有时矩阵会将这些方向“折叠”在一起，产生的特征向量少于预期。

- 想象一下乐谱上写了多个音符（代数重数），但可用的乐器较少（几何重数）。
- 矩阵“想要”更多的独立方向，但其零空间的几何结构阻止了这一点。

**提示**：当特征多项式有重根，但对应的特征空间维数不足时，就会出现亏损。

#### 若尔当标准型（直观理解）

虽然亏损矩阵不能对角化，但它们仍然可以被转化为一种接近对角的形式，称为**若尔当标准型（Jordan Canonical Form, JCF）**：

$$
J = P^{-1} A P,
$$

其中 $J$ 由若尔当块（Jordan blocks）组成：

$$
J_k(\lambda) = \begin{bmatrix} 
\lambda & 1 & 0 & \cdots & 0 \\
0 & \lambda & 1 & \cdots & 0 \\
0 & 0 & \lambda & \cdots & 0 \\
\vdots & \vdots & \vdots & \ddots & 1 \\
0 & 0 & 0 & \cdots & \lambda
\end{bmatrix}.
$$

每个块对应一个特征值 $\lambda$，超对角线上的 1 表示独立特征向量的缺失。

- 如果每个块都是 $1 \times 1$，矩阵可对角化。
- 如果出现更大的块，矩阵是亏损的。

#### 示例：大小为 2 的若尔当块

前面的亏损示例

$$
A = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}
$$

其若尔当形式为

$$
J = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}.
$$

注意它已经处于若尔当形式：对于特征值 2，有一个大小为 2 的块。

#### 若尔当块的幂

一个关键性质是幂的行为。对于

$$
J = \begin{bmatrix} \lambda & 1 \\ 0 & \lambda \end{bmatrix},
$$

$$
J^k = \begin{bmatrix} \lambda^k & k\lambda^{k-1} \\ 0 & \lambda^k \end{bmatrix}.
$$

- 与对角矩阵不同，这里出现了关于 $k$ 的额外多项式项。
- 这解释了为什么亏损矩阵会产生类似于 $k \lambda^{k-1}$ 比例增长的行为。

```python
def jordan_block_power(lambda_val, k):
    """计算 2x2 若尔当块的 k 次幂"""
    J_k = np.array([[lambda_val**k, k * (lambda_val**(k-1))], 
                    [0, lambda_val**k]])
    return J_k

# 验证 lambda=2, k=3
lambda_val = 2
k = 3
J = np.array([[2, 1], [0, 2]])

# 直接计算幂
J_direct = np.linalg.matrix_power(J, k)
# 公式计算
J_formula = jordan_block_power(lambda_val, k)

print("直接计算 J^3:\n", J_direct)
print("公式计算 J^3:\n", J_formula)
print("两者是否接近:", np.allclose(J_direct, J_formula))
```

#### 几何意义

- 特征向量描述不变直线。
- 当特征向量不足时，若尔当形式编码了**广义特征向量（Generalized Eigenvectors）**的链。
- 每条链捕捉了矩阵如何变换略微偏离不变直线的向量，通过若尔当块将它们沿着 linked 的方向推动。

因此，虽然可对角化矩阵将空间分解为整齐的独立方向，但亏损矩阵会将某些方向纠缠在一起，迫使它们形成链。

#### 日常类比

- **乐团类比**：可对角化矩阵每个音符对应一种乐器。亏损矩阵乐器较少，因此某些音符必须在和声中“共享”，由链来表示。
- **河流流动**：不是独立的直渠道，某些水流合并并相互牵引，导致依赖性。
- **办公室层级**：不是每个经理都有自己的团队（独立特征向量），某些团队重叠，产生影响链。

#### 应用

1. **微分方程**：若尔当块决定了解中额外多项式因子（如 $t e^{\lambda t}$）的出现。
2. **马尔可夫链**：不可对角化的转移矩阵会导致收敛到稳态的速度变慢。
3. **数值分析**：如果系统矩阵是亏损的，算法可能会失败或变慢。
4. **控制理论**：稳定性不仅取决于特征值，还取决于矩阵是否可对角化。
5. **量子力学**：简并特征值需要若尔当分析来完整描述状态。

#### 为什么这很重要

- 对角化并不总是可能的，亏损矩阵是例外情况。
- 若尔当形式是通用的后备方案：每个方阵都有一个，它推广了对角化。
- 它引入了广义特征向量，扩展了谱理论的范围。

#### Try It Yourself

1. 验证
   $\begin{bmatrix} 3 & 1 \\ 0 & 3 \end{bmatrix}$
   是亏损的。找出它的若尔当形式。
2. 证明对于大小为 3 的若尔当块，

   $$
   J^k = \lambda^k I + k \lambda^{k-1} N + \frac{k(k-1)}{2}\lambda^{k-2} N^2,
   $$

   其中 $N$ 是幂零部分（对角线上方为 1 的矩阵）。
3. 比较具有相同特征值的可对角化矩阵与亏损矩阵的 $A^k$ 行为。
4. 挑战：证明每个方阵在复数域上都有若尔当形式。

#### 练习题详细解答

**1. 验证亏损性并找若尔当形式**

**解答：**
设矩阵为 $B = \begin{bmatrix} 3 & 1 \\ 0 & 3 \end{bmatrix}$。

1.  **求特征值**：
    特征多项式为 $\det(B - \lambda I) = (3-\lambda)(3-\lambda) = (3-\lambda)^2$。
    特征值为 $\lambda = 3$，代数重数 AM = 2。

2.  **求特征向量（几何重数）**：
    求解 $(B - 3I)v = 0$：
    $$
    \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \quad \Rightarrow \quad y = 0.
    $$
    特征向量形式为 $v = \begin{bmatrix} x \\ 0 \end{bmatrix} = x \begin{bmatrix} 1 \\ 0 \end{bmatrix}$。
    只有一个线性无关的特征向量，因此几何重数 GM = 1。

3.  **结论**：
    因为 GM (1) < AM (2)，所以矩阵 $B$ 是亏损的。

4.  **若尔当形式**：
    由于 $B$ 已经是上三角矩阵且对角线元素相同，超对角线元素为 1，它本身就是若尔当块。
    若尔当形式 $J = \begin{bmatrix} 3 & 1 \\ 0 & 3 \end{bmatrix}$。此时变换矩阵 $P = I$。

**2. 大小为 3 的若尔当块幂公式证明**

**解答：**
设大小为 3 的若尔当块为 $J = \begin{bmatrix} \lambda & 1 & 0 \\ 0 & \lambda & 1 \\ 0 & 0 & \lambda \end{bmatrix}$。
我们可以将其分解为 $J = \lambda I + N$，其中：
$$
I = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}, \quad
N = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{bmatrix}.
$$
注意 $N$ 是幂零矩阵。计算 $N$ 的幂：
$$
N^2 = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix},
$$
$$
N^3 = N^2 \cdot N = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix} = 0.
$$
由于 $\lambda I$ 与 $N$ 可交换（单位矩阵与任何矩阵可交换），我们可以使用二项式定理展开 $(\lambda I + N)^k$：
$$
J^k = (\lambda I + N)^k = \sum_{j=0}^k \binom{k}{j} (\lambda I)^{k-j} N^j.
$$
因为当 $j \ge 3$ 时 $N^j = 0$，求和只需到 $j=2$：
$$
J^k = \binom{k}{0} \lambda^k I + \binom{k}{1} \lambda^{k-1} N + \binom{k}{2} \lambda^{k-2} N^2.
$$
代入组合数公式 $\binom{k}{1} = k$ 和 $\binom{k}{2} = \frac{k(k-1)}{2}$，得到：
$$
J^k = \lambda^k I + k \lambda^{k-1} N + \frac{k(k-1)}{2}\lambda^{k-2} N^2.
$$
证毕。

**3. 比较可对角化与亏损矩阵的 $A^k$ 行为**

**解答：**
假设两个矩阵都有特征值 $\lambda$（重数为 2）。

-   **情形 A：可对角化矩阵**
    $$
    D = \begin{bmatrix} \lambda & 0 \\ 0 & \lambda \end{bmatrix} = \lambda I.
    $$
    其幂为：
    $$
    D^k = \begin{bmatrix} \lambda^k & 0 \\ 0 & \lambda^k \end{bmatrix}.
    $$
    元素仅按 $\lambda^k$ 增长或衰减。

-   **情形 B：亏损矩阵**
    $$
    J = \begin{bmatrix} \lambda & 1 \\ 0 & \lambda \end{bmatrix}.
    $$
    其幂为（见前文）：
    $$
    J^k = \begin{bmatrix} \lambda^k & k\lambda^{k-1} \\ 0 & \lambda^k \end{bmatrix}.
    $$
    右上角元素包含因子 $k$。

-   **行为比较**：
    如果 $|\lambda| < 1$，两者都收敛到零矩阵，但亏损矩阵收敛得更慢（因为乘以了 $k$）。
    如果 $|\lambda| = 1$，可对角化矩阵保持有界，而亏损矩阵的元素可能随 $k$ 线性增长（无界）。
    如果 $|\lambda| > 1$，两者都发散，但亏损矩阵的发散速度更快（多项式加速）。

**4. 挑战：证明每个方阵在复数域上都有若尔当形式**

**解答概要：**
这是一个经典的线性代数定理，完整证明较为复杂，通常基于以下思路：

1.  **舒尔分解（Schur Decomposition）**：
    任何复数方阵 $A$ 都可以酉相似于一个上三角矩阵 $T$，即 $A = U T U^*$，其中 $U$ 是酉矩阵，$T$ 的对角线元素是 $A$ 的特征值。

2.  **归纳法与块对角化**：
    对上三角矩阵 $T$ 进行进一步的结构分析。如果 $T$ 不是若尔当形式，意味着存在某些结构可以进一步简化。
    利用广义特征空间分解定理：空间 $V$ 可以分解为对应于不同特征值的广义特征子空间的直和 $V = \bigoplus \ker((A - \lambda_i I)^{m_i})$。

3.  **循环子空间**：
    在每个广义特征子空间内，可以找到循环向量，生成若尔当链。这些链构成了若尔当块的基础。

4.  **结论**：
    通过组合这些块，我们总可以找到一个可逆矩阵 $P$，使得 $P^{-1} A P = J$，其中 $J$ 是若尔当标准型。
    注意：在实数域上不一定存在若尔当形式（因为特征值可能是复数），但在复数域 $\mathbb{C}$ 上总是存在的。

亏损矩阵和若尔当形式向我们表明，即使特征向量“不足”，我们仍然可以施加结构，捕捉线性变换在其最基本构建块中的行为。