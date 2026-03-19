### 85. 主成分分析（方差与方向）

主成分分析（Principal Component Analysis，简称 PCA）是统计学、数据分析和机器学习中最广泛使用的技术之一。它提供了一种方法，能够在尽可能保留重要信息的前提下，降低数据集的维度。其核心洞察在于：数据在某些方向上的变化往往比其他方向更强烈，通过聚焦于这些方向，我们可以用更少的维度、更少的噪声和更强的可解释性来总结数据集。

#### 基本问题

假设我们在高维空间中有数据点，记为 $x_1, x_2, \dots, x_m \in \mathbb{R}^n$。每个点可能代表：

- 一张被展平为数千像素的人脸图像。
- 一位顾客在数百种商品上的购物历史。
- 数千个基因的表达谱 profile。

直接存储和处理所有特征不仅成本高昂，而且许多特征可能是冗余或相关的。PCA 提出的问题是：

*我们能否用一组更小的方向来重新表达这些数据，从而捕捉到最大的变异性？*

#### 方差即信息

PCA 的指导原则是**方差（Variance）**。

- 方差衡量数据沿某个方向的分散程度。
- 高方差方向捕捉到了有意义的结构（例如，不同的面部表情、主要的消费习惯）。
- 低方差方向通常对应于噪声或不重要的波动。

因此，PCA 寻找的是数据方差最大化的方向（称为**主成分**）。

> **注意**：在实际应用中，我们通常假设“信号”表现为大的变化，而“噪声”表现为小的随机变化。因此，最大化方差等同于最大化信噪比。

#### 中心化与协方差

首先，我们需要对数据进行**中心化（Centering）**，即减去均值向量：

$$
X_c = X - \mathbf{1}\mu^T,
$$

其中 $\mu$ 是所有数据点的平均值。

接着计算**协方差矩阵（Covariance Matrix）**：

$$
C = \frac{1}{m} X_c^T X_c.
$$

- 对角线元素衡量每个特征的方差。
- 非对角线元素衡量特征之间如何共同变化（相关性）。

寻找主成分等价于寻找该协方差矩阵的特征向量。

```python
import numpy as np

# 示例：手动计算协方差矩阵
# 假设 X 是 m x n 的数据矩阵 (m 个样本，n 个特征)
X = np.random.rand(100, 5)  # 100 个样本，5 个特征
mu = np.mean(X, axis=0)     # 计算均值向量
X_c = X - mu                # 中心化
C = (X_c.T @ X_c) / 100     # 计算协方差矩阵
print("协方差矩阵形状:", C.shape)
```

#### 特征值视角

1. $C$ 的**特征向量**即为方向（主成分）。
2. 对应的**特征值**告诉我们每个成分沿该方向包含多少方差。
3. 将特征值从大到小排序，即可得到从信息量最大到最小的方向。

如果我们保留前 $k$ 个特征向量，我们将数据投影到一个 $k$ 维子空间中，从而保留大部分方差。

#### 奇异值分解（SVD）视角

另一种视角使用奇异值分解（SVD）：

$$
X_c = U \Sigma V^T.
$$

- $V$ 的列向量即为主方向。
- 奇异值的平方（$\sigma_i^2$）对应于协方差矩阵的特征值。
- 投影到 $V$ 的前 $k$ 列即可得到降维后的表示。

这使得 PCA 和 SVD 在计算本质上是相同的。

```python
# 示例：使用 SVD 进行 PCA
U, S, Vt = np.linalg.svd(X_c, full_matrices=False)
# Vt 的行是主成分方向
# S 是奇异值，S**2 与特征值成正比
explained_variance_ratio = (S**2) / np.sum(S**2)
print("第一主成分解释的方差比例:", explained_variance_ratio[0])
```

#### 简单示例

想象我们测量了 1000 个人的身高和体重。绘制散点图会显示强相关性：较高的人通常较重。点云沿对角线延伸。

- PCA 的第一个成分就是这条对角线：方差最大的方向。
- 第二个成分垂直于它，捕捉到小得多的差异（例如身高相同但体重略有不同的人）。
- 仅保留第一个成分可以将两个特征减少为一个，同时保留大部分信息。

#### 几何图像

- PCA 旋转坐标系，使坐标轴与最大方差方向对齐。
- 投影到前 $k$ 个成分上将数据“压扁”到低维空间，就像将一个倾斜的煎饼压扁到其最宽的平面上。

