### 14. 矩阵与向量的乘积（列的线性组合）

我们现在来到了线性代数中最核心的运算之一：**矩阵与向量的乘积**（Matrix-Vector Product）。这个运算接受一个矩阵 $A$ 和一个向量 $\mathbf{x}$，并生成一个新的向量。虽然计算过程本身很直接，但其背后的几何与代数意义非常深远：它可以被看作是行的组合、列的组合，或者视为应用了一个线性变换。这是将矩阵与向量空间几何结构联系起来的关键运算。

#### 代数规则

假设 $A$ 是一个 $m \times n$ 的矩阵，$\mathbf{x}$ 是 $\mathbb{R}^n$ 空间中的一个向量。乘积 $A\mathbf{x}$ 是 $\mathbb{R}^m$ 空间中的一个向量，定义如下：

$$
A = 
\begin{bmatrix} 
a_{11} & a_{12} & \cdots & a_{1n} \\ 
a_{21} & a_{22} & \cdots & a_{2n} \\ 
\vdots & \vdots & \ddots & \vdots \\ 
a_{m1} & a_{m2} & \cdots & a_{mn} 
\end{bmatrix}, 
\quad
\mathbf{x} = 
\begin{bmatrix} 
x_1 \\ x_2 \\ \vdots \\ x_n
\end{bmatrix}.
$$

那么：

$$
A\mathbf{x} =
\begin{bmatrix} 
a_{11}x_1 + a_{12}x_2 + \cdots + a_{1n}x_n \\ 
a_{21}x_1 + a_{22}x_2 + \cdots + a_{2n}x_n \\ 
\vdots \\ 
a_{m1}x_1 + a_{m2}x_2 + \cdots + a_{mn}x_n
\end{bmatrix}.
$$

输出向量的每一个元素，都是矩阵 $A$ 的某一行与向量 $\mathbf{x}$ 的点积。

> **注意**：矩阵乘法的要求是“内维匹配”。矩阵 $A$ 的列数（$n$）必须等于向量 $\mathbf{x}$ 的行数（$n$）。结果向量的维度由矩阵 $A$ 的行数（$m$）决定。

#### Python 数值演示

我们可以使用 Python 的 `numpy` 库来验证上述计算规则。以下代码演示了如何计算矩阵与向量的乘积：

```python
import numpy as np

# 定义矩阵 A (3x2)
A = np.array([
    [2, 1],
    [3, 4],
    [-1, 2]
])

# 定义向量 x (2x1)
x = np.array([5, -1])

# 计算矩阵向量乘积
# 在 numpy 中，可以使用 @ 运算符或 np.dot 函数
result = A @ x 

print("计算结果:", result)
# 输出应为: [ 9 11 -7]
```

#### 行视角：点积

从行的角度来看，$A\mathbf{x}$ 是逐行计算的：

- 取出 $A$ 的每一行。
- 将该行与 $\mathbf{x}$ 做点积。
- 计算结果成为输出向量中的一个元素。

示例：

$$
A =
\begin{bmatrix} 
2 & 1 \\ 
3 & 4 \\ 
-1 & 2 
\end{bmatrix}, \quad
\mathbf{x} =
\begin{bmatrix} 
5 \\ 
-1 
\end{bmatrix}.
$$

- 第一行与 x 点积：$2(5) + 1(-1) = 9$.
- 第二行与 x 点积：$3(5) + 4(-1) = 11$.
- 第三行与 x 点积：$(-1)(5) + 2(-1) = -7$.

所以：

$$
A\mathbf{x} = 
\begin{bmatrix} 
9 \\ 11 \\ -7 
\end{bmatrix}.
$$

#### 列视角：线性组合

从列的角度来看，$A\mathbf{x}$ 是矩阵 $A$ 各列的**线性组合**。

如果

$$
A = 
\begin{bmatrix} 
| & | &  & | \\ 
a_1 & a_2 & \cdots & a_n \\ 
| & | &  & |
\end{bmatrix}, 
\quad
\mathbf{x} =
\begin{bmatrix} 
x_1 \\ x_2 \\ \vdots \\ x_n
\end{bmatrix},
$$

那么：

$$
A\mathbf{x} = x_1 a_1 + x_2 a_2 + \cdots + x_n a_n.
$$

