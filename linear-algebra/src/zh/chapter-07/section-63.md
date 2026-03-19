### 63. 代数重数与几何重数

在研究特征值时，仅仅求出特征多项式的根是远远不够的。每个特征值可能会出现多次，这种“重数”可以从两个不同但密切相关的角度来理解：**代数重数**（作为根出现的次数）和**几何重数**（其特征空间的维数）。这两个重数共同揭示了特征值在代数结构和几何结构上的丰富内涵。

#### 代数重数

特征值 $\lambda$ 的**代数重数**（Algebraic Multiplicity，简称 AM）是指它作为特征多项式 $p_A(\lambda)$ 的根出现的次数。

- 如果 $(\lambda - \lambda_0)^k$ 能整除 $p_A(\lambda)$，则 $\lambda_0$ 的代数重数为 $k$。
- 所有特征值的代数重数之和等于矩阵的阶数（$n$）。

**示例：**
如果
$$
p_A(\lambda) = (\lambda-2)^3(\lambda+1)^2,
$$
那么特征值 $\lambda=2$ 的代数重数 AM = 3，而 $\lambda=-1$ 的代数重数 AM = 2。

#### 几何重数

特征值 $\lambda$ 的**几何重数**（Geometric Multiplicity，简称 GM）是指对应于 $\lambda$ 的特征空间的维数：

$$
\text{GM}(\lambda) = \dim(\ker(A - \lambda I)).
$$

- 这统计了对应于 $\lambda$ 有多少个**线性无关**的特征向量。
- 始终满足以下不等式：

  $$
  1 \leq \text{GM}(\lambda) \leq \text{AM}(\lambda).
  $$

**示例：**
如果
$$
A = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix},
$$
则其特征多项式为 $p_A(\lambda) = (\lambda-2)^2$。

- $\lambda=2$ 的代数重数 AM = 2。
- 求解 $(A-2I)v=0$：

  $$
  \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} v = 0 \quad \Rightarrow \quad v = \begin{bmatrix} 1 \\ 0 \end{bmatrix}.
  $$

  这里只有 1 个线性无关的特征向量。
- 因此，$\lambda=2$ 的几何重数 GM = 1。

> **注意**：几何重数永远至少为 1，因为根据特征值的定义，至少存在一个非零特征向量。

#### 两者之间的关系

- 恒成立：$\text{GM}(\lambda) \leq \text{AM}(\lambda)$。
- 如果对于所有特征值，两者都相等（即 $\text{GM} = \text{AM}$），则该矩阵是**可对角化**的。
- 如果对于某个特征值 $\text{GM} < \text{AM}$，则该矩阵是**亏损的**（defective）。这意味着它无法被对角化，尽管它仍然可能拥有若尔当标准型（Jordan Canonical Form）。

#### 几何意义

- **代数重数 (AM)** 衡量了特征值在多项式中被“编码”的强度。
- **几何重数 (GM)** 衡量了该特征值的特征空间提供了多少几何自由度。
- 如果 $\text{AM} > \text{GM}$，意味着该特征值“想要”更多的独立方向，但空间结构不允许。

可以将 AM 想象成对特征向量的**理论需求**，而 GM 则是**实际供给**。

#### 示例：可对角化 vs. 亏损矩阵

1. **可对角化情形：**

   $$
   B = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}.
   $$

   - 特征多项式 $p_B(\lambda) = (\lambda-2)^2$。
   - 特征值 2 的代数重数 AM = 2。
   - 几何重数 GM = 2，因为特征空间是整个 $\mathbb{R}^2$（任何非零向量都是特征向量）。
   - 拥有足够的特征向量来进行对角化。

2. **亏损情形：**
   前面的例子
   $$
   A = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}
   $$
   具有 AM = 2, GM = 1。

   - 特征向量不足。
   - 无法被对角化。

#### 生活类比

- **座位与人**：代数重数是给某个特征值预留的座位数；几何重数是实际到场的人数。如果到场人数少于座位数，系统就是“亏损”的。
- **承诺与现实**：AM 是特征多项式给出的理论承诺；GM 是独立方向的实际现实。
- **音乐音符**：AM 是乐谱上某个音符写的次数；GM 是实际演奏该音符的不同乐器的数量。

#### 应用

