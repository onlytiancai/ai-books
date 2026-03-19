### 95. 线性回归与分类（从模型到矩阵）

线性代数为数据科学和应用统计学中两个最广泛使用的工具提供了基础：**线性回归**（预测连续结果）和**线性分类**（区分类别）。这两个问题本质上都可以归结为将数据表示为矩阵形式，然后应用线性运算来估计参数。

#### 回归模型的设定

假设我们想要从数据矩阵 $X \in \mathbb{R}^{n \times p}$ 收集的特征中预测输出 $y \in \mathbb{R}^n$，其中：

- $n$ = 观测值数量（样本数）。
- $p$ = 特征数量（变量数）。

我们假设一个线性模型：

$$
y \approx X\beta,
$$

其中 $\beta \in \mathbb{R}^p$ 是系数向量（权重）。$\beta$ 中的每个元素告诉我们对应的特征对预测结果的贡献程度。

> **注意**：在实际应用中，通常会在 $X$ 中添加一列全为 1 的向量，以便 $\beta$ 中包含截距项（bias/intercept），这样模型就不必强制经过原点。

#### 正规方程 (The Normal Equations)

我们的目标是最小化平方误差：

$$
\min_\beta \|y - X\beta\|^2.
$$

通过对 $\beta$ 求导并令导数为零，我们可以推导出正规方程：

$$
X^T X \beta = X^T y.
$$

- 如果 $X^T X$ 是可逆的：

$$
\hat{\beta} = (X^T X)^{-1} X^T y.
$$

- 如果不可逆（存在多重共线性，或特征过多），我们使用通过奇异值分解 (SVD) 计算的伪逆：

$$
\hat{\beta} = X^+ y.
$$

下面是一个使用 Python `numpy` 计算线性回归系数的简单示例：

```python
import numpy as np

# 假设 X 是 5x3 矩阵，y 是 5x1 向量
X = np.random.rand(5, 3)
y = np.random.rand(5, 1)

# 方法 1: 直接使用正规方程 (X^T X)^-1 X^T y
beta_hat = np.linalg.inv(X.T @ X) @ X.T @ y

# 方法 2: 使用伪逆 (更稳定，推荐)
beta_hat_pinv = np.linalg.pinv(X) @ y

print("系数 beta:", beta_hat)
```

#### 几何解释

- $X\beta$ 是 $y$ 在 $X$ 的列空间上的**投影**。
- 残差 $r = y - X\hat{\beta}$ 与 $X$ 的所有列**正交**。
- 这种“最近拟合”的性质说明了为什么回归本质上是一个投影问题。

> **提示**：想象 $X$ 的列张成了一个子空间。由于 $y$ 通常不在这个子空间内，我们寻找的是该子空间中距离 $y$ 最近的点，这个点就是投影 $X\hat{\beta}$。

#### 线性模型分类

有时我们不想预测连续输出，而是想要区分类别（例如：垃圾邮件 vs 非垃圾邮件）。

- 线性分类器：基于线性函数的符号进行决策。

$$
\hat{y} = \text{sign}(w^T x + b).
$$

- 几何视角：$w$ 定义了特征空间中的一个**超平面**。超平面一侧的点被标记为正类，另一侧被标记为负类。
- 与回归的关系：逻辑回归（Logistic Regression）用对数似然损失取代了平方误差，但仍然通过迭代线性代数方法来求解权重。

#### 多分类扩展

- 对于 $k$ 个类别，我们使用权重矩阵 $W \in \mathbb{R}^{p \times k}$。
- 预测：

$$
\hat{y} = \arg \max_j (XW)_{ij}.
$$

- 每个类别对应 $W$ 中的一列，分类器选择得分最高的那一列对应的类别。

#### 示例：预测房价

- 特征：面积、房间数量、距市中心的距离。
- 目标：价格。
- $X$ = 特征矩阵，$y$ = 价格向量。
- 回归求解出的系数显示了每个因素对价格影响的强弱。