也就是说：用 $\mathbf{x}$ 中的对应元素乘以 $A$ 的每一列，然后将它们相加。

> **提示**：列视角是理解线性代数最关键的观点之一。它直接联系了“张成空间”（Span）的概念：当 $\mathbf{x}$ 变化时，所有可能的向量 $A\mathbf{x}$ 构成的集合，恰好就是 $A$ 的列向量所张成的空间（即列空间）。

#### 机器视角：线性变换

机器视角将上述观点统一起来：用矩阵乘以向量，意味着应用了该矩阵所代表的**线性变换**。

- 如果 $A$ 是一个 2×2 旋转矩阵，那么 $A\mathbf{x}$ 会将向量 $\mathbf{x}$ 旋转。
- 如果 $A$ 是一个缩放矩阵，那么 $A\mathbf{x}$ 会将 $\mathbf{x}$ 拉伸或收缩。
- 如果 $A$ 是一个投影矩阵，那么 $A\mathbf{x}$ 会将 $\mathbf{x}$ 投影到某条线或平面上。

因此，这个代数定义编码了深刻的几何和功能意义。

#### 几何作用示例

1. 缩放：

$$
A = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}.
$$

此时 $A\mathbf{x}$ 会将任意向量 $\mathbf{x}$ 的长度加倍。

2. 反射：

$$
A = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}.
$$

这会将向量关于 x 轴进行翻转。

3. 旋转 θ 角：

$$
A = \begin{bmatrix} \cosθ & -\sinθ \\ \sinθ & \cosθ \end{bmatrix}.
$$

这会将平面上的向量逆时针旋转 θ 角。

#### 生活类比

- **混合食材**：向量 $\mathbf{x}$ 是食谱（各食材的用量），矩阵 $A$ 的列是食材的营养成分。乘积 $A\mathbf{x}$ 就是最终混合物的总营养。
- **加权平均**：学生的最终成绩是一个矩阵 - 向量乘积：权重（向量）乘以各项得分（矩阵列）。
- **信号处理**：将输入信号与权重结合产生新输出，就像用权重向量乘以信号矩阵一样。

#### 为什么它很重要

矩阵与向量的乘积是线性代数中一切内容的基石：

1. 它定义了矩阵作为线性映射的作用。
2. 它直接联系了张成空间（Span）和维数（列生成所有可能的输出）。
3. 它是求解线性方程组、特征值问题和矩阵分解的基础。
4. 它是应用数学计算的引擎，从计算机图形学到机器学习（例如，神经网络每秒计算数十亿次矩阵 - 向量乘积）。

#### 试一试 (Try It Yourself)

1. 计算

$$
\begin{bmatrix} 
1 & 2 & 3 \\ 
4 & 5 & 6 
\end{bmatrix}
\begin{bmatrix} 
2 \\ 
0 \\ 
1 
\end{bmatrix}.
$$

2. 将上述乘积的结果表示为矩阵列的线性组合。

3. 构造一个 2×2 矩阵，使其能将向量关于直线 $y = x$ 进行反射。并在向量 (1, 0) 和 (0, 1) 上测试该矩阵。

4. 挑战：对于一个 3×3 矩阵，证明所有可能的 $A\mathbf{x}$（当 $\mathbf{x}$ 变化时）构成的集合恰好是 $A$ 的列空间。

#### 练习题解答与解析

**1. 计算矩阵向量乘积**

**解答过程：**
根据代数规则，结果向量的第 $i$ 个元素是矩阵第 $i$ 行与向量的点积。
设 $A = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{bmatrix}$，$\mathbf{x} = \begin{bmatrix} 2 \\ 0 \\ 1 \end{bmatrix}$。

- 第一行计算：$1 \times 2 + 2 \times 0 + 3 \times 1 = 2 + 0 + 3 = 5$
- 第二行计算：$4 \times 2 + 5 \times 0 + 6 \times 1 = 8 + 0 + 6 = 14$

**结果：**
$$
\begin{bmatrix} 
5 \\ 
14 
\end{bmatrix}
$$

**Python 验证：**
```python
import numpy as np
A = np.array([[1, 2, 3], [4, 5, 6]])
x = np.array([2, 0, 1])
print(A @ x)  # 输出: [ 5 14]
```

---

**2. 表示为列的线性组合**

