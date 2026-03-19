### 89. 正则化（岭回归/Tikhonov 正则化以抑制不稳定性）

在求解线性系统或回归问题时，不稳定性往往源于系统是**病态的（ill-conditioned）**：数据中的微小误差会导致解的巨大波动。**正则化（Regularization）** 是一种通过刻意修改问题来*增加稳定性*的策略，它牺牲了精确性以换取鲁棒性。最常见的两种方法——岭回归（Ridge Regression）和吉洪诺夫正则化（Tikhonov Regularization）——都体现了这一原则。

#### 不稳定性问题

考虑最小二乘问题：

$$
\min_x \|Ax - b\|_2^2.
$$

如果 $A$ 的列几乎线性相关，或者最小奇异值 $\sigma_{\min}(A)$ 非常小，那么：

- 解是不稳定的。
- 系数 $x$ 的量级可能会爆炸式增长。
- 预测值会随 $b$ 的微小变化而剧烈波动。

正则化通过修改目标函数，使解更倾向于稳定性而非绝对的精确拟合。

#### 岭回归 / 吉洪诺夫正则化

修改后的问题形式为：

$$
\min_x \big( \|Ax - b\|_2^2 + \lambda \|x\|_2^2 \big),
$$

其中 $\lambda > 0$ 是正则化参数。

- 第一项强制数据拟合。
- 第二项惩罚大系数，从而抑制不稳定的解。

这在统计学中称为**岭回归**，在数值分析中称为**吉洪诺夫正则化**。

> **注意**：$\lambda$ 的选择至关重要。$\lambda$ 太小无法抑制噪声，$\lambda$ 太大则会导致欠拟合（解过于接近零）。

#### 闭式解

展开目标函数并求导，可得闭式解：

$$
x_\lambda = (A^T A + \lambda I)^{-1} A^T b.
$$

关键点：

- 添加的 $\lambda I$ 使得矩阵即使 in $A^T A$ 奇异时也是可逆的。
- 当 $\lambda \to 0$ 时，解趋近于普通最小二乘解。
- 当 $\lambda \to \infty$ 时，解收缩趋近于 0。

下面我们通过 Python 代码来直观感受正则化项 $\lambda I$ 如何改善矩阵的条件数：

```python
import numpy as np

# 构造一个病态矩阵 A
A = np.array([[1, 1], [1, 1.0001]])
lambda_val = 0.01

# 计算 A^T A 的条件数
ATA = A.T @ A
cond_ATA = np.linalg.cond(ATA)

# 计算正则化后的矩阵 (A^T A + lambda * I) 的条件数
ATA_reg = ATA + lambda_val * np.eye(2)
cond_ATA_reg = np.linalg.cond(ATA_reg)

print(f"原始 A^T A 的条件数：{cond_ATA:.2e}")
print(f"正则化后矩阵的条件数：{cond_ATA_reg:.2e}")
# 输出显示正则化显著降低了条件数，提高了数值稳定性
```

#### 奇异值分解（SVD）视角

如果 $A = U \Sigma V^T$，则最小二乘解为：

$$
x = \sum_i \frac{u_i^T b}{\sigma_i} v_i.
$$

如果 $\sigma_i$ 非常小，项 $\frac{1}{\sigma_i}$ 会导致不稳定性。

引入正则化后：

$$
x_\lambda = \sum_i \frac{\sigma_i}{\sigma_i^2 + \lambda} (u_i^T b) v_i.
$$

- 小奇异值（不稳定方向）被抑制。
- 大奇异值（稳定方向）大部分被保留。

这解释了岭回归为何能稳定解：它 dampers（阻尼）了那些会放大噪声的方向。

> **提示**：因子 $\frac{\sigma_i}{\sigma_i^2 + \lambda}$ 被称为滤波因子。当 $\sigma_i \gg \sqrt{\lambda}$ 时接近 1，当 $\sigma_i \ll \sqrt{\lambda}$ 时接近 0。

#### 几何解释

- 未正则化的问题试图在 $A$ 的列空间中精确拟合 $b$。
- 正则化将解向原点倾斜，收缩系数。
- 几何上，可行域（来自 $Ax$ 的椭球）与来自 $\|x\|_2$ 的球约束相交。解是这两个形状平衡的位置。

#### 日常类比

