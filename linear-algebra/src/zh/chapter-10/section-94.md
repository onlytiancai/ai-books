### 94. 数据预处理作为线性运算（中心化、白化、缩放）

在训练任何复杂的机器学习模型之前，原始数据必须经过预处理。令人惊讶的是，许多最常见的预处理步骤——中心化（Centering）、缩放（Scaling）、白化（Whitening）——本质上都是伪装后的线性代数运算。从这个角度理解它们，不仅能 clarifies 它们为何有效，还能揭示它们与协方差、特征值以及奇异值分解（SVD）等更广泛概念之间的联系。

#### 预处理的本质

大多数数据集都存储为矩阵形式：行对应样本（观测值），列对应特征（变量）。例如，在一个包含 1,000 人的数据集中，记录了身高、体重和年龄，我们将得到一个 $1000 \times 3$ 的矩阵。线性代数允许我们系统地重塑、缩放和旋转这个矩阵，为下游分析做好准备。

**注意**：在机器学习惯例中，通常记数据矩阵为 $X \in \mathbb{R}^{n \times d}$，其中 $n$ 是样本数，$d$ 是特征数。

#### 中心化： shifting 原点

中心化意味着从每一列（特征）的所有条目中减去该列的均值。

$$
X_{centered} = X - \mathbf{1}\mu^T
$$

- 这里 $X$ 是数据矩阵，$\mu$ 是列均值向量，$\mathbf{1}$ 是全 1 列向量。
- **效果**：移动数据集，使每个特征的均值为零。
- **几何视角**：平移点云，使其“质心”位于原点。
- **为何重要**：协方差和相关性公式假设数据是均值中心化的；否则，交叉项会发生偏斜。

**示例**：
如果人们的平均身高是 170 cm，从每个身高值中减去 170。中心化后，“身高 = 0"对应于平均身高的人。

**Python 演示：中心化**
```python
import numpy as np

# 假设 X 是原始数据矩阵 (n_samples, n_features)
X = np.random.rand(100, 3) 
# 计算列均值
mu = np.mean(X, axis=0) 
# 中心化
X_centered = X - mu 
# 验证均值是否接近 0
print(np.mean(X_centered, axis=0)) 
```

#### 缩放：归一化变异性

原始特征可能具有不同的单位或量级（例如，体重单位为 kg，收入单位为千美元）。为了公平比较它们，我们需要缩放：

$$
X_{scaled} = X D^{-1}
$$

其中 $D$ 是特征标准差构成的对角矩阵。

- 每个特征现在的方差为 1。
- **几何视角**：重新缩放坐标轴，使所有维度具有相等的“ spread "（ spread 指分布范围）。
- **机器学习中的常见用途**：确保梯度下降不会不成比例地关注具有较大原始值的特征。

**示例**：
如果体重在 60 kg ± 15 之间变化，除以 15 使其分布范围与身高（±10 cm）具有可比性。

**注意**：这种操作通常被称为“标准化”（Standardization），即 Z-score  normalization。

#### 白化：去除相关性

即使经过中心化和缩放，特征之间仍可能存在相关性（例如，身高和体重）。白化变换数据，使特征变得不相关且具有单位方差。

- 设 $\Sigma = \frac{1}{n} X^T X$ 为中心化数据的协方差矩阵。
- 进行特征分解：$\Sigma = Q \Lambda Q^T$。
- 白化变换：

$$
X_{white} = X Q \Lambda^{-1/2} Q^T
$$

**结果**：

1. $X_{white}$ 的协方差矩阵是单位矩阵。
2. 每个新特征都是旧特征的旋转组合，没有冗余。

**几何视角**：白化将数据云“球化”，把椭圆变成一个完美的圆。

**提示**：上述公式具体对应的是 ZCA 白化（Zero-phase Component Analysis），它能在去相关的同时尽可能保持数据原始的空间结构。另一种常见的 PCA 白化公式为 $X Q \Lambda^{-1/2}$，仅去相关旋转但不恢复方向。

