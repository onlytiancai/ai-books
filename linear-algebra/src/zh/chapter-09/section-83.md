### 83. 与特征分解的关系

奇异值分解（SVD）常被介绍为一个全新的概念，但实际上它与特征分解（Eigen-Decomposition）有着深刻的联系。事实上，奇异值和奇异向量源于由 $A$ 构造的某些对称矩阵的特征分解。理解这种联系不仅能解释为什么 SVD 总是存在、为什么奇异值是非负的，还能说明它是如何将特征分析推广到所有矩阵（甚至是矩形矩阵）上的。

#### 特征分解回顾

对于一个方阵 $M \in \mathbb{R}^{n \times n}$，其特征分解形式为：

$$
M = X \Lambda X^{-1},
$$

其中 $\Lambda$ 是由特征值组成的对角矩阵，$X$ 的列是对应的特征向量。

然而，特征分解存在局限性：

- 并非所有矩阵都可对角化。
- 特征值可能是复数。
- 矩形矩阵根本没有特征值。

这正是 SVD 提供通用框架的地方。

#### 从 $A^T A$ 到奇异值

对于任意 $m \times n$ 矩阵 $A$：

1. 考虑对称且半正定的矩阵 $A^T A \in \mathbb{R}^{n \times n}$。

   - 对称性确保所有特征值都是实数。
   - 半正定性确保它们是非负的。

2. $A^T A$ 的特征值是 $A$ 的奇异值的平方：

   $$
   \lambda_i(A^T A) = \sigma_i^2.
   $$

3. $A^T A$ 的特征向量即为右奇异向量 $v_i$。

4. 类似地，对于 $AA^T$，特征值同样是 $\sigma_i^2$，而特征向量是左奇异向量 $u_i$。

因此：

$$
Av_i = \sigma_i u_i, \quad A^T u_i = \sigma_i v_i.
$$

这组关系将特征分解与 SVD 紧密绑定在一起。

> **注意**：这里的关键在于 $A^T A$ 和 $AA^T$ 总是对称半正定的，因此它们的特征分解总是存在且性质良好，从而保证了 SVD 的存在性。

#### 为什么特征分解不够用

- 特征分解要求矩阵必须是方阵。SVD 适用于矩形矩阵。
- 特征值可能是负数或复数；奇异值始终是实数且非负。
- 特征向量可能无法构成完整的基；奇异向量总是构成标准正交基。

简而言之，SVD 提供了特征分解所缺乏的稳健性。

#### 示例

设

$$
A = \begin{bmatrix}3 & 0 \\ 4 & 0 \\ 0 & 5\end{bmatrix}.
$$

1. 计算 $A^T A = \begin{bmatrix}25 & 0 \\ 0 & 25\end{bmatrix}$。

   - 特征值：$25, 25$。
   - 奇异值：$\sigma_1 = \sigma_2 = 5$。

2. 右奇异向量是 $A^T A$ 的特征向量。在这里，它们构成了标准基。

3. 左奇异向量来自 $Av_i / \sigma_i$。

因此，SVD 的几何结构完全编码在 $A^T A$ 和 $AA^T$ 的特征分析中。

我们可以使用 Python 来验证这一计算过程：

```python
import numpy as np

# 定义矩阵 A
A = np.array([[3, 0], 
              [4, 0], 
              [0, 5]])

# 1. 计算 A^T A
AtA = A.T @ A
print("A^T A =\n", AtA)

# 2. 计算 A^T A 的特征值和特征向量
eigenvals, eigenvecs = np.linalg.eig(AtA)
print("A^T A 的特征值:", eigenvals)
print("A^T A 的特征向量 (右奇异向量):\n", eigenvecs)

# 3. 直接计算 A 的 SVD
U, S, Vt = np.linalg.svd(A)
print("奇异值:", S)
print("右奇异向量 (V^T):\n", Vt)

# 验证关系：奇异值的平方应等于 A^T A 的特征值
print("奇异值的平方:", S**2)
```

#### 几何图像

- $A^T A$ 的特征向量描述了输入空间中的方向，在这些方向上 $A$ 只进行拉伸而不混合方向。
- $AA^T$ 的特征向量描述了输出空间中对应的方向。
- 奇异值告诉我们拉伸了多少。

因此，SVD 本质上是伪装后的特征分解——但应用于正确的对称 companion 矩阵。

#### 日常类比