- **冰面驾驶**：没有正则化时，汽车对微小的方向盘转动反应剧烈。有了正则化，转向被阻尼，保持控制。
- **平衡投资**：单纯追求回报（拟合）会导致脆弱的投资组合。正则化就像风险管理，偏好稳定的结果。
- **调吉他**：没有阻尼，琴弦会不可控地共振。添加阻尼器会产生更干净、可控的声音。

#### 扩展形式

1. **Lasso（$\ell_1$ 正则化）**：将 $\|x\|_2^2$ 替换为 $\|x\|_1$，鼓励稀疏解（许多系数变为 exact 0）。
2. **弹性网络（Elastic Net）**：结合岭回归和 Lasso 的惩罚项。
3. **广义吉洪诺夫**：使用 $\|Lx\|_2^2$ 配合某个矩阵 $L$，定制惩罚项（例如信号处理中的平滑约束）。
4. **贝叶斯视角**：岭回归对应于对系数放置高斯先验。

#### 应用场景

- **机器学习**：防止回归和分类中的过拟合。
- **信号处理**： reconstruct 信号时抑制噪声。
- **图像重建**：稳定反问题，如去模糊。
- **数值偏微分方程**：为解添加平滑约束。
- **计量经济学与金融**：控制高度相关变量带来的不稳定性。

#### 为什么它很重要

正则化将脆弱的问题转化为可靠的问题。它承认了噪声和有限精度的现实，不再追求不可能的精确性，而是提供可用、稳定的答案。在现代数据驱动领域，几乎每个大规模模型都依赖正则化来保证鲁棒性。

#### 动手试一试 (Try It Yourself)

1. 求解系统 $Ax = b$，其中

   $$
   A = \begin{bmatrix}1 & 1 \\ 1 & 1.0001\end{bmatrix}, \quad b = \begin{bmatrix}2 \\ 2\end{bmatrix}.
   $$

   比较未正则化的最小二乘解与 $\lambda = 0.01, 1, 10$ 时的岭正则化解。
2. 利用 SVD，展示小奇异值对应的系数是如何被收缩的。
3. 在具有许多相关特征的回归中，计算系数路径随 $\lambda$ 变化的情况。观察它们如何稳定。
4. 探索图像去噪：将岭正则化应用于模糊/噪声图像重建问题。

---

#### 练习题解答与解析

##### 1. 病态系统求解与正则化对比

**解答过程：**

首先计算未正则化（$\lambda=0$）的解。由于 $A$ 是可逆方阵，最小二乘解即为精确解 $x = A^{-1}b$。
$A$ 的行列式为 $\det(A) = 1 \times 1.0001 - 1 \times 1 = 0.0001$。
逆矩阵为：
$$
A^{-1} = \frac{1}{0.0001} \begin{bmatrix}1.0001 & -1 \\ -1 & 1\end{bmatrix} = \begin{bmatrix}10001 & -10000 \\ -10000 & 10000\end{bmatrix}.
$$
解为：
$$
x = \begin{bmatrix}10001 & -10000 \\ -10000 & 10000\end{bmatrix} \begin{bmatrix}2 \\ 2\end{bmatrix} = \begin{bmatrix}2 \\ 0\end{bmatrix}.
$$
虽然在这个特定 $b$ 下解看起来正常，但如果 $b$ 有微小扰动（例如 $b=[2, 2.0001]^T$），解将变为 $[1, 1]^T$，变化巨大，体现了不稳定性。

对于正则化解，公式为 $x_\lambda = (A^T A + \lambda I)^{-1} A^T b$。
我们可以使用 Python 计算不同 $\lambda$ 下的数值结果：

```python
import numpy as np

A = np.array([[1, 1], [1, 1.0001]])
b = np.array([2, 2])
lambdas = [0, 0.01, 1, 10]

print(f"{'Lambda':<10} | {'x1':<10} | {'x2':<10} | {'||x||':<10}")
print("-" * 45)

for lam in lambdas:
    if lam == 0:
        # 普通最小二乘 (使用伪逆以防奇异，此处 A 可逆)
        x = np.linalg.solve(A, b)
    else:
        # 岭回归解
        ATA = A.T @ A
        reg_matrix = ATA + lam * np.eye(2)
        ATb = A.T @ b
        x = np.linalg.solve(reg_matrix, ATb)
    
    norm_x = np.linalg.norm(x)
    print(f"{lam:<10.2f} | {x[0]:<10.4f} | {x[1]:<10.4f} | {norm_x:<10.4f}")
```