**Python 演示：白化**
```python
# 假设 X_centered 已经是中心化数据
cov_matrix = np.cov(X_centered, rowvar=False)
# 特征分解
eigen_vals, eigen_vecs = np.linalg.eigh(cov_matrix)
# 计算白化矩阵
Lambda_inv_sqrt = np.diag(1.0 / np.sqrt(eigen_vals))
# ZCA 白化变换
X_white = X_centered @ eigen_vecs @ Lambda_inv_sqrt @ eigen_vecs.T
# 验证白化后的协方差是否接近单位矩阵
cov_white = np.cov(X_white, rowvar=False)
print(np.round(cov_white, 2))
```

#### 协方差矩阵作为关键角色

协方差矩阵本身自然地从预处理中产生：

$$
\Sigma = \frac{1}{n} X^T X \quad \text{(如果 \(X\) 是中心化的).}
$$

- **对角线条目**：特征的方差。
- **非对角线条目**：协方差，衡量线性关系。
- 预处理操作（中心化、缩放、白化）旨在重塑数据，使 $\Sigma$ 更易于解释，并对学习算法更稳定。

#### 与 PCA 的联系

- **中心化**是 PCA 之前的必需步骤，否则第一个主成分只会指向均值方向。
- **缩放**确保 PCA 不会过度加权大方差特征。
- **白化**与 PCA 本身密切相关：PCA 对角化协方差，而白化更进一步，将特征值缩放为单位值。

因此，PCA 可以看作是一个预处理管道加上一个分析步骤。

#### 实际工作流程

1. **中心化和缩放（标准化）**：许多算法（如逻辑回归或 SVM）的默认设置。
2. **白化**：常用于信号处理（例如，去除音频或图像中的相关性）。
3. **深度学习中的批归一化（Batch Normalization）**：中心化 + 缩放的变体，在训练过程中逐层应用。
4. **图像处理中的白化**：确保像素强度等特征去相关，改善压缩和识别效果。

####  worked 示例

假设我们有三个特征：身高、体重和年龄。

1. **原始数据**：
   - 平均身高 = 170 cm，平均体重 = 65 kg，平均年龄 = 35 岁。
   - 方差差异很大：年龄变化较小，体重变化较大。

2. **中心化后**：
   - 每个特征的均值为零。
   - 平均身高的人现在在该特征上的值为 0。

3. **缩放后**：
   - 所有特征具有单位方差。
   - 算法可以平等地对待年龄和体重。

4. **白化后**：
   - 身高和体重之间的相关性消失。
   - 特征成为特征空间中的正交方向。

#### 为何重要

如果没有预处理，模型可能会被 scale、单位或相关性误导。预处理使特征具有可比性、平衡性和独立性——这是依赖于几何（距离、角度、内积）的算法的关键条件。

本质上，预处理是从杂乱的真实世界数据到线性代数期望的干净结构之间的桥梁。

#### Try It Yourself

1. 对于一个小数据集，计算中心化前后的协方差矩阵。发生了什么变化？
2. 缩放数据集，使每个特征具有单位方差。检查新的协方差。
3. 通过特征分解执行白化，并验证协方差矩阵变为单位矩阵。
4. 在白化前后绘制 2D 数据点。注意椭圆如何变成圆形。

---

#### 练习题参考答案与详解

以下是针对上述练习题的详细解答过程及 Python 代码实现。

##### 1. 中心化前后的协方差矩阵

**解答思路**：
协方差矩阵的定义依赖于均值。如果数据未中心化，公式 $\frac{1}{n} X^T X$ 计算的是二阶矩矩阵，而非协方差矩阵。中心化后，均值变为 0，$\frac{1}{n} X^T X$ 才等于协方差矩阵 $\Sigma$。

