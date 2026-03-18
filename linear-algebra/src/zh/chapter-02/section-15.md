### 15. 矩阵与矩阵的乘积（线性步骤的复合）

在理解了矩阵如何作用于向量之后，自然的下一步是理解一个矩阵如何作用于另一个矩阵。这就引出了**矩阵与矩阵的乘积**（Matrix–Matrix Product），这是一种将两个矩阵组合成一个新矩阵的规则。虽然最初的算术运算看起来有些复杂，但其背后的思想非常优雅：**两个矩阵相乘代表了两个线性变换的复合**。

#### 代数规则

假设 $A$ 是一个 $m \times n$ 矩阵，$B$ 是一个 $n \times p$ 矩阵。它们的乘积 $C = AB$ 是一个 $m \times p$ 矩阵，定义为：

$$
c_{ij} = \sum_{k=1}^n a_{ik} b_{kj}.
$$

也就是说：$C$ 中的每个元素都是 $A$ 的第 $i$ 行与 $B$ 的第 $j$ 列的**点积**（dot product）。

> **注意**：矩阵乘法有一个重要的前提条件——**维度匹配**。$A$ 的列数必须等于 $B$ 的行数。如果 $A$ 是 $m \times n$，$B$ 是 $n \times p$，结果 $C$ 将是 $m \times p$。你可以形象地记住：$(m \times \mathbf{n}) \cdot (\mathbf{n} \times p) \to (m \times p)$，中间的 $n$ 必须“抵消”。

#### 示例：2×3 矩阵乘以 3×2 矩阵

$$
A = 
\begin{bmatrix} 
1 & 2 & 3 \\ 
4 & 5 & 6 
\end{bmatrix}, \quad 
B = 
\begin{bmatrix} 
7 & 8 \\ 
9 & 10 \\ 
11 & 12 
\end{bmatrix}.
$$

乘积：$C = AB$ 将是一个 2×2 矩阵。

- $c_{11} = 1\cdot 7 + 2\cdot 9 + 3\cdot 11 = 58$.
- $c_{12} = 1\cdot 8 + 2\cdot 10 + 3\cdot 12 = 64$.
- $c_{21} = 4\cdot 7 + 5\cdot 9 + 6\cdot 11 = 139$.
- $c_{22} = 4\cdot 8 + 5\cdot 10 + 6\cdot 12 = 154$.

所以：

$$
C = 
\begin{bmatrix} 
58 & 64 \\ 
139 & 154 
\end{bmatrix}.
$$

我们可以使用 Python 的 `numpy` 库来验证这个计算：

```python
import numpy as np

A = np.array([[1, 2, 3], 
              [4, 5, 6]])
B = np.array([[7, 8], 
              [9, 10], 
              [11, 12]])

# 使用 @ 符号或 np.dot 进行矩阵乘法
C = A @ B 

print("矩阵 C = AB:")
print(C)
# 输出应为：
# [[ 58  64]
#  [139 154]]
```

#### 列视角：列的线性组合

从列的角度来看，$AB$ 的计算可以通过将 $A$ 作用于 $B$ 的每一列来完成。

如果 $B = [b_1 \; b_2 \; \cdots \; b_p]$，其中 $b_j$ 是 $B$ 的列向量，那么：

$$
AB = [A b_1 \; A b_2 \; \cdots \; A b_p].
$$

也就是说：用 $A$ 分别乘以 $B$ 的每一列。这通常是理解矩阵乘积最简单的方式。**$AB$ 的每一列都是 $A$ 的列的线性组合**，组合系数来自 $B$ 的对应列。

#### 行视角：行的线性组合

从行的角度来看，$AB$ 的每一行是通过使用 $A$ 中某一行的系数组合 $B$ 的行形成的。这种对偶视角虽然不如列视角常见，但在证明和算法推导中同样有用。

#### 机器视角：变换的复合

最重要的解释是**机器视角**：矩阵相乘对应于变换的复合。

- 如果 $A$ 映射 $\mathbb{R}^n \to \mathbb{R}^m$ 且 $B$ 映射 $\mathbb{R}^p \to \mathbb{R}^n$，那么 $AB$ 映射 $\mathbb{R}^p \to \mathbb{R}^m$。
- 用语言描述：**先执行 $B$，再执行 $A$**。

> **提示**：为什么顺序是“先 B 后 A"？
> 考虑向量 $x$ 作用于乘积 $AB$：$(AB)x = A(Bx)$。根据括号优先原则，向量 $x$ 先被 $B$ 变换，得到的结果再被 $A$ 变换。这与函数复合 $f(g(x))$ 的记法是一致的。