**预期结果分析：**
- $\lambda = 0$: $x \approx [2.0000, 0.0000]^T$。
- $\lambda = 0.01$: 解开始轻微收缩，例如 $x \approx [1.99, -0.01]^T$（具体值取决于计算精度）。
- $\lambda = 1$: 解显著收缩，系数变小。
- $\lambda = 10$: 解非常接近 $[0, 0]^T$。

**结论**：随着 $\lambda$ 增大，解的范数 $\|x\|_2$ 单调减小，稳定性增强，但对原始数据的拟合度下降。

##### 2. 利用 SVD 展示系数收缩

**解答过程：**

设 $A = U \Sigma V^T$。普通最小二乘解在 $V$ 基下的坐标为 $c_i = \frac{u_i^T b}{\sigma_i}$。
正则化后的坐标为 $c_{i,\lambda} = \frac{\sigma_i}{\sigma_i^2 + \lambda} (u_i^T b)$。

收缩因子为：
$$
\text{Factor} = \frac{\sigma_i}{\sigma_i^2 + \lambda} \cdot \sigma_i = \frac{\sigma_i^2}{\sigma_i^2 + \lambda}.
$$
(注意：这里对比的是系数幅度，原始系数含 $1/\sigma_i$，正则化系数含 $\frac{\sigma_i}{\sigma_i^2+\lambda}$)。

更直观地比较放大倍数：
- 未正则化放大倍数：$1/\sigma_i$
- 正则化放大倍数：$\frac{\sigma_i}{\sigma_i^2 + \lambda}$

当 $\sigma_i$ 很小时（例如 $\sigma_i \ll \sqrt{\lambda}$）：
- 未正则化：$1/\sigma_i \to \infty$ (极大)
- 正则化：$\frac{\sigma_i}{\lambda} \to 0$ (极小)

**代码验证：**

```python
U, S, Vt = np.linalg.svd(A)
# 假设某个方向奇异值很小
sigma_small = 0.0001
lambda_val = 0.1

amp_unreg = 1 / sigma_small
amp_reg = sigma_small / (sigma_small**2 + lambda_val)

print(f"小奇异值下的放大倍数 - 未正则化：{amp_unreg:.2e}")
print(f"小奇异值下的放大倍数 - 正则化：{amp_reg:.2e}")
```
**结论**：正则化有效地截断了小奇异值方向的噪声放大。

##### 3. 系数路径观察

**解答过程：**

此题旨在观察“正则化路径”。当特征高度相关时，普通最小二乘的系数方差很大。
随着 $\lambda$ 从 0 增加到很大值：
1.  系数从最小二乘估计值开始。
2.  系数平滑地向 0 收缩。
3.  相关特征的系数倾向于一起变化，而不是剧烈波动。

**Python 实现思路：**
生成一个具有相关特征的数据集（例如 $X_2 \approx X_1$），对一系列 $\lambda$ 值计算岭回归系数，并绘制 $\lambda$ vs 系数值的图。

```python
# 伪代码示例
# lambdas = np.logspace(-4, 4, 100)
# coefs = []
# for l in lambdas:
#     model = Ridge(alpha=l)
#     model.fit(X, y)
#     coefs.append(model.coef_)
# plt.plot(lambdas, coefs)
# plt.xscale('log')
```
**观察**：曲线应是平滑连续的，没有剧烈跳跃，这证明了稳定性。

##### 4. 图像去噪探索

**解答过程：**

图像重建可以看作是一个线性逆问题 $Ax = b$，其中 $b$ 是观测到的模糊/噪声图像，$x$ 是原始图像，$A$ 是模糊算子。
直接求解 $x = A^{-1}b$ 会放大高频噪声。
使用岭正则化：
$$
\min_x \|Ax - b\|_2^2 + \lambda \|x\|_2^2
$$
这相当于在频域抑制高频分量（因为模糊算子通常衰减高频，导致对应奇异值小）。

**操作建议：**
1.  加载一张灰度图作为真实图像 $x_{true}$。
2.  构造一个高斯模糊矩阵 $A$（或使用 `scipy.signal.convolve2d`）。
3.  生成观测图像 $b = A x_{true} + \text{noise}$。
4.  尝试直接反卷积（会充满噪声）。
5.  使用岭正则化公式求解，调整 $\lambda$ 直到视觉上去噪效果最佳。

**结论**：正则化在去除噪声的同时保留了图像的主要结构，而直接逆运算会产生不可接受的伪影。