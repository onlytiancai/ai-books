### 87. 条件数与敏感性（误差如何放大）

线性代数不仅仅关乎寻找精确解，更关乎当数据受到扰动时，这些解的*稳定性*如何。在实际应用中，每个数据集都包含噪声：物理实验中的测量误差、金融计算中的舍入误差，或数值软件中的浮点数精度限制。**条件数（Conditioning）** 研究的是问题的解对输入微小变化的敏感程度。一个**良态（well-conditioned）** 的问题对扰动反应温和；而一个**病态（ill-conditioned）** 的问题则会 dramatically 放大误差。

#### 基本思想

假设我们要解线性方程组：

$$
Ax = b.
$$

现在想象我们将 $b$ 轻微改变为 $b + \delta b$。新的解变为 $x + \delta x$。

- 如果 $\|\delta x\|$ 的大小与 $\|\delta b\|$ 差不多，则该问题是良态的。
- 如果 $\|\delta x\|$ 大得多，则该问题是病态的。

条件数衡量的正是这种放大因子。

> **注意**：这里的范数 $\|\cdot\|$ 可以是向量范数或矩阵范数，通常我们关注相对误差 $\frac{\|\delta x\|}{\|x\|}$ 与 $\frac{\|\delta b\|}{\|b\|}$ 之间的关系。

#### 条件数

核心工具是矩阵 $A$ 的条件数：

$$
\kappa(A) = \|A\| \cdot \|A^{-1}\|,
$$

其中 $\|\cdot\|$ 是矩阵范数（通常是 2-范数）。

- 如果 $\kappa(A)$ 接近 1，问题是良态的。
- 如果 $\kappa(A)$ 很大（例如 $10^6$ 或更高），问题是病态的。

**解释**：

- $\kappa(A)$ 估计了相对于数据相对误差的解的最大相对误差。
- 实际上，如果 $\kappa(A)$ 太大，$b$ 中的每一位精度都可能在 $x$ 中丢失。

> **提示**：在 Python 的 `numpy` 中，可以使用 `numpy.linalg.cond(A)` 直接计算条件数。

#### 奇异值与条件数

2-范数下的条件数可以用奇异值表示：

$$
\kappa(A) = \frac{\sigma_{\max}}{\sigma_{\min}},
$$

其中 $\sigma_{\max}$ 和 $\sigma_{\min}$ 分别是 $A$ 的最大和最小奇异值。

- 如果最小奇异值与最大奇异值相比非常小，$A$ 在某些方向上几乎 collapse（坍缩），使得求逆不稳定。
- 这解释了为什么接近奇异的矩阵在数值计算中如此棘手。

#### 示例 1：稳定系统

$$
A = \begin{bmatrix}2 & 0 \\ 0 & 3\end{bmatrix}.
$$

这里，$\sigma_{\max} = 3, \sigma_{\min} = 2$。
所以 $\kappa(A) = 3/2 = 1.5$。非常良态：输入的微小变化只会产生输出的微小变化。

#### 示例 2：病态系统

$$
A = \begin{bmatrix}1 & 1 \\ 1 & 1.0001\end{bmatrix}.
$$

行列式非常小，因此系统接近奇异。

- 一个奇异值约为 2.0。
- 另一个约为 0.0001。
- 条件数：$\kappa(A) \approx 20000$。

这意味着即使 $b$ 发生微小变化，$x$ 也可能发生剧烈变化。

```python
import numpy as np

# 演示示例 2 的条件数计算
A = np.array([[1, 1], [1, 1.0001]])
cond_number = np.linalg.cond(A)
print(f"矩阵 A 的条件数：{cond_number:.2f}")

# 演示敏感性
b1 = np.array([2, 2.0001])
b2 = np.array([2, 2.0002])  # b 的微小变化

x1 = np.linalg.solve(A, b1)
x2 = np.linalg.solve(A, b2)

print(f"b 的变化量：{np.linalg.norm(b2 - b1):.2e}")
print(f"x 的变化量：{np.linalg.norm(x2 - x1):.2f}")
```