#### 日常类比

- **摄影**：PCA 就像调整相机角度，以便在一次拍摄中捕捉场景最重要的部分。
- **总结书籍**：不是保留每一页，而是只保留主要主题。
- **音乐**：交响乐可以分解为几个主导旋律；其余的是变奏。

#### 应用场景

1. **数据压缩**：仅保留主要成分以减少存储（例如，压缩图像）。
2. **噪声 reduction**：小方差方向通常对应测量噪声；丢弃它们可产生更干净的数据。
3. **可视化**：将数据减少到 2D 或 3D 用于散点图，帮助我们看到聚类和模式。
4. **机器学习预处理**：许多模型在 PCA 变换后的数据上训练更快，泛化能力更好。
5. **基因组学与生物学**：PCA 发现数千个基因变异的主要轴。
6. **金融**：PCA 将股票的相关运动总结为几个主要的“因子”。

#### 权衡与局限性

- **可解释性**：主成分是原始特征的线性组合，有时很难用 plain terms 解释。
- **线性**：PCA 仅捕捉线性关系；对于弯曲流形，非线性方法（如 kernel PCA, t-SNE 或 UMAP）可能更好。
- ** scaling**：特征必须properly 标准化；否则，PCA 可能会过度强调具有较大原始方差的单位。
- **全局方法**：PCA 捕捉整体方差，而不是局部结构（例如，数据内的小聚类）。

> **提示**：在使用 PCA 之前，务必对数据进行**标准化（Standardization）**，即减去均值并除以标准差，确保所有特征具有相同的尺度。

#### 数学保证

PCA 具有最优性保证：

- 在所有 $k$ 维线性子空间中，PCA 子空间最小化重构误差（数据与其投影之间的平方欧几里得距离）。
- 这本质上是之前见过的低秩近似定理，应用于协方差矩阵。

#### 为什么它很重要

PCA 展示了线性代数如何将原始数据转化为洞察。通过关注方差，它提供了一种原则性的方法来过滤噪声、压缩信息并揭示隐藏模式。它简单、计算效率高且基础深厚——几乎每个现代数据管道都显式或隐式地使用 PCA。

#### 动手试一试

1. 取一个具有两个相关特征的数据集（如身高和体重）。计算协方差矩阵、特征向量，并投影到第一个成分上。可视化前后对比。
2. 对于存储为矩阵的灰度图像，将其展平为向量并应用 PCA。需要多少个成分才能以 90% 的准确度重构它？
3. 在著名的 Iris 数据集（4 个特征）上使用 PCA。使用前两个成分在 2D 中绘制数据。注意物种在这个降维空间中是如何分离的。
4. 证明第一主成分是最大化 $\|X_c v\|^2$ 的单位向量 $v$。

#### 练习题解答与代码示例

以下是上述练习题的详细解答过程与 Python 代码实现。

##### 1. 二维相关数据投影

**解答思路**：
我们需要生成具有相关性的二维数据，计算协方差矩阵的特征分解，找到主成分方向，并将数据投影到该方向上。

```python
import numpy as np
import matplotlib.pyplot as plt

# 1. 生成 correlated 数据
np.random.seed(42)
mean = [0, 0]
cov = [[1, 0.8], [0.8, 1]]  # 高相关性
data = np.random.multivariate_normal(mean, cov, 1000)

# 2. 中心化
data_centered = data - np.mean(data, axis=0)

# 3. 计算协方差矩阵
C = np.cov(data_centered, rowvar=False)

# 4. 特征分解
eigenvalues, eigenvectors = np.linalg.eigh(C)
# 按特征值大小排序
idx = np.argsort(eigenvalues)[::-1]
eigenvalues = eigenvalues[idx]
eigenvectors = eigenvectors[:, idx]

# 第一主成分方向
pc1 = eigenvectors[:, 0]

# 5. 投影
# 投影坐标 = 数据点 dot 主成分向量
projections = data_centered @ pc1

# 可视化
plt.figure(figsize=(10, 5))

plt.subplot(1, 2, 1)
plt.scatter(data[:, 0], data[:, 1], alpha=0.5)
plt.title("原始数据 (2D)")
plt.xlabel("Feature 1")
plt.ylabel("Feature 2")
plt.axline((0, 0), slope=pc1[1]/pc1[0], color='r', linestyle='--', label='PC1 方向')
plt.legend()

plt.subplot(1, 2, 2)
# 将投影结果画在一条线上 (为了可视化，稍微偏移 y 轴)
plt.scatter(projections, np.zeros_like(projections), alpha=0.5)
plt.title("投影到第一主成分 (1D)")
plt.xlabel("PC1 坐标")
plt.yticks([])
plt.axhline(0, color='k', linewidth=1)

plt.tight_layout()
plt.show()
```

