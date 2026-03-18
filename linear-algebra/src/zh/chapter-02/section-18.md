### 18. 迹与基本矩阵性质

到目前为止，我们已经研究了矩阵的形状、乘法规则以及特殊类别的矩阵。在本节中，我们引入一个简单但令人惊讶地强大的量：**矩阵的迹（Trace）**。与此同时，我们将回顾一组基本的矩阵性质，这些性质提供了计算捷径、不变量，并能帮助我们深入理解矩阵的行为。

#### 迹的定义

对于一个大小为 $n \times n$ 的方阵 $A = [a_{ij}]$，迹定义为对角线元素的总和：

$$
\text{tr}(A) = a_{11} + a_{22} + \cdots + a_{nn}.
$$

示例：

$$
A = \begin{bmatrix} 
2 & 5 & 7 \\ 
0 & 3 & 1 \\ 
4 & 6 & 8 
\end{bmatrix}, 
\quad 
\text{tr}(A) = 2 + 3 + 8 = 13.
$$

迹提取了一个单一数值，概括了矩阵的“对角线内容”。

> **注意**：迹仅对方阵（行数等于列数的矩阵）有定义。非方阵没有迹。

我们可以使用 Python 的 `numpy` 库轻松计算矩阵的迹：

```python
import numpy as np

# 定义矩阵 A
A = np.array([
    [2, 5, 7],
    [0, 3, 1],
    [4, 6, 8]
])

# 计算迹
trace_A = np.trace(A)
print(f"矩阵 A 的迹为：{trace_A}")
# 输出：矩阵 A 的迹为：13
```

#### 迹的性质

迹具有线性性质，并且与矩阵乘法和转置运算有良好的交互关系：

1. **线性性质 (Linearity)**：

   - $\text{tr}(A + B) = \text{tr}(A) + \text{tr}(B)$.
   - $\text{tr}(cA) = c \cdot \text{tr}(A)$.

2. **循环性质 (Cyclic Property)**：

   - $\text{tr}(AB) = \text{tr}(BA)$，只要乘积有定义。
   - 更一般地，$\text{tr}(ABC) = \text{tr}(BCA) = \text{tr}(CAB)$.
   - 但通常情况下，$\text{tr}(AB) \neq \text{tr}(A)\text{tr}(B)$.

3. **转置不变性 (Transpose Invariance)**：

   - $\text{tr}(A^T) = \text{tr}(A)$.

4. **相似不变性 (Similarity Invariance)**：

   - 如果 $B = P^{-1}AP$，则 $\text{tr}(B) = \text{tr}(A)$.
   - 这意味着迹是一个相似不变量，它仅取决于线性变换本身，而与基的选择无关。

> **提示**：循环性质 $\text{tr}(ABC) = \text{tr}(CAB)$ 非常有用，它允许我们在迹的内部“旋转”矩阵乘积的顺序，但不能随意交换顺序（例如 $\text{tr}(ABC)$ 通常不等于 $\text{tr}(ACB)$）。

下面通过代码验证迹的循环性质 $\text{tr}(AB) = \text{tr}(BA)$：

```python
# 定义两个矩阵 A 和 B
A = np.array([[1, 2], [0, 3]])
B = np.array([[4, 0], [5, 6]])

# 计算 AB 和 BA 的迹
trace_AB = np.trace(A @ B)
trace_BA = np.trace(B @ A)

print(f"tr(AB) = {trace_AB}")
print(f"tr(BA) = {trace_BA}")
print(f"两者相等吗？{np.isclose(trace_AB, trace_BA)}")
```

#### 迹与特征值

最重要的联系之一是迹与特征值之间的关系：

$$
\text{tr}(A) = \lambda_1 + \lambda_2 + \cdots + \lambda_n,
$$

其中 $\lambda_i$ 是 $A$ 的特征值（计算重数）。

这将简单的对角线之和与矩阵深刻的谱性质联系了起来。

示例：

$$
A = \begin{bmatrix} 1 & 0 \\ 0 & 3 \end{bmatrix}, \quad 
\text{tr}(A) = 4, \quad 
\lambda_1 = 1, \; \lambda_2 = 3, \quad \lambda_1 + \lambda_2 = 4.
$$

#### 其他基本矩阵性质

