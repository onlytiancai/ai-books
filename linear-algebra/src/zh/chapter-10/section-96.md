### 96. 实战中的 PCA（降维工作流程）

主成分分析（Principal Component Analysis, PCA）是应用线性代数中最广泛使用的工具之一。其核心思想是识别数据变化最大的方向（即主成分），然后将数据重新表达在这些方向上。在实际应用中，PCA 不仅仅是一个数学概念，它是一套完整的工作流程，用于降低维度、去除数据噪声以及从高维数据集中提取模式。

#### 动机

现代数据集通常拥有成千上万甚至数百万个特征：

- **图像**：每个像素都是一个特征。
- **基因组学**：每个基因的表达水平都是一个特征。
- **文本**：词汇表中的每个单词都成为一个维度。

在如此高维的空间中工作不仅计算成本高昂，而且非常脆弱（噪声容易累积）。PCA 提供了一种系统的方法，将特征空间缩减为较小的维度集，同时仍能捕捉到大部分的数据变异性。

#### 步骤 1：整理数据

我们从数据矩阵 $X \in \mathbb{R}^{n \times p}$ 开始：

- $n$：样本数量（观测值）。
- $p$：特征数量（变量）。

每一行代表一个样本，每一列代表一个特征。

**中心化（Centering）** 是第一个预处理步骤：减去每一列的均值，使数据集的均值为零。这确保了 PCA 描述的是方差，而不是被 offsets（偏移量）所偏差。

$$
X_{centered} = X - \mathbf{1}\mu^T
$$

> **注意**：中心化是 PCA 的必要步骤。如果不中心化，第一主成分可能会指向数据的均值方向，而不是数据变化最大的方向。

#### 步骤 2：协方差矩阵

接下来，计算协方差矩阵：

$$
\Sigma = \frac{1}{n} X_{centered}^T X_{centered}.
$$

- **对角线元素**：每个特征的方差。
- **非对角线元素**：特征之间的协方差（它们如何共同变化）。

$\Sigma$ 的结构决定了数据中最大变化方向。

> **提示**：协方差矩阵是对称半正定矩阵，这保证了其特征值是非负实数，且特征向量正交。

#### 步骤 3：特征分解或 SVD

有两种等价的方法来实现 PCA：

1. **特征分解（Eigen-decomposition）**：求解 $\Sigma v = \lambda v$。
   - 特征向量 $v$ 即为主成分。
   - 特征值 $\lambda$ 衡量沿这些方向的方差大小。

2. **奇异值分解（SVD）**：直接对中心化后的数据矩阵进行分解：

   $$
   X_{centered} = U \Sigma V^T.
   $$

   - $V$ 的列 = 主成分方向。
   - 奇异值的平方对应于方差。

在实际应用中，**SVD 更受青睐**，因为它具有更好的数值稳定性且效率更高，特别是当 $p$ 非常大时。

> **注意**：虽然公式中协方差矩阵和 SVD 中的对角矩阵都用了符号 $\Sigma$，但在具体计算时请区分上下文。SVD 方法通常避免了显式计算协方差矩阵，从而减少了舍入误差。

#### 步骤 4：选择主成分数量

我们将特征值排序为 $\lambda_1 \geq \lambda_2 \geq \dots \geq \lambda_p$。

- **解释方差比（Explained Variance Ratio, EVR）**：

  $$
  \text{EVR}(k) = \frac{\sum_{i=1}^k \lambda_i}{\sum_{i=1}^p \lambda_i}.
  $$
- 我们选择 $k$，使得 EVR 超过某个阈值（例如 90–95%）。
- 这在降维和信息保留之间取得了平衡。

图形上，**碎石图（Scree Plot）** 显示特征值，我们寻找“肘部”点（elbow point），即额外成分几乎不再增加方差的转折点。

#### 步骤 5：投影数据

一旦选择了 $k$ 个主成分，我们将数据投影到这些成分上：

$$
X_{PCA} = X_{centered} V_k,
$$

其中 $V_k$ 包含前 $k$ 个特征向量。

结果：

- $X_{PCA} \in \mathbb{R}^{n \times k}$。
- 每一行现在是原始样本的 $k$ 维表示。

以下是一个使用 `numpy` 进行投影的简单代码示例：

```python
import numpy as np

# 假设 X_centered 是已中心化的数据 (n x p)
# V_k 是前 k 个特征向量 (p x k)
X_pca = X_centered @ V_k  # 矩阵乘法实现投影
print(f"降维后的数据形状：{X_pca.shape}")
```

#### 工作示例：人脸图像

假设我们有一个灰度图像数据集，每张图像 $100 \times 100$ 像素（$p = 10,000$）。

