### 46. 相似与共轭

在线性代数中，不同的矩阵在不同的坐标系下可以表示同一个 underlying transformation（底层变换）。这种关系通过 **相似（Similarity）** 的概念来捕捉。如果两个矩阵可以通过一个可逆的基变换矩阵进行共轭运算而相互得到，则称这两个矩阵相似。这一概念是理解标准型、特征值分解以及线性算子深层结构的核心。

#### 相似的定义

两个 $n \times n$ 矩阵 $A$ 和 $B$ 被称为**相似的（similar）**，如果存在一个可逆矩阵 $P$，使得：

$$
B = P^{-1}AP.
$$

- 这里，$P$ 代表基变换矩阵。
- $A$ 和 $B$ 描述的是同一个线性变换，只是相对于不同的基（坐标系）表达而已。

> **注意**：有时这种操作 $P^{-1}AP$ 也被称为对 $A$ 进行**共轭（conjugation）**。在线性代数教材中，更常见的术语是“相似变换”。

#### 共轭作为基变换

假设 $T: V \to V$ 是一个线性变换，$A$ 是它在基 $\mathcal{B}$ 下的矩阵表示。如果我们切换到新的基 $\mathcal{C}$，其矩阵表示变为 $B$。转换公式为：

$$
B = P^{-1}AP,
$$

其中 $P$ 是从基 $\mathcal{B}$ 到基 $\mathcal{C}$ 的基变换矩阵（过渡矩阵）。

这表明相似性不仅仅是代数上的巧合，它具有几何意义：算子本身没有变，只是我们的观察视角（基）发生了变化。

```python
import numpy as np

# Python 演示：验证相似变换
# 定义矩阵 A 和可逆矩阵 P
A = np.array([[4, 2], 
              [1, 3]])
P = np.array([[1, 1], 
              [0, 1]])

# 计算 P 的逆
P_inv = np.linalg.inv(P)

# 计算相似矩阵 B = P^{-1} A P
B = P_inv @ A @ P

print("矩阵 A:\n", A)
print("变换矩阵 P:\n", P)
print("相似矩阵 B:\n", B)

# 验证性质：迹（Trace）和行列式（Determinant）应该相同
print(f"\nTr(A) = {np.trace(A)}, Tr(B) = {np.trace(B)}")
print(f"Det(A) = {np.linalg.det(A):.4f}, Det(B) = {np.linalg.det(B):.4f}")
```

#### 相似下保持不变的性质

如果 $A$ 和 $B$ 相似，它们共享许多关键性质：

1. 行列式：$\det(A) = \det(B)$。
2. 迹：$\text{tr}(A) = \text{tr}(B)$。
3. 秩：$\text{rank}(A) = \text{rank}(B)$。
4. 特征值：具有相同的特征值集合（包括重数）。
5. 特征多项式：完全相同。
6. 最小多项式：完全相同。

这些不变量定义了线性算子的“骨架”，不受坐标变化的影响。

> **提示**：虽然特征值相同，但特征向量通常不同。它们通过矩阵 $P$ 相互关联。

#### 示例

1. **平面旋转**：
   旋转 90° 的矩阵为

   $$
   A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}.
   $$

   在另一个基下，旋转可能由一个看起来更复杂的矩阵表示，但所有这样的矩阵都与 $A$ 相似。

2. **对角化**：
   如果矩阵 $A$ 相似于一个对角矩阵 $D$，则称 $A$ 是可对角化的。即，

   $$
   A = PDP^{-1}.
   $$

   在这里，相似性将 $A$ 简化为其最简形式。

3. **剪切变换**：
   剪切矩阵 $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$ 不可对角化，但它可能相似于一个若尔当块（Jordan block）。

#### 几何解释

- 相似性表明：两个矩阵看起来可能不同，但它们是从不同坐标系看到的“同一个”变换。
- 共轭是重新标记坐标的数学行为。
- 想象一下改变相机角度：场景没有变，只是视角变了。

#### 日常类比

- **故事翻译**：同一个情节可以用不同的语言（基）讲述。词语不同（矩阵），但故事保持不变（变换）。
- **地图与坐标**：山脉的形状不取决于我们使用经纬度还是 UTM 坐标。
- **软件代码**：同一个算法可以用 Python 或 C++ 编写——符号不同，行为相同。

#### 应用

1. **对角化**：利用相似性将矩阵简化为对角形式（如果可能）。这简化了幂运算、指数运算和迭代分析。
2. **若尔当标准型（Jordan canonical form）**：每个方阵都相似于一个若尔当形，给出了完整的结构分类。
3. **量子力学**：状态空间上的算子经常改变表示形式，但相似性保证了谱（特征值）的不变性。
4. **控制理论**：标准型简化了系统稳定性和可控性的分析。
5. **数值方法**：特征值算法依赖于重复的相似变换（例如 QR 算法）。

#### 为什么它很重要

1. 相似性揭示了线性算子的真实身份，独立于坐标。
2. 它允许简化：许多问题在正确的基下变得更容易。
3. 它保持不变量，为我们提供了分类和比较算子的工具。
4. 它将抽象代数与几何、物理和工程中的具体计算联系起来。

#### 动手试一试

1. 判断 $\begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}$ 是否相似于 $\begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$。为什么？
2. 计算 $P^{-1}AP$，其中 $A = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$ 且 $P = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$。解释结果。
3. 证明如果两个矩阵相似，它们必须具有相同的迹。
4. **挑战**：证明如果 $A$ 和 $B$ 相似，则对于所有整数 $k \geq 0$，$A^k$ 和 $B^k$ 也相似。