除了迹之外，以下是线性代数每位学生必须知道的一些重要代数事实：

1. **行列式与迹 (Determinant vs. Trace)**：

   - 对于 2×2 矩阵，$A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$，
     $\text{tr}(A) = a + d$，
     $\det(A) = ad - bc$.
   -  Together，迹和行列式编码了特征值：它们是方程 $x^2 - \text{tr}(A)x + \det(A) = 0$ 的根。

2. **范数与内积 (Norms and Inner Products)**：

   - 弗罗贝尼乌斯范数（Frobenius norm）使用迹来定义：
     $\|A\|_F = \sqrt{\text{tr}(A^TA)}$.

3. **正交不变性 (Orthogonal Invariance)**：

   - 对于任意正交矩阵 $Q$，
     $\text{tr}(Q^TAQ) = \text{tr}(A)$.

#### 几何与实际意义

- 变换的迹可以看作是其沿坐标轴作用的总和。
- 在物理学中，应力张量的迹测量的是压力。
- 在概率论中，协方差矩阵的迹是系统的总方差。
- 在统计学和机器学习中，迹常被用作衡量模型整体“大小”或复杂度的指标。

#### 日常类比

- **成绩单**：迹就像是对“主科”（对角线元素）求和，而不看选修课（非对角线元素）。
- **公司预算**：对角线可以代表各部门的总预算，而迹则是 grand total（总计）。
- **照明系统**：想象每个对角线元素是每个房间灯光开关的亮度，迹就是建筑物中的总亮度。

#### 为什么它很重要

迹看似简单，但功能强大：

1. 它直接与特征值相连，在原始矩阵条目和谱理论之间架起了桥梁。
2. 它在相似变换下是不变的，使其成为独立于基的变换的可靠度量。
3. 它出现在优化、物理学、统计学和量子力学中。
4. 它简化了计算：线性代数中的许多证明都可以归结为迹的性质。

#### Try It Yourself

1. 计算以下矩阵的迹：

$$
\begin{bmatrix} 
4 & 2 & 0 \\ 
-1 & 3 & 5 \\ 
7 & 6 & 1 
\end{bmatrix}.
$$

2. 验证 $\text{tr}(AB) = \text{tr}(BA)$，其中：

$$
A = \begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}, \quad 
B = \begin{bmatrix} 4 & 0 \\ 5 & 6 \end{bmatrix}.
$$

3. 对于 2×2 矩阵

$$
\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix},
$$

计算其特征值，并检查它们的和是否等于迹。

4. **挑战**：证明具有协方差矩阵 $\Sigma$ 的数据集的总方差等于 $\text{tr}(\Sigma)$。

掌握迹及其性质将为你接下来的飞跃做好准备：理解矩阵如何与体积、方向和行列式相互作用。

#### 练习题参考解答与代码验证

以下是上述练习题的详细解答过程及 Python 验证代码。

**1. 计算矩阵的迹**

**解答过程**：
根据迹的定义，我们需要将主对角线上的元素相加。
矩阵为：
$$
\begin{bmatrix} 
4 & 2 & 0 \\ 
-1 & 3 & 5 \\ 
7 & 6 & 1 
\end{bmatrix}
$$
对角线元素分别是 $4, 3, 1$。
$$
\text{tr}(A) = 4 + 3 + 1 = 8.
$$

**代码验证**：
```python
import numpy as np

M1 = np.array([
    [4, 2, 0],
    [-1, 3, 5],
    [7, 6, 1]
])
print(f"练习 1 结果：{np.trace(M1)}")
# 预期输出：8
```

**2. 验证 $\text{tr}(AB) = \text{tr}(BA)$**

**解答过程**：
首先计算矩阵乘积 $AB$ 和 $BA$。

$$
A = \begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix}, \quad 
B = \begin{bmatrix} 4 & 0 \\ 5 & 6 \end{bmatrix}
$$

计算 $AB$：
$$
AB = \begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix} \begin{bmatrix} 4 & 0 \\ 5 & 6 \end{bmatrix} = \begin{bmatrix} 1\cdot4 + 2\cdot5 & 1\cdot0 + 2\cdot6 \\ 0\cdot4 + 3\cdot5 & 0\cdot0 + 3\cdot6 \end{bmatrix} = \begin{bmatrix} 14 & 12 \\ 15 & 18 \end{bmatrix}
$$
$$
\text{tr}(AB) = 14 + 18 = 32.
$$