#### 几何直观

矩阵将单位球变换为椭球。

- 椭球的最长轴 = $\sigma_{\max}$。
- 椭球的最短轴 = $\sigma_{\min}$。
- 比率 $\sigma_{\max} / \sigma_{\min}$ 显示了变换的拉伸程度。

如果椭球几乎扁平，与短轴对齐的方向几乎消失，恢复这些方向高度不稳定。

#### 生活类比

- **嘈杂房间里的耳语**：如果信号比背景噪声弱得多，任何信息都会被淹没。这就是病态系统。
- **手指上平衡扫帚**：微小的晃动会导致大幅度的移动——敏感、不稳定、病态。
- **地图**：扭曲的地图拉伸了一些区域（测量良好）并压缩了其他区域（表示不佳）。这就是几何中的条件数。

#### 为什么条件数在计算中很重要

1. **数值精度**：计算机存储数字的精度有限（浮点数）。病态系统会放大舍入误差，导致结果不可靠。
2. **回归分析**：在统计学中，高度相关的特征使得设计矩阵病态， destabilizing 系数估计。
3. **机器学习**：病态性导致训练不稳定，梯度爆炸或消失。
4. **工程**：基于病态模型的控制系统可能对测量误差过度敏感。

#### 处理病态性的技术

- **正则化（Regularization）**：添加惩罚项，如岭回归（$\lambda I$），以稳定求逆。
- **截断 SVD**：忽略仅放大噪声的微小奇异值。
- ** scaling 和预处理**：重新缩放数据或乘以精心选择的矩阵以改善条件数。
- **避免显式求逆**：使用分解（LU、QR、SVD）而不是计算 $A^{-1}$。

#### 与之前主题的联系

- **伪逆**：当奇异值接近零时，病态性变得可见，使得 $A^+$ 不稳定。
- **低秩近似**：截断小奇异值既压缩了数据又改善了条件数。
- **PCA**：丢弃低方差成分本质上是一种改善条件数的步骤。

#### 为什么它很重要

条件数架起了抽象代数与数值现实之间的桥梁。线性代数承诺了解的存在，但条件数告诉我们这些解是否值得信赖。没有它，人们可能会将噪声误认为信号，或在看似正常的计算中失去所有精度。

#### 动手试一试

1. 计算 $\begin{bmatrix}1 & 1 \\ 1 & 1.0001\end{bmatrix}$ 的条件数。针对几个略微不同的 $b$ 求解 $Ax = b$ 中的 $x$。观察解如何剧烈波动。
2. 取一个具有近乎共线特征的数据集。计算其协方差矩阵的条件数。将其与回归系数的不稳定性联系起来。
3. 模拟数值误差：向病态系统添加大小为 $10^{-6}$ 的随机噪声，观察解的误差。
4. 证明 $\kappa(A) \geq 1$ 恒成立。

#### 练习题解答与代码演示

##### 1. 病态矩阵的敏感性实验

**解答过程**：
我们需要构造矩阵 $A$，计算其条件数，然后改变 $b$ 观察 $x$ 的变化。

```python
import numpy as np

# 定义病态矩阵
A = np.array([[1, 1], [1, 1.0001]])

# 1. 计算条件数
cond_A = np.linalg.cond(A)
print(f"1. 条件数 kappa(A) = {cond_A:.2f}")

# 2. 定义基准 b 和扰动后的 b
b_original = np.array([2, 2.0001])
delta_b = np.array([0, 0.0001]) # 微小的扰动
b_perturbed = b_original + delta_b

# 3. 求解
x_original = np.linalg.solve(A, b_original)
x_perturbed = np.linalg.solve(A, b_perturbed)

# 4. 计算相对变化
rel_change_b = np.linalg.norm(delta_b) / np.linalg.norm(b_original)
rel_change_x = np.linalg.norm(x_perturbed - x_original) / np.linalg.norm(x_original)

print(f"b 的相对变化：{rel_change_b:.2e}")
print(f"x 的相对变化：{rel_change_x:.2e}")
print(f"放大倍数约为：{rel_change_x / rel_change_b:.2f}")
```