1. **对角化**：仅当所有特征值的 GM = AM 时才可能。
2. **若尔当标准型**：亏损矩阵需要若尔当块，其结构由 AM 和 GM 之间的差距决定。
3. **微分方程**：解的形式取决于重数；重特征值但特征向量较少时，需要广义特征向量解。
4. **稳定性分析**：重数揭示了动力系统中的简并性。
5. **量子力学**：特征值的简并度（AM vs. GM）编码了物理对称性。

#### 为什么这很重要

- 重数将代数根与几何结构区分开来。
- 它们决定了是否可以进行对角化。
- 它们揭示了具有重特征值的系统中隐藏的约束。
- 它们构成了若尔当标准型和广义特征向量等高级概念的基础。

#### Python 数值演示

我们可以使用 `numpy` 来验证几何重数。几何重数等于 $n - \text{rank}(A - \lambda I)$。虽然数值计算中精确判断代数重数较难（受浮点误差影响），但我们可以清晰地看到几何重数的差异。

```python
import numpy as np

def calculate_geometric_multiplicity(A, eigenvalue):
    """
    计算矩阵 A 对于给定特征值的几何重数
    GM = n - rank(A - lambda*I)
    """
    n = A.shape[0]
    # 构建 (A - lambda*I)
    M = A - eigenvalue * np.eye(n)
    # 计算矩阵的秩
    rank = np.linalg.matrix_rank(M)
    # 几何重数 = 维数 - 秩
    gm = n - rank
    return gm

# 案例 1: 亏损矩阵 (Defective)
A_defective = np.array([[2, 1], 
                        [0, 2]])
# 案例 2: 可对角化矩阵 (Diagonalizable)
B_diagonal = np.array([[2, 0], 
                       [0, 2]])

lambda_val = 2.0

gm_A = calculate_geometric_multiplicity(A_defective, lambda_val)
gm_B = calculate_geometric_multiplicity(B_diagonal, lambda_val)

print(f"矩阵 A (亏损): 特征值 {lambda_val} 的几何重数 GM = {gm_A}")
print(f"矩阵 B (对角): 特征值 {lambda_val} 的几何重数 GM = {gm_B}")

# 预期输出:
# 矩阵 A (亏损): 特征值 2.0 的几何重数 GM = 1
# 矩阵 B (对角): 特征值 2.0 的几何重数 GM = 2
```

> **提示**：在数值计算中，由于浮点误差，判断代数重数通常需要使用符号计算库（如 `sympy`），而几何重数可以通过矩阵秩稳定地估算。

#### 动手试一试 (Try It Yourself)

1. 求矩阵 $\begin{bmatrix} 3 & 1 \\ 0 & 3 \end{bmatrix}$ 的 AM 和 GM。
2. 求矩阵 $\begin{bmatrix} 3 & 0 \\ 0 & 3 \end{bmatrix}$ 的 AM 和 GM，并与第一种情况比较。
3. 说明为什么 AM 总是等于特征多项式根的重数。
4. **挑战**：证明对于任何特征值，GM ≥ 1。

---

#### 练习题详细解答

**1. 求矩阵 $\begin{bmatrix} 3 & 1 \\ 0 & 3 \end{bmatrix}$ 的 AM 和 GM。**

**解答过程：**
设 $A = \begin{bmatrix} 3 & 1 \\ 0 & 3 \end{bmatrix}$。
- **求特征值**：
  特征多项式为 $p_A(\lambda) = \det(A - \lambda I) = \det \begin{bmatrix} 3-\lambda & 1 \\ 0 & 3-\lambda \end{bmatrix} = (3-\lambda)^2$。
  令 $p_A(\lambda) = 0$，解得唯一特征值 $\lambda = 3$。
- **求代数重数 (AM)**：
  因为 $(\lambda - 3)^2$ 是特征多项式的因子，所以 $\lambda = 3$ 的 **AM = 2**。
- **求几何重数 (GM)**：
  我们需要计算 $\dim(\ker(A - 3I))$。
  $$
  A - 3I = \begin{bmatrix} 3-3 & 1 \\ 0 & 3-3 \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}.
  $$
  求解 $(A - 3I)v = 0$，即 $\begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$。
  这意味着 $y = 0$，而 $x$ 可以是任意值。
  特征向量形式为 $v = \begin{bmatrix} x \\ 0 \end{bmatrix} = x \begin{bmatrix} 1 \\ 0 \end{bmatrix}$。
  只有一个线性无关的特征向量 $\begin{bmatrix} 1 \\ 0 \end{bmatrix}$。
  所以，**GM = 1**。