##### 2. 图像压缩与重构

**解答思路**：
图像可以看作矩阵。通过对图像矩阵进行 SVD 或 PCA，我们可以保留前 $k$ 个奇异值/成分来重构图像。我们需要找到累积方差比例达到 90% 所需的 $k$ 值。

```python
# 假设我们有一个灰度图像矩阵 img (这里用随机矩阵模拟)
img = np.random.rand(100, 100) # 100x100 像素
img_centered = img - np.mean(img)

# SVD 分解
U, S, Vt = np.linalg.svd(img_centered, full_matrices=False)

# 计算累积方差比例
total_variance = np.sum(S**2)
cumulative_variance = np.cumsum(S**2) / total_variance

# 找到达到 90% 所需的成分数
k_90 = np.searchsorted(cumulative_variance, 0.90) + 1
print(f"需要 {k_90} 个成分来达到 90% 的方差保留率")

# 重构图像
img_reconstructed = U[:, :k_90] @ np.diag(S[:k_90]) @ Vt[:k_90, :]
img_reconstructed += np.mean(img) # 加回均值

# 注意：实际应用中请使用 PIL 或 cv2 读取真实图片
```

##### 3. Iris 数据集可视化

**解答思路**：
使用 `sklearn` 加载 Iris 数据集，手动或使用库进行 PCA，然后绘制散点图。

```python
from sklearn.datasets import load_iris
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

# 加载数据
iris = load_iris()
X = iris.data
y = iris.target
target_names = iris.target_names

# 应用 PCA 降维到 2D
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# 绘图
plt.figure(figsize=(8, 6))
colors = ['navy', 'turquoise', 'darkorange']
for color, i, target_name in zip(colors, [0, 1, 2], target_names):
    plt.scatter(X_pca[y == i, 0], X_pca[y == i, 1], color=color, label=target_name)

plt.legend(loc='best')
plt.title('Iris 数据集 PCA 降维可视化')
plt.xlabel('第一主成分')
plt.ylabel('第二主成分')
plt.show()
```
**观察**：你会发现不同颜色的点（代表不同物种）在 2D 空间中形成了明显的聚类，这说明 PCA 成功提取了区分物种的主要特征。

##### 4. 第一主成分的数学证明

**问题**：证明第一主成分是单位向量 $v$，使得 $\|X_c v\|^2$ 最大化。

**证明过程**：

1.  **目标函数**：
    我们要最大化投影数据的方差。投影后的数据为 $X_c v$。
    投影数据的方差（未除以 $m$ 的总和形式）可以表示为：
    $$
    \|X_c v\|^2 = (X_c v)^T (X_c v) = v^T X_c^T X_c v
    $$
    根据协方差矩阵定义 $C = \frac{1}{m} X_c^T X_c$，最大化 $\|X_c v\|^2$ 等价于最大化 $v^T C v$。

2.  **约束条件**：
    方向向量必须是单位向量，即 $\|v\|^2 = v^T v = 1$。

3.  **拉格朗日乘数法**：
    构造拉格朗日函数：
    $$
    L(v, \lambda) = v^T C v - \lambda (v^T v - 1)
    $$
    对 $v$ 求梯度并令其为 0：
    $$
    \nabla_v L = 2Cv - 2\lambda v = 0
    $$
    化简得：
    $$
    Cv = \lambda v
    $$
    这正是特征值方程。说明最优解 $v$ 必须是协方差矩阵 $C$ 的特征向量。

4.  **确定最大方差**：
    将 $Cv = \lambda v$ 代入目标函数：
    $$
    v^T C v = v^T (\lambda v) = \lambda (v^T v) = \lambda
    $$
    为了最大化目标函数 $v^T C v$，我们需要选择最大的特征值 $\lambda_{max}$。

5.  **结论**：
    对应于最大特征值的特征向量 $v$，即为最大化 $\|X_c v\|^2$ 的单位向量。这就是第一主成分的定义。

**证毕。**