计算 $BA$：
$$
BA = \begin{bmatrix} 4 & 0 \\ 5 & 6 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 0 & 3 \end{bmatrix} = \begin{bmatrix} 4\cdot1 + 0\cdot0 & 4\cdot2 + 0\cdot3 \\ 5\cdot1 + 6\cdot0 & 5\cdot2 + 6\cdot3 \end{bmatrix} = \begin{bmatrix} 4 & 8 \\ 5 & 28 \end{bmatrix}
$$
$$
\text{tr}(BA) = 4 + 28 = 32.
$$

结论：$\text{tr}(AB) = 32 = \text{tr}(BA)$，性质得证。

**代码验证**：
```python
A = np.array([[1, 2], [0, 3]])
B = np.array([[4, 0], [5, 6]])

trace_AB = np.trace(A @ B)
trace_BA = np.trace(B @ A)

print(f"练习 2 结果：tr(AB)={trace_AB}, tr(BA)={trace_BA}, 相等={trace_AB == trace_BA}")
# 预期输出：tr(AB)=32, tr(BA)=32, 相等=True
```

**3. 特征值之和与迹的关系**

**解答过程**：
矩阵为 $C = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$。

1. **计算迹**：
   $$
   \text{tr}(C) = 2 + 2 = 4.
   $$

2. **计算特征值**：
   求解特征方程 $\det(C - \lambda I) = 0$：
   $$
   \det \begin{bmatrix} 2-\lambda & 1 \\ 1 & 2-\lambda \end{bmatrix} = (2-\lambda)^2 - 1 = 0
   $$
   $$
   (2-\lambda)^2 = 1 \implies 2-\lambda = \pm 1
   $$
   解得：
   $$
   \lambda_1 = 2 - 1 = 1, \quad \lambda_2 = 2 + 1 = 3.
   $$

3. **验证和**：
   $$
   \lambda_1 + \lambda_2 = 1 + 3 = 4.
   $$
   这与 $\text{tr}(C) = 4$ 相等。

**代码验证**：
```python
C = np.array([[2, 1], [1, 2]])
eigenvalues = np.linalg.eigvals(C)
trace_C = np.trace(C)
sum_eigenvalues = np.sum(eigenvalues)

print(f"练习 3 结果：迹={trace_C}, 特征值之和={sum_eigenvalues}")
# 预期输出：迹=4.0, 特征值之和=4.0 (注意浮点数精度)
```

**4. 挑战：协方差矩阵的迹与总方差**

**解答过程**：
假设我们有一个随机向量 $\mathbf{X} = [X_1, X_2, \dots, X_n]^T$。
协方差矩阵 $\Sigma$ 的定义为 $\Sigma_{ij} = \text{Cov}(X_i, X_j)$。
特别地，对角线元素 $\Sigma_{ii} = \text{Cov}(X_i, X_i) = \text{Var}(X_i)$，即第 $i$ 个变量的方差。

总方差定义为所有变量方差的总和：
$$
\text{Total Variance} = \sum_{i=1}^n \text{Var}(X_i) = \sum_{i=1}^n \Sigma_{ii}.
$$
根据迹的定义，$\text{tr}(\Sigma) = \sum_{i=1}^n \Sigma_{ii}$。
因此，$\text{Total Variance} = \text{tr}(\Sigma)$。

**代码验证**：
```python
# 生成一些随机数据来模拟
np.random.seed(42)
data = np.random.randn(100, 3)  # 100 个样本，3 个特征

# 计算协方差矩阵 (rowvar=False 表示每列是一个特征)
cov_matrix = np.cov(data, rowvar=False)

# 计算总方差 (各特征方差之和)
variances = np.var(data, axis=0, ddof=1) # ddof=1 与 np.cov 默认行为一致
total_variance_manual = np.sum(variances)

# 计算协方差矩阵的迹
total_variance_trace = np.trace(cov_matrix)

print(f"练习 4 结果：手动计算总方差={total_variance_manual:.4f}, 迹={total_variance_trace:.4f}")
# 预期输出：两者数值非常接近
```