- **房间里的回声**：特征分解研究振动如何在房间的几何结构内行为。SVD 研究输入（声波）和输出（你听到的声音），并通过匹配的方向将它们联系起来。
- **团队合作类比**：特征分解告诉你团队内部的优势。SVD 告诉你当实际执行任务时，这些优势如何显现。
- **投影屏幕**：特征分解显示投影仪镜头的内部稳定性；SVD 显示输入图像如何转化为墙上被拉伸或压缩的投影。

#### 联系的应用

1. **PCA（主成分分析）**：数据协方差矩阵 $X^T X$ 使用特征分解，但 PCA 通常直接使用 SVD 实现。
2. **数值方法**：SVD 算法依赖于 $A^T A$ 的特征分析。
3. **稳定性分析**：这种关系确保奇异值是条件数的可靠度量。
4. **信号处理**：信号中的功率（方差）由协方差的特征值解释，这与奇异值相连。
5. **机器学习**：核 PCA 及相关方法依赖这种联系来处理非线性特征。

#### 为什么这很重要

- SVD 用正交基和缩放解释了每一个矩阵变换。
- 它与特征分解的关系确保 SVD 不是一个外来工具，而是一个推广。
- 特征视角展示了为什么 SVD 保证存在，以及为什么奇异值总是实数且非负。

#### 动手试一试

1. 证明如果 $v$ 是 $A^T A$ 的特征向量且特征值为 $\lambda$，那么 $Av$ 要么为零，要么是 $A$ 的左奇异向量，其奇异值为 $\sqrt{\lambda}$。
2. 对于矩阵

   $$
   A = \begin{bmatrix}1 & 2 \\ 2 & 1\end{bmatrix},
   $$

   计算其特征分解和 SVD。比较结果。
3. 证明 $A^T A$ 和 $AA^T$ 总是共享相同的非零特征值。
4. **挑战**：解释为什么 $A^T A$ 的正交对角化足以保证 $A$ 的完整 SVD 存在。

#### 参考答案与解析

**1. 证明题解答**

**证明：**
已知 $v$ 是 $A^T A$ 的特征向量，特征值为 $\lambda$，即：
$$
A^T A v = \lambda v.
$$
我们要考察向量 $Av$ 的性质。考虑 $AA^T$ 作用在 $Av$ 上：
$$
AA^T (Av) = A (A^T A v) = A (\lambda v) = \lambda (Av).
$$
这表明 $Av$ 是矩阵 $AA^T$ 的特征向量，对应的特征值也是 $\lambda$。

根据 SVD 的定义，$AA^T$ 的特征向量是左奇异向量 $u$，且其特征值等于奇异值的平方 $\sigma^2$。
因此，$\lambda = \sigma^2$，即 $\sigma = \sqrt{\lambda}$。
若 $\lambda > 0$，则 $Av \neq 0$，此时 $u = \frac{Av}{\|Av\|} = \frac{Av}{\sqrt{\lambda}} = \frac{Av}{\sigma}$ 是单位左奇异向量。
若 $\lambda = 0$，则 $Av = 0$。

**结论**：$Av$ 要么为零（当 $\lambda=0$），要么指向左奇异向量的方向，其长度缩放因子为 $\sqrt{\lambda}$。

---

**2. 计算与比较解答**

**步骤 1：特征分解**
矩阵 $A = \begin{bmatrix}1 & 2 \\ 2 & 1\end{bmatrix}$ 是对称矩阵。
特征方程为 $\det(A - \lambda I) = (1-\lambda)^2 - 4 = 0$。
解得 $\lambda_1 = 3, \lambda_2 = -1$。

- 对于 $\lambda_1 = 3$：$(A - 3I)x = 0 \Rightarrow \begin{bmatrix}-2 & 2 \\ 2 & -2\end{bmatrix}x = 0$，特征向量 $x_1 = \begin{bmatrix}1 \\ 1\end{bmatrix}$，归一化得 $\frac{1}{\sqrt{2}}\begin{bmatrix}1 \\ 1\end{bmatrix}$。
- 对于 $\lambda_2 = -1$：$(A + I)x = 0 \Rightarrow \begin{bmatrix}2 & 2 \\ 2 & 2\end{bmatrix}x = 0$，特征向量 $x_2 = \begin{bmatrix}1 \\ -1\end{bmatrix}$，归一化得 $\frac{1}{\sqrt{2}}\begin{bmatrix}1 \\ -1\end{bmatrix}$。

特征分解为 $A = X \Lambda X^{-1}$，其中 $\Lambda = \text{diag}(3, -1)$。