1. 对每个像素值进行中心化。
2. 计算所有图像的协方差。
3. 找到特征向量 = **特征脸（Eigenfaces）**。这些是特征模式，如“眼镜”、“嘴型”或“光照方向”。
4. 保留前 50 个主成分。每张脸现在表示为 50 维向量，而不是 10,000 维。

这极大地减少了存储空间并加快了识别速度，同时保留了关键特征。

#### 实际考虑因素

- **标准化（Standardization）**：如果特征具有不同的量纲（例如年龄是年，收入是千万元），在进行 PCA 之前必须对其进行缩放（通常缩放到均值为 0，方差为 1）。
- **计算捷径**：对于非常大的 $p$，通常直接对 $X$ 进行截断 SVD 计算 PCA 更快。
- **噪声过滤**：较小的特征值通常对应于噪声；截断它们可以对数据集去噪。
- **可解释性**：主成分是特征的线性组合。有时这些组合具有可解释性，有时则没有。

> **注意**：当特征量纲差异巨大时，务必使用标准化（Z-score）而非仅仅中心化，否则方差大的特征将主导主成分。

#### 与其他概念的联系

- **白化（Whitening，第 94 章）**：PCA 后跟随特征值缩放至 1 即为白化。
- **SVD（第 9 章）**：PCA 本质上是 SVD 的一种应用。
- **回归（第 95 章）**：PCA 可用于回归之前，以减少预测变量之间的共线性（PCA 回归）。
- **机器学习 pipeline**：PCA 常用于聚类、分类或神经网络之前的预处理步骤。

#### 为什么它很重要

PCA 将原始、难以处理的数据转化为紧凑的形式，而不丢失基本结构。它使得可视化（高维数据的 2D/3D  plot）、更快的学习以及噪声 reduction 成为可能。许多突破——从人脸识别到基因表达分析——都依赖 PCA 作为第一个预处理步骤。

#### 动手试一试

1. 取一个具有 3 个特征的数据集。手动计算协方差、特征值和特征向量。
2. 将数据投影到前两个主成分上并绘图。与原始 3D 散点图进行比较。
3. 下载一个图像数据集并应用 PCA 进行压缩。分别用 10、50、100 个主成分重建图像。观察压缩率与 fidelity（保真度）之间的权衡。
4. 计算解释方差比，并决定保留多少个主成分。

PCA 是原始数据与有意义表示之间的桥梁：它在降低复杂度的同时 sharpening（锐化）了模式。它展示了线性代数如何揭示高维混沌中的隐藏秩序。

#### 练习题解答与代码实现

以下是针对上述“动手试一试”练习题的详细解答过程与 Python 代码实现。

##### 练习 1 & 2：三维数据的 PCA 计算与投影

**解答思路**：
我们将构造一个简单的三维数据集，使用 `numpy` 计算协方差矩阵和特征分解，然后投影到前两个主成分并可视化。

```python
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# 1. 构造一个具有 3 个特征的简单数据集 (n=100)
np.random.seed(42)
# 生成沿特定方向拉伸的数据，模拟相关性
mean = [0, 0, 0]
cov = [[3, 1, 0.5], 
       [1, 2, 0.5], 
       [0.5, 0.5, 1]]
X = np.random.multivariate_normal(mean, cov, 100)

# 2. 中心化数据
X_centered = X - np.mean(X, axis=0)

# 3. 计算协方差矩阵
# 注意：np.cov 默认每行是一个变量，每列是一个观测，所以需要 rowvar=False
Sigma = np.cov(X_centered, rowvar=False)

# 4. 特征分解
eigenvalues, eigenvectors = np.linalg.eigh(Sigma)
# 按特征值从大到小排序
idx = np.argsort(eigenvalues)[::-1]
eigenvalues = eigenvalues[idx]
eigenvectors = eigenvectors[:, idx]

print("特征值:", eigenvalues)
print("第一主成分方向:", eigenvectors[:, 0])

# 5. 投影到前两个主成分
V_k = eigenvectors[:, :2]
X_pca = X_centered @ V_k

# 6. 绘图比较
fig = plt.figure(figsize=(12, 5))

# 原始 3D 散点
ax1 = fig.add_subplot(121, projection='3d')
ax1.scatter(X[:, 0], X[:, 1], X[:, 2], c='blue', alpha=0.6)
ax1.set_title("原始 3D 数据")
ax1.set_xlabel("Feature 1")
ax1.set_ylabel("Feature 2")
ax1.set_zlabel("Feature 3")

# 投影后 2D 散点
ax2 = fig.add_subplot(122)
ax2.scatter(X_pca[:, 0], X_pca[:, 1], c='red', alpha=0.6)
ax2.set_title("PCA 投影后 (2D)")
ax2.set_xlabel("PC1")
ax2.set_ylabel("PC2")
ax2.grid(True)

plt.tight_layout()
plt.show()
```