示例：

- 设 $B$ 将向量旋转 90°。
- 设 $A$ 将向量缩放 2 倍。
- 那么 $AB$ 表示先旋转再缩放——两个步骤合并为一个变换。

#### 几何示例

1. 先缩放后旋转（注意：这里矩阵乘法顺序对应变换顺序的逆序，若 $AB$ 作用于 $x$，则是先 $B$ 后 $A$）：

$$
A = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}, \quad 
B = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}.
$$

则 $AB$ 表示先将向量旋转 90°（由 $B$ 完成），然后再缩放 2 倍（由 $A$ 完成）。

2. 先投影后反射：
   如果 $B$ 投影到 x 轴，而 $A$ 关于 y 轴反射，那么 $AB$ 代表“先投影，后反射”。

#### 矩阵乘法的性质

1. **结合律**：$(AB)C = A(BC)$。
2. **分配律**：$A(B + C) = AB + AC$。
3. **不满足交换律**：一般情况下，$AB \neq BA$。**顺序至关重要！**
4. **单位元**：$AI = IA = A$，其中 $I$ 是单位矩阵。

这些性质强调，虽然乘法是有结构的，但它不是对称的。顺序编码了变换操作的先后次序。

#### 生活中的类比

- **烹饪步骤**：如果 $B$ 是“切菜”，$A$ 是“炒菜”，那么 $AB$ 是“切完后炒”。反过来做（$BA$，先炒后切）就没有意义了！
- **装配线**：每台机器（矩阵）对输入执行一个操作。将它们链接起来对应于矩阵相乘。
- **地图与路线**：从家到车站（$B$），再从车站到办公室（$A$）等于组合路线家→办公室（$AB$）。

#### 为什么它很重要

矩阵乘法是线性代数的核心，因为：

1. 它以代数形式编码了函数复合。
2. 它提供了一种将多个变换捕获到单个矩阵中的方法。
3. 它是计算机图形学、机器人技术、统计学和机器学习算法的基础。
4. 它揭示了更深层的结构，如交换律的失效，这反映了现实世界中操作顺序的重要性。

线性代数的几乎每一个应用——解方程、计算特征值、训练神经网络——都依赖于高效的矩阵乘法。

#### 动手试一试

1. 计算

$$
\begin{bmatrix} 
1 & 0 \\ 
2 & 3 
\end{bmatrix}
\begin{bmatrix} 
4 & 5 \\ 
6 & 7 
\end{bmatrix}.
$$

2. 证明对于以下矩阵，$AB \neq BA$：

$$
A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}, 
\quad 
B = \begin{bmatrix} 0 & 0 \\ 1 & 0 \end{bmatrix}.
$$

3. 构造两个 2×2 矩阵使得 $AB = BA$。为什么在这里交换律成立？

4. **挑战**：如果 $A$ 是投影矩阵，$B$ 是旋转矩阵，计算 $AB$ 和 $BA$。它们代表相同的几何操作吗？

---

### 解答与详细过程

#### 1. 矩阵乘法计算

**题目**：
$$
\begin{bmatrix} 
1 & 0 \\ 
2 & 3 
\end{bmatrix}
\begin{bmatrix} 
4 & 5 \\ 
6 & 7 
\end{bmatrix}
$$

**解答过程**：
设结果为 $C$，根据行乘列规则：
- $c_{11} = 1\cdot 4 + 0\cdot 6 = 4$
- $c_{12} = 1\cdot 5 + 0\cdot 7 = 5$
- $c_{21} = 2\cdot 4 + 3\cdot 6 = 8 + 18 = 26$
- $c_{22} = 2\cdot 5 + 3\cdot 7 = 10 + 21 = 31$

**结果**：
$$
C = \begin{bmatrix} 4 & 5 \\ 26 & 31 \end{bmatrix}
$$

#### 2. 证明不满足交换律

**题目**：
$$
A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}, 
\quad 
B = \begin{bmatrix} 0 & 0 \\ 1 & 0 \end{bmatrix}
$$

**解答过程**：
计算 $AB$：
$$
AB = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} 0 & 0 \\ 1 & 0 \end{bmatrix} = \begin{bmatrix} 0\cdot 0 + 1\cdot 1 & 0\cdot 0 + 1\cdot 0 \\ 0\cdot 0 + 0\cdot 1 & 0\cdot 0 + 0\cdot 0 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}
$$