**结论**：AM = 2, GM = 1。这是一个亏损矩阵。

**2. 求矩阵 $\begin{bmatrix} 3 & 0 \\ 0 & 3 \end{bmatrix}$ 的 AM 和 GM，并与第一种情况比较。**

**解答过程：**
设 $B = \begin{bmatrix} 3 & 0 \\ 0 & 3 \end{bmatrix} = 3I$。
- **求特征值**：
  特征多项式为 $p_B(\lambda) = \det(3I - \lambda I) = (3-\lambda)^2$。
  特征值仍为 $\lambda = 3$。
- **求代数重数 (AM)**：
  同样，$(\lambda - 3)^2$ 是因子，所以 **AM = 2**。
- **求几何重数 (GM)**：
  计算 $\dim(\ker(B - 3I))$。
  $$
  B - 3I = \begin{bmatrix} 3-3 & 0 \\ 0 & 3-3 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}.
  $$
  求解 $(B - 3I)v = 0$，即 $\begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$。
  这对 $x$ 和 $y$ 没有限制，任何向量都是特征向量。
  我们可以找到两个线性无关的特征向量，例如 $\begin{bmatrix} 1 \\ 0 \end{bmatrix}$ 和 $\begin{bmatrix} 0 \\ 1 \end{bmatrix}$。
  所以，**GM = 2**。

**比较**：
- 第一种情况（亏损）：AM = 2, GM = 1。无法对角化（虽然它已经是上三角，但不能相似对角化为对角矩阵）。
- 第二种情况（可对角化）：AM = 2, GM = 2。本身就是对角矩阵。
- 这说明即使特征多项式相同，矩阵的几何结构（特征向量的数量）也可能完全不同。

**3. 说明为什么 AM 总是等于特征多项式根的重数。**

**解答过程：**
这是一个定义问题。
- **定义**：代数重数（Algebraic Multiplicity）被**定义**为特征值作为特征多项式 $p_A(\lambda) = \det(A - \lambda I)$ 的根的重数。
- 根据代数基本定理，任何 $n$ 次多项式在复数域上可以分解为 $n$ 个线性因子的乘积：
  $$
  p_A(\lambda) = c (\lambda - \lambda_1)^{k_1} (\lambda - \lambda_2)^{k_2} \cdots (\lambda - \lambda_m)^{k_m}
  $$
  其中 $\sum k_i = n$。
- 在这里，指数 $k_i$ 就是根 $\lambda_i$ 的重数。根据定义，这个 $k_i$ 就是该特征值的代数重数。
- 因此，AM 等于特征多项式根的重数是由其定义直接保证的。

**4. 挑战：证明对于任何特征值，GM ≥ 1。**

**解答过程：**
- **特征值的定义**：标量 $\lambda$ 被称为矩阵 $A$ 的特征值，当且仅当存在一个**非零向量** $v$（称为特征向量），使得：
  $$
  Av = \lambda v \quad \text{或等价地} \quad (A - \lambda I)v = 0.
  $$
- **几何重数的定义**：$\text{GM}(\lambda) = \dim(\ker(A - \lambda I))$，即齐次方程 $(A - \lambda I)v = 0$ 解空间的维数。
- **证明**：
  1. 既然 $\lambda$ 是一个特征值，根据定义，至少存在一个非零向量 $v \neq 0$ 满足 $(A - \lambda I)v = 0$。
  2. 这意味着零空间 $\ker(A - \lambda I)$ 不仅仅包含零向量 $\mathbf{0}$，它至少包含向量 $v$。
  3. 任何包含非零向量的向量空间，其维数至少为 1。
  4. 因此，$\dim(\ker(A - \lambda I)) \geq 1$。
  5. 即 $\text{GM}(\lambda) \geq 1$。

**证毕。**

---

代数重数和几何重数共同讲述了完整的故事：代数告诉我们特征值出现了多少次，而几何告诉我们它在向量空间中真正占据了多大的空间。