如果我们切换到分类任务（预测“昂贵”vs“便宜”），我们将价格视为标签，并求解一个 separating hyperplane（分离超平面）来区分这两个类别。

#### 计算方面

- 直接求解正规方程：$O(p^3)$（主要是矩阵求逆的复杂度）。
- QR 分解：数值上更稳定。
- SVD：当 $X$ 病态 (ill-conditioned) 或秩亏 (rank-deficient) 时最佳。
- 现代库：针对大型数据集利用稀疏性或使用基于梯度的方法。

#### 与其他主题的联系

- 最小二乘法（第 8 章）：回归是最典型的最小二乘问题。
- SVD（第 9 章）：当列线性相关时，伪逆给出了回归解。
- 正则化（第 9 章）：岭回归 (Ridge Regression) 添加惩罚项 $\lambda \|\beta\|^2$ 以提高稳定性。
- 分类（第 10 章）构成了支持向量机和神经网络等更复杂模型的基础。

#### 为什么这很重要

线性回归和分类展示了线性代数与现实世界决策之间的直接联系。它们结合了几何（投影、超平面）、代数（求解方程组）和计算（分解）。尽管它们很简单，但仍然不可或缺：它们具有可解释性、速度快，并且通常能与更复杂的模型竞争。

#### 动手试一试 (Try It Yourself)

1. 给定三个特征和五个样本，构造 $X$ 和 $y$。使用正规方程求解 $\beta$。
2. 证明残差与 $X$ 的所有列正交。
3. 写出一个分离二维空间中两个点簇的线性分类器。 sketch 分离超平面。
4. 探索当两个特征高度相关（共线）时会发生什么。使用伪逆恢复一个稳定的解。

---

#### 练习题解答与演示

以下是针对上述练习题的详细解答过程及 Python 代码演示。

##### 1. 构造数据并求解 $\beta$

**解答过程：**
我们需要构造一个 $5 \times 3$ 的矩阵 $X$（5 个样本，3 个特征）和一个 $5 \times 1$ 的向量 $y$。为了便于计算，我们使用简单的整数。

设：
$$
X = \begin{bmatrix} 
1 & 2 & 1 \\ 
1 & 3 & 2 \\ 
1 & 4 & 3 \\ 
1 & 5 & 4 \\ 
1 & 6 & 5 
\end{bmatrix}, \quad 
y = \begin{bmatrix} 
10 \\ 15 \\ 20 \\ 25 \\ 30 
\end{bmatrix}
$$
*(注：第一列全为 1 代表截距项)*

根据正规方程 $\hat{\beta} = (X^T X)^{-1} X^T y$ 进行计算。

**Python 代码演示：**

```python
import numpy as np

# 1. 构造数据
X = np.array([
    [1, 2, 1],
    [1, 3, 2],
    [1, 4, 3],
    [1, 5, 4],
    [1, 6, 5]
], dtype=float)

y = np.array([10, 15, 20, 25, 30], dtype=float).reshape(-1, 1)

# 2. 使用正规方程求解 beta
# 步骤：计算 X^T X, 求逆，再乘 X^T y
XT_X = X.T @ X
XT_y = X.T @ y

# 检查是否可逆
if np.linalg.det(XT_X) != 0:
    beta_hat = np.linalg.inv(XT_X) @ XT_y
    print("解得的系数 beta:\n", beta_hat)
else:
    print("矩阵不可逆，需使用伪逆")
```

##### 2. 验证残差的正交性

**解答过程：**
残差定义为 $r = y - X\hat{\beta}$。
要证明残差与 $X$ 的列正交，即证明 $X^T r = 0$（零向量）。
根据正规方程的推导：
$$
X^T (y - X\hat{\beta}) = X^T y - X^T X \hat{\beta} = 0
$$
因此，理论上 $X^T r$ 应该等于零向量。在数值计算中，结果应非常接近零。

**Python 代码演示：**