计算 $BA$：
$$
BA = \begin{bmatrix} 0 & 0 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} 0\cdot 0 + 0\cdot 0 & 0\cdot 1 + 0\cdot 0 \\ 1\cdot 0 + 0\cdot 0 & 1\cdot 1 + 0\cdot 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & 1 \end{bmatrix}
$$

**结论**：
显然 $\begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix} \neq \begin{bmatrix} 0 & 0 \\ 0 & 1 \end{bmatrix}$，所以 $AB \neq BA$。

#### 3. 构造可交换的矩阵

**题目**：构造两个 2×2 矩阵使得 $AB = BA$。

**解答方案**：
最简单的情况是使用**单位矩阵**或**对角矩阵**。
设 $A = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$ (标量矩阵)，$B = \begin{bmatrix} 1 & 3 \\ 4 & 5 \end{bmatrix}$ (任意矩阵)。

**验证**：
$$
AB = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix} \begin{bmatrix} 1 & 3 \\ 4 & 5 \end{bmatrix} = \begin{bmatrix} 2 & 6 \\ 8 & 10 \end{bmatrix}
$$
$$
BA = \begin{bmatrix} 1 & 3 \\ 4 & 5 \end{bmatrix} \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix} = \begin{bmatrix} 2 & 6 \\ 8 & 10 \end{bmatrix}
$$

**为什么成立？**
当其中一个矩阵是标量矩阵（$kI$）时，它代表均匀缩放变换。均匀缩放与任何线性变换都是可交换的，因为无论你先旋转再缩放，还是先缩放再旋转，结果是一样的。另外，如果两个矩阵共享相同的特征向量基（例如都是对角矩阵），它们通常也是可交换的。

#### 4. 挑战：投影与旋转

**题目**：设 $A$ 为投影，$B$ 为旋转，比较 $AB$ 与 $BA$。

**解答方案**：
定义具体的矩阵：
- 设 $B$ 为逆时针旋转 90°：$B = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$。
- 设 $A$ 为投影到 x 轴：$A = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}$。

**计算 $AB$ (先旋转，后投影)**：
$$
AB = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} = \begin{bmatrix} 0 & -1 \\ 0 & 0 \end{bmatrix}
$$
几何意义：向量先旋转 90°（$(x, y) \to (-y, x)$），然后投影到 x 轴（保留第一个分量，第二个变 0）。结果是将 $(x, y)$ 变为 $(-y, 0)$。

**计算 $BA$ (先投影，后旋转)**：
$$
BA = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 1 & 0 \end{bmatrix}
$$
几何意义：向量先投影到 x 轴（$(x, y) \to (x, 0)$），然后旋转 90°（$(x, 0) \to (0, x)$）。结果是将 $(x, y)$ 变为 $(0, x)$。

**结论**：
$AB \neq BA$。它们**不代表**相同的几何操作。
- $AB$ 将向量映射到 x 轴上（具体是负 y 值的位置）。
- $BA$ 将向量映射到 y 轴上。
这再次证明了线性变换的顺序至关重要。

#### Python 验证代码

你可以运行以下代码来验证上述所有练习的答案：

```python
import numpy as np

# 练习 1
A1 = np.array([[1, 0], [2, 3]])
B1 = np.array([[4, 5], [6, 7]])
print("练习 1 结果:\n", A1 @ B1)

# 练习 2
A2 = np.array([[0, 1], [0, 0]])
B2 = np.array([[0, 0], [1, 0]])
print("\n练习 2 AB:\n", A2 @ B2)
print("练习 2 BA:\n", B2 @ A2)
print("AB 等于 BA 吗？", np.array_equal(A2 @ B2, B2 @ A2))

# 练习 3 (可交换示例)
A3 = 2 * np.eye(2) # 2 * 单位矩阵
B3 = np.array([[1, 3], [4, 5]])
print("\n练习 3 AB:\n", A3 @ B3)
print("练习 3 BA:\n", B3 @ A3)

# 练习 4 (投影与旋转)
A_proj = np.array([[1, 0], [0, 0]]) # 投影到 x 轴
B_rot = np.array([[0, -1], [1, 0]]) # 旋转 90 度
print("\n练习 4 AB (先旋转后投影):\n", A_proj @ B_rot)
print("练习 4 BA (先投影后旋转):\n", B_rot @ A_proj)
```

通过这些视角，矩阵与矩阵的乘积从一个机械的公式转变为一种组合线性步骤的语言——每个乘积都在讲述“先做这个，再做那个”的故事。