**解答过程：**
根据列视角，$A\mathbf{x} = x_1 \mathbf{a}_1 + x_2 \mathbf{a}_2 + x_3 \mathbf{a}_3$，其中 $\mathbf{a}_i$ 是 $A$ 的第 $i$ 列。
矩阵 $A$ 的列分别为：
$\mathbf{a}_1 = \begin{bmatrix} 1 \\ 4 \end{bmatrix}, \quad \mathbf{a}_2 = \begin{bmatrix} 2 \\ 5 \end{bmatrix}, \quad \mathbf{a}_3 = \begin{bmatrix} 3 \\ 6 \end{bmatrix}$。
向量 $\mathbf{x}$ 的分量为 $x_1=2, x_2=0, x_3=1$。

**结果：**
$$
2 \begin{bmatrix} 1 \\ 4 \end{bmatrix} + 0 \begin{bmatrix} 2 \\ 5 \end{bmatrix} + 1 \begin{bmatrix} 3 \\ 6 \end{bmatrix} = \begin{bmatrix} 5 \\ 14 \end{bmatrix}
$$
这直观地展示了结果向量是如何由列向量加权生成的。

---

**3. 构造关于 $y=x$ 的反射矩阵**

**解答过程：**
关于直线 $y=x$ 反射意味着交换坐标。即点 $(a, b)$ 变为 $(b, a)$。
我们需要找到矩阵 $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$ 使得：
$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} y \\ x \end{bmatrix}
$$
这意味着 $ax + by = y$ 且 $cx + dy = x$。
显然，$a=0, b=1, c=1, d=0$ 满足条件。
构造矩阵：
$$
A = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}
$$

**测试：**
- 对 $(1, 0)$：
$$
\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 1 \end{bmatrix}
$$
(1, 0) 被反射到了 (0, 1)。
- 对 $(0, 1)$：
$$
\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}
$$
(0, 1) 被反射到了 (1, 0)。

**Python 验证：**
```python
A_reflect = np.array([[0, 1], [1, 0]])
v1 = np.array([1, 0])
v2 = np.array([0, 1])
print(A_reflect @ v1)  # 输出: [0 1]
print(A_reflect @ v2)  # 输出: [1 0]
```

---

**4. 挑战：证明 $A\mathbf{x}$ 的集合是列空间**

**解答过程：**
**定义回顾**：
- 矩阵 $A$ 的列空间（Column Space），记为 $C(A)$，定义为 $A$ 的所有列向量的所有线性组合构成的集合。
- 设 $A$ 的列为 $\mathbf{a}_1, \mathbf{a}_2, \mathbf{a}_3$。则 $C(A) = \{ c_1 \mathbf{a}_1 + c_2 \mathbf{a}_2 + c_3 \mathbf{a}_3 \mid c_1, c_2, c_3 \in \mathbb{R} \}$。

**证明**：
1.  根据矩阵与向量乘积的**列视角**定义，对于任意向量 $\mathbf{x} = \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix}$，乘积 $A\mathbf{x}$ 可以写为：
    $$
    A\mathbf{x} = x_1 \mathbf{a}_1 + x_2 \mathbf{a}_2 + x_3 \mathbf{a}_3
    $$
2.  这里 $x_1, x_2, x_3$ 是任意实数（因为 $\mathbf{x}$ 可以在 $\mathbb{R}^3$ 中任意变化）。
3.  因此，集合 $\{ A\mathbf{x} \mid \mathbf{x} \in \mathbb{R}^3 \}$ 恰好就是所有形如 $x_1 \mathbf{a}_1 + x_2 \mathbf{a}_2 + x_3 \mathbf{a}_3$ 的向量集合。
4.  这正是列空间 $C(A)$ 的定义。

**结论**：
所有可能的输出向量 $A\mathbf{x}$ 构成的集合，在数学上严格等于矩阵 $A$ 的列空间。这一结论对于理解线性方程组 $A\mathbf{x}=\mathbf{b}$ 何时有解至关重要（即 $\mathbf{b}$ 必须在 $A$ 的列空间内）。

通过掌握矩阵 - 向量乘积的计算规则及其多种解释，你将获得线性代数中最重要的洞察：**矩阵不仅仅是数字表格，它们是变换空间的引擎。**