#### 练习题详细解答

**1. 判断相似性**

**问题**：判断 $\begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}$ 是否相似于 $\begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$。

**解答**：
**它们不相似。**

**理由**：
令 $A = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}$，$B = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$。
虽然它们具有相同的特征值（$\lambda = 2$，代数重数为 2），但它们的几何重数不同。
- 对于矩阵 $B$（数量矩阵），任何非零向量都是特征向量，特征空间维数为 2（几何重数 = 2）。
- 对于矩阵 $A$，求解 $(A - 2I)\mathbf{x} = 0$：
  $$
  \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \implies x_2 = 0.
  $$
  特征向量形如 $\begin{bmatrix} x_1 \\ 0 \end{bmatrix}$，特征空间维数为 1（几何重数 = 1）。

相似矩阵必须具有相同的若尔当标准型。$B$ 已经是对角阵，而 $A$ 是一个若尔当块。由于几何重数不同，它们不可能相似。
另外，$B = 2I$ 与任何矩阵可交换。如果 $A$ 相似于 $B$，则存在 $P$ 使得 $A = P^{-1}BP = P^{-1}(2I)P = 2P^{-1}IP = 2I$，但这与 $A \neq 2I$ 矛盾。

**2. 计算共轭变换**

**问题**：计算 $P^{-1}AP$，其中 $A = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$ 且 $P = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$。

**解答**：
首先计算 $P^{-1}$。对于 $2 \times 2$ 矩阵 $\begin{bmatrix} a & b \\ c & d \end{bmatrix}$，逆矩阵为 $\frac{1}{ad-bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$。
$$
\det(P) = 1 \times 1 - 1 \times 0 = 1.
$$
$$
P^{-1} = \begin{bmatrix} 1 & -1 \\ 0 & 1 \end{bmatrix}.
$$
接下来计算 $P^{-1}A$：
$$
P^{-1}A = \begin{bmatrix} 1 & -1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}.
$$
最后计算 $(P^{-1}A)P$：
$$
B = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}.
$$
**结果**：$B = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$。
**解释**：在这个特定的例子中，$B = A$。这意味着矩阵 $A$ 与自身在这个特定的基变换下保持不变。这通常发生在 $P$ 与 $A$ 可交换时（即 $AP = PA$）。我们可以验证：
$AP = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 3 \\ 0 & 1 \end{bmatrix}$，
$PA = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}\begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 3 \\ 0 & 1 \end{bmatrix}$。
确实 $AP=PA$，所以 $P^{-1}AP = P^{-1}PA = A$。

```python
# Python 验证第 2 题
A = np.array([[1, 2], [0, 1]])
P = np.array([[1, 1], [0, 1]])
P_inv = np.linalg.inv(P)
B = P_inv @ A @ P
print("计算结果 B:\n", B)
# 输出应该与 A 相同
```

**3. 证明迹的不变性**

**问题**：证明如果两个矩阵相似，它们必须具有相同的迹。

**解答**：
假设 $A$ 和 $B$ 相似，则存在可逆矩阵 $P$ 使得 $B = P^{-1}AP$。
我们需要利用迹的循环性质：对于任意使得乘积有意义的矩阵 $X, Y$，有 $\text{tr}(XY) = \text{tr}(YX)$。
$$
\begin{aligned}
\text{tr}(B) &= \text{tr}(P^{-1}AP) \\
&= \text{tr}((P^{-1})(AP)) \\
&= \text{tr}((AP)(P^{-1})) \quad (\text{利用 } \text{tr}(XY)=\text{tr}(YX), \text{令 } X=P^{-1}, Y=AP) \\
&= \text{tr}(A(PP^{-1})) \\
&= \text{tr}(AI) \\
&= \text{tr}(A).
\end{aligned}
$$
因此，$\text{tr}(A) = \text{tr}(B)$。证毕。

**4. 挑战：幂的相似性**

**问题**：证明如果 $A$ 和 $B$ 相似，则对于所有整数 $k \geq 0$，$A^k$ 和 $B^k$ 也相似。

**解答**：
已知 $B = P^{-1}AP$。
我们需要证明 $B^k = P^{-1}A^kP$。
使用数学归纳法或直接展开：
$$
\begin{aligned}
B^2 &= B \cdot B = (P^{-1}AP)(P^{-1}AP) \\
&= P^{-1}A(PP^{-1})AP \\
&= P^{-1}A(I)AP \\
&= P^{-1}A^2P.
\end{aligned}
$$
假设对于 $k$ 成立，即 $B^k = P^{-1}A^kP$。
则对于 $k+1$：
$$
\begin{aligned}
B^{k+1} &= B^k \cdot B \\
&= (P^{-1}A^kP)(P^{-1}AP) \\
&= P^{-1}A^k(PP^{-1})AP \\
&= P^{-1}A^k(I)AP \\
&= P^{-1}A^{k+1}P.
\end{aligned}
$$
对于 $k=0$，$B^0 = I$，$A^0 = I$，显然 $I = P^{-1}IP$ 成立。
因此，对于所有整数 $k \geq 0$，$A^k$ 和 $B^k$ 相似（通过同一个矩阵 $P$）。

相似与共轭将线性代数从单纯的计算提升到了结构理解的高度。它们告诉我们，何时两个看似不同的矩阵只是同一个底层变换的不同“面孔”。