```python
# 接上一题的代码
# 3. 计算残差
y_pred = X @ beta_hat
residuals = y - y_pred

# 4. 验证正交性：计算 X^T * r
orthogonality_check = X.T @ residuals

print("残差向量 r:\n", residuals)
print("X^T * r (应接近零):\n", orthogonality_check)
# 输出结果应显示极小的数值 (例如 1e-14 级别)，验证了正交性
```

##### 3. 二维线性分类器

**解答过程：**
在二维空间中，线性分类器由方程 $w^T x + b = 0$ 定义，这是一条直线。
假设我们要分离两类点：
- 正类：$(2, 2), (3, 3)$
- 负类：$(0, 0), (1, 0)$

我们可以选择权重 $w = \begin{bmatrix} 1 \\ -1 \end{bmatrix}$ 和偏置 $b = -0.5$。
决策边界为：$1 \cdot x_1 + (-1) \cdot x_2 - 0.5 = 0 \Rightarrow x_1 - x_2 = 0.5$。
- 对于 $(2, 2)$: $2 - 2 - 0.5 = -0.5 < 0$ (需调整符号，假设 sign>0 为正类)
- 让我们修正为 $w = \begin{bmatrix} 1 \\ 1 \end{bmatrix}, b = -2.5$。
- 边界：$x_1 + x_2 = 2.5$。
- $(2, 2) \to 4 - 2.5 = 1.5 > 0$ (正类)
- $(0, 0) \to 0 - 2.5 = -2.5 < 0$ (负类)

** sketch 描述：**
在笛卡尔坐标系中，画一条斜率为 -1 的直线，截距为 2.5。直线右上方的点归为一类，左下方的点归为另一类。

**Python 代码演示：**

```python
import matplotlib.pyplot as plt

# 定义数据点
pos_class = np.array([[2, 2], [3, 3]])
neg_class = np.array([[0, 0], [1, 0]])

# 定义分类器参数 w 和 b
w = np.array([1, 1])
b = -2.5

# 绘制散点
plt.scatter(pos_class[:, 0], pos_class[:, 1], c='red', label='Positive')
plt.scatter(neg_class[:, 0], neg_class[:, 1], c='blue', label='Negative')

# 绘制决策边界 w1*x + w2*y + b = 0 => y = (-w1*x - b) / w2
x_line = np.linspace(-1, 4, 100)
y_line = (-w[0] * x_line - b) / w[1]
plt.plot(x_line, y_line, 'k--', label='Decision Boundary')

plt.legend()
plt.grid(True)
plt.title("Linear Classifier in 2D")
plt.show()
```

##### 4. 多重共线性与伪逆

**解答过程：**
当两个特征高度相关时，$X^T X$ 接近奇异矩阵，行列式接近 0，直接求逆会导致数值不稳定或误差极大。
构造一个共线例子：设特征 2 是特征 1 的 2 倍。
$$
X = \begin{bmatrix} 
1 & 2 \\ 
1 & 2 \\ 
1 & 2 
\end{bmatrix}
$$
此时 $X^T X$ 不可逆。我们需要使用伪逆 $X^+$ 来获得最小范数解。

**Python 代码演示：**

```python
# 构造共线数据
X_collinear = np.array([
    [1, 2],
    [1, 2],
    [1, 2]
], dtype=float)
y_collinear = np.array([3, 3, 3], dtype=float).reshape(-1, 1)

# 尝试直接求逆 (会报错或警告)
try:
    beta_direct = np.linalg.inv(X_collinear.T @ X_collinear) @ X_collinear.T @ y_collinear
    print("直接求逆结果:", beta_direct)
except np.linalg.LinAlgError:
    print("直接求逆失败：矩阵奇异")

# 使用伪逆 (稳定)
beta_pinv = np.linalg.pinv(X_collinear) @ y_collinear
print("伪逆求解结果:", beta_pinv)
# 伪逆能给出一个合理的解，即使特征完全共线
```

线性回归与分类证明了线性代数不仅仅是抽象的理论——它是实际预测引擎的核心。