**Python 验证**：
```python
import numpy as np
import matplotlib.pyplot as plt

# 生成相关数据
np.random.seed(42)
n = 100
X_raw = np.random.randn(n, 2) @ np.array([[1, 0.5], [0.5, 1]]) + np.array([10, 20])

# 计算原始数据的 "协方差" (直接用公式 1/n * X^T X，未中心化)
cov_raw_approx = (X_raw.T @ X_raw) / n
# 计算真正的协方差 (numpy 会自动先中心化)
cov_true = np.cov(X_raw, rowvar=False)

# 中心化
mu = np.mean(X_raw, axis=0)
X_centered = X_raw - mu
# 计算中心化后的 1/n * X^T X
cov_centered_approx = (X_centered.T @ X_centered) / n

print("原始数据均值:", mu)
print("未中心化直接计算 X^T X/n (非协方差):\n", cov_raw_approx)
print("numpy 计算的协方差 (已隐式中心化):\n", cov_true)
print("显式中心化后计算 X^T X/n (应等于协方差):\n", cov_centered_approx)
```
**结论**：未中心化时，$X^T X$ 包含均值信息，数值较大且不代表真实的变量间波动关系。中心化后，$\frac{1}{n} X^T X$ 与标准协方差矩阵一致。

##### 2. 缩放至单位方差

**解答思路**：
缩放即除以标准差。缩放后的数据，其对角线方差应为 1。

**Python 验证**：
```python
# 接上一题的 X_centered
std_devs = np.std(X_centered, axis=0, ddof=0) # ddof=0 对应除以 n
D_inv = np.diag(1 / std_devs)
X_scaled = X_centered @ D_inv

# 检查方差
var_scaled = np.var(X_scaled, axis=0)
cov_scaled = np.cov(X_scaled, rowvar=False)

print("缩放后的方差:", var_scaled)
print("缩放后的协方差矩阵:\n", cov_scaled)
```
**结论**：缩放后，协方差矩阵的对角线元素全部变为 1。非对角线元素变为相关系数（介于 -1 到 1 之间）。

##### 3. 白化验证

**解答思路**：
白化的目标是使协方差矩阵变为单位矩阵 $I$。我们需要使用特征分解构造变换矩阵。

**Python 验证**：
```python
# 对缩放后的数据进一步白化 (或者直接对中心化数据白化)
# 这里演示对 X_centered 进行完整白化
cov = np.cov(X_centered, rowvar=False)
eigen_vals, eigen_vecs = np.linalg.eigh(cov)

# 构造白化矩阵 (ZCA 白化)
Lambda_inv_sqrt = np.diag(1.0 / np.sqrt(eigen_vals))
W = eigen_vecs @ Lambda_inv_sqrt @ eigen_vecs.T
X_white = X_centered @ W

# 验证
cov_white = np.cov(X_white, rowvar=False)
print("白化后的协方差矩阵:\n", np.round(cov_white, 5))
```
**结论**：输出结果应非常接近单位矩阵 $\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$，微小的误差来自浮点数计算精度。

##### 4. 可视化椭圆变圆

**解答思路**：
相关数据在散点图上呈现椭圆状分布。白化后，数据去相关且方差相等，应呈现圆形分布。

**Python 验证**：
```python
plt.figure(figsize=(10, 5))

# 原始中心化数据
plt.subplot(1, 2, 1)
plt.scatter(X_centered[:, 0], X_centered[:, 1], alpha=0.6)
plt.title("中心化后 (椭圆分布)")
plt.xlabel("Feature 1")
plt.ylabel("Feature 2")
plt.grid(True)
plt.axis('equal')

# 白化后数据
plt.subplot(1, 2, 2)
plt.scatter(X_white[:, 0], X_white[:, 1], alpha=0.6, color='orange')
plt.title("白化后 (球形分布)")
plt.xlabel("Feature 1")
plt.ylabel("Feature 2")
plt.grid(True)
plt.axis('equal')

plt.tight_layout()
plt.show()
```
**结论**：左图显示数据沿某方向拉长（存在相关性），呈椭圆状；右图显示数据向各个方向均匀 spread，呈圆形。这直观地展示了白化如何消除特征间的线性依赖并统一尺度。