**结果分析**：
运行上述代码，你会发现 $b$ 的相对变化非常小（约 $10^{-5}$ 量级），但 $x$ 的相对变化非常大。放大倍数接近条件数 $\kappa(A)$。这直观地展示了病态系统如何放大输入误差。

##### 2. 共线特征与协方差矩阵

**解答过程**：
构造两个几乎完全相关的特征向量，计算协方差矩阵的条件数。

```python
import numpy as np

# 生成近乎共线的数据
np.random.seed(42)
n_samples = 100
x1 = np.random.randn(n_samples)
x2 = x1 + 1e-4 * np.random.randn(n_samples) # x2 几乎等于 x1

X = np.column_stack((x1, x2))

# 计算协方差矩阵
cov_matrix = np.cov(X.T)

# 计算条件数
cond_cov = np.linalg.cond(cov_matrix)
print(f"2. 协方差矩阵条件数：{cond_cov:.2e}")

# 尝试线性回归 (y = X beta + noise)
y = 2 * x1 + 3 * x2 + 0.1 * np.random.randn(n_samples)
# 使用正规方程求解 beta = (X^T X)^{-1} X^T y
# 注意 X^T X 与协方差矩阵成比例，同样病态
try:
    beta = np.linalg.solve(X.T @ X, X.T @ y)
    print(f"回归系数：{beta}")
except np.linalg.LinAlgError:
    print("矩阵奇异，无法直接求逆")
```

**结果分析**：
由于 $x_1$ 和 $x_2$ 高度共线，协方差矩阵接近奇异，条件数非常大（通常 $>10^{10}$）。这会导致回归系数 $\beta$ 的估计值方差极大，即使数据微小变化，系数也会剧烈波动，这就是多重共线性问题的本质。

##### 3. 模拟数值噪声

**解答过程**：
在病态系统中加入微小噪声，对比真实解与计算解。

```python
import numpy as np

A = np.array([[1, 1], [1, 1.0001]])
x_true = np.array([1, 1])
b_true = A @ x_true

# 添加噪声到 b
noise = 1e-6 * np.random.randn(2)
b_noisy = b_true + noise

# 求解
x_computed = np.linalg.solve(A, b_noisy)

# 误差
error = np.linalg.norm(x_computed - x_true)
print(f"3. 输入噪声大小：{np.linalg.norm(noise):.2e}")
print(f"解的误差大小：{error:.2f}")
```

**结果分析**：
尽管噪声只有 $10^{-6}$ 级别，但由于条件数约为 $20000$，解的误差可能被放大到 $10^{-2}$ 甚至更大级别。这验证了误差放大理论：$\frac{\|\delta x\|}{\|x\|} \leq \kappa(A) \frac{\|\delta b\|}{\|b\|}$。

##### 4. 证明 $\kappa(A) \geq 1$

**解答过程**：
我们需要利用矩阵范数的相容性（次乘性）性质。

**证明**：
根据条件数的定义：
$$
\kappa(A) = \|A\| \cdot \|A^{-1}\|
$$
对于任何相容的矩阵范数，满足次乘性性质：$\|XY\| \leq \|X\| \cdot \|Y\|$。
考虑单位矩阵 $I = A A^{-1}$。
我们知道对于任何诱导范数，$\|I\| = 1$。
因此：
$$
1 = \|I\| = \|A A^{-1}\| \leq \|A\| \cdot \|A^{-1}\|
$$
即：
$$
1 \leq \kappa(A)
$$
**证毕**。

> **注意**：这个不等式说明条件数最小值为 1（正交矩阵达到此下界），不可能小于 1。条件数越大，矩阵越接近奇异。