**步骤 2：奇异值分解 (SVD)**
计算 $A^T A = A^2$（因为 $A$ 对称）：
$$
A^T A = \begin{bmatrix}1 & 2 \\ 2 & 1\end{bmatrix}\begin{bmatrix}1 & 2 \\ 2 & 1\end{bmatrix} = \begin{bmatrix}5 & 4 \\ 4 & 5\end{bmatrix}.
$$
$A^T A$ 的特征值为 $\mu_1 = 9, \mu_2 = 1$。
奇异值为 $\sigma_1 = \sqrt{9} = 3, \sigma_2 = \sqrt{1} = 1$。
注意：奇异值必须非负，而特征值可以是负数（如 $\lambda_2 = -1$）。

右奇异向量 $V$ 是 $A^T A$ 的特征向量（与 $A$ 的特征向量相同，因为 $A$ 对称）：
$v_1 = \frac{1}{\sqrt{2}}\begin{bmatrix}1 \\ 1\end{bmatrix}, v_2 = \frac{1}{\sqrt{2}}\begin{bmatrix}1 \\ -1\end{bmatrix}$。

左奇异向量 $U$ 由 $u_i = \frac{1}{\sigma_i} A v_i$ 计算：
- $u_1 = \frac{1}{3} A v_1 = \frac{1}{3} (3 v_1) = v_1$。
- $u_2 = \frac{1}{1} A v_2 = \frac{1}{1} (-1 v_2) = -v_2$。

**比较结果：**
- **特征值**：$3, -1$。**奇异值**：$3, 1$。奇异值取了特征值的绝对值。
- **向量**：对于对称矩阵，奇异向量与特征向量方向相同或相反。当特征值为负时，对应的左奇异向量 $u_i$ 与右奇异向量 $v_i$ 方向相反（如 $u_2 = -v_2$），从而在 $A = U \Sigma V^T$ 中通过符号调整吸收负号，保证 $\Sigma$ 非负。

**Python 验证代码：**

```python
import numpy as np

A = np.array([[1, 2], [2, 1]])

# 特征分解
w, v = np.linalg.eig(A)
print("特征值:", w)
print("特征向量:\n", v)

# SVD
U, S, Vt = np.linalg.svd(A)
print("奇异值:", S)
print("左奇异向量 U:\n", U)
print("右奇异向量 V^T:\n", Vt)
```

---

**3. 证明题解答**

**证明：**
设 $\lambda \neq 0$ 是 $A^T A$ 的一个特征值，$v$ 是对应的特征向量。
$$
A^T A v = \lambda v.
$$
两边左乘 $A$：
$$
A (A^T A v) = A (\lambda v) \implies (A A^T) (A v) = \lambda (A v).
$$
令 $u = Av$。因为 $\lambda \neq 0$ 且 $v \neq 0$，若 $Av = 0$，则 $A^T A v = 0 \implies \lambda v = 0$，矛盾。所以 $u = Av \neq 0$。
上式表明 $u$ 是 $AA^T$ 的特征向量，对应的特征值也是 $\lambda$。

同理，若 $\mu$ 是 $AA^T$ 的非零特征值，也可证明它是 $A^T A$ 的特征值。
**结论**：$A^T A$ 和 $AA^T$ 拥有完全相同的非零特征值集合。

---

**4. 挑战题解答**

**解释：**
SVD 的核心在于找到正交矩阵 $U, V$ 和对角矩阵 $\Sigma$ 使得 $A = U \Sigma V^T$。这等价于 $A^T A = V \Sigma^2 V^T$。

1. **对称矩阵的性质**：$A^T A$ 是实对称矩阵。根据谱定理（Spectral Theorem），实对称矩阵一定可以被正交对角化。即存在正交矩阵 $V$ 和对角矩阵 $D$ 使得 $A^T A = V D V^T$。
2. **非负性**：$A^T A$ 是半正定的，因此对角矩阵 $D$ 中的元素（特征值）都是非负实数。我们可以令 $\Sigma = \sqrt{D}$（对对角元素开方）。
3. **构造 U**：一旦有了 $V$ 和 $\Sigma$，我们可以定义 $U$ 的列向量为 $u_i = \frac{1}{\sigma_i} A v_i$（对于 $\sigma_i > 0$）。对于 $\sigma_i = 0$ 的部分，可以通过扩展正交基来完成 $U$ 的构造。
4. **存在性保证**：因为实对称矩阵的正交对角化总是存在的，所以基于此构造的 $V$ 和 $\Sigma$ 总是存在的，进而保证了 $U$ 的存在性。

**结论**：$A^T A$ 的正交对角化提供了 SVD 所需的右奇异向量基 $V$ 和奇异值平方 $\Sigma^2$，这是 SVD 存在性的理论基石。