**结果分析**：
- 你会看到原始数据在 3D 空间中呈椭球状分布。
- 投影后的 2D 数据保留了数据变化最大的两个方向的信息。
- 如果第三个特征值很小，说明数据主要分布在由前两个主成分张成的平面上，降维损失很小。

##### 练习 3：图像压缩与重建

**解答思路**：
使用 `sklearn` 提供的数字数据集或人脸数据集来演示 PCA 压缩。这里我们使用 `fetch_lfw_people` 或简单的数字图像矩阵来模拟。为了代码可运行性，我们使用 `sklearn.datasets` 中的数字图像并 reshape 为矩阵。

```python
from sklearn.datasets import fetch_olivetti_faces
from sklearn.decomposition import PCA

# 加载人脸数据集 (如果网络不可用，可使用 np.random 模拟)
try:
    data = fetch_olivetti_faces()
    X_faces = data.data
    n_samples, h, w = data.images.shape
except:
    # 模拟数据：100 张 64x64 的图像
    n_samples = 100
    h, w = 64, 64
    X_faces = np.random.rand(n_samples, h * w)

# 定义重建函数
def reconstruct_images(X, n_components):
    pca = PCA(n_components=n_components)
    X_pca = pca.fit_transform(X)
    X_reconstructed = pca.inverse_transform(X_pca)
    return X_reconstructed, pca.explained_variance_ratio_

# 尝试不同的主成分数量
components_list = [10, 50, 100]
fig, axes = plt.subplots(3, 4, figsize=(10, 8))

for i, n_comp in enumerate(components_list):
    X_rec, evr = reconstruct_images(X_faces, n_comp)
    
    # 显示前 3 张原图和重建图
    for j in range(3):
        # 原图
        axes[i, j].imshow(X_faces[j].reshape(h, w), cmap='gray')
        axes[i, j].set_title(f"Original")
        axes[i, j].axis('off')
        # 重建图
        axes[i, j+1].imshow(X_rec[j].reshape(h, w), cmap='gray')
        axes[i, j+1].set_title(f"PCA k={n_comp}")
        axes[i, j+1].axis('off')
    
    # 显示累计方差比
    cum_var = np.sum(evr)
    axes[i, 3].text(0.5, 0.5, f"Variance Retained:\n{cum_var:.2%}", 
                    ha='center', va='center', fontsize=12)
    axes[i, 3].axis('off')

plt.tight_layout()
plt.show()
```

**结果分析**：
- **k=10**：图像非常模糊，只能看出大致轮廓和光照，丢失了大量细节。
- **k=50**：面部特征（眼睛、嘴巴）开始清晰可见。
- **k=100**：图像非常接近原图，肉眼难以区分差异。
- **权衡**：随着 $k$ 增加，存储空间增加，但重建质量提高。通常选择保留 95% 方差的 $k$ 值即可。

##### 练习 4：计算解释方差比并决定成分数量

**解答思路**：
通过绘制累计解释方差比曲线，找到“肘部”或达到阈值的位置。

```python
# 继续使用上面的人脸数据或 X_faces
pca_full = PCA(n_components=min(X_faces.shape))
pca_full.fit(X_faces)

# 获取解释方差比
evr = pca_full.explained_variance_ratio_
cum_evr = np.cumsum(evr)

# 绘图
plt.figure(figsize=(8, 5))
plt.plot(range(1, len(evr) + 1), evr, marker='o', linestyle='--', label='Individual EVR')
plt.plot(range(1, len(cum_evr) + 1), cum_evr, marker='x', linestyle='-', label='Cumulative EVR')
plt.axhline(y=0.95, color='r', linestyle=':', label='95% Threshold')
plt.xlabel('Number of Components')
plt.ylabel('Variance Ratio')
plt.title('Scree Plot & Cumulative Variance')
plt.legend()
plt.grid(True)
plt.show()

# 自动计算达到 95% 所需的成分数
k_95 = np.argmax(cum_evr >= 0.95) + 1
print(f"保留 95% 方差所需的主成分数量：{k_95}")
```

**结果分析**：
- 观察曲线，初始阶段方差比下降很快，随后趋于平缓。
- 找到累计曲线穿过 0.95 红线的位置，对应的横坐标即为推荐的 $k$ 值。
- 这避免了主观猜测，提供了基于数据统计特性的客观标准。