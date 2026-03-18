### 47. 投影与反射

在线性代数众多的变换中，有两种变换因其几何直观性和实际重要性而脱颖而出：**投影（Projections）**和**反射（Reflections）**。这两种操作以简单而强大的方式重塑向量，它们是统计学、优化理论、计算机图形学和物理学中算法的基石。

#### 投影： flattening 到子空间

投影是一种线性变换，它将一个向量“ dropping"到一个子空间上，就像投射影子一样。

形式上，如果 $W$ 是 $V$ 的一个子空间，向量 $v$ 到 $W$ 的投影是 $W$ 中唯一最接近 $v$ 的向量 $w \in W$。

在 $\mathbb{R}^2$ 中：投影到 x 轴会将 $(x,y)$ 变为 $(x,0)$。

##### 正交投影公式

假设 $u$ 是一个非零向量。向量 $v$ 到由 $u$ 张成的直线上的投影为：

$$
\text{proj}_u(v) = \frac{v \cdot u}{u \cdot u} u.
$$

这个公式适用于任何维度。它利用点积来衡量 $v$ 有多少分量指向 $u$ 的方向。

**示例：**
将 $(2,3)$ 投影到 $u=(1,1)$ 上：

$$
\text{proj}_u(2,3) = \frac{(2,3)\cdot(1,1)}{(1,1)\cdot(1,1)} (1,1) = \frac{5}{2}(1,1) = (2.5,2.5).
$$

向量 $(2,3)$ 被分解为沿直线方向的 $(2.5,2.5)$ 和垂直于该直线的 $(-0.5,0.5)$。

> **注意**：投影的核心思想是“最佳逼近”。误差向量 $v - \text{proj}_u(v)$ 始终与子空间正交。

##### 投影矩阵

对于单位向量 $u$（即 $\|u\|=1$）：

$$
P = uu^T
$$

是到 $u$ 张成空间上的投影矩阵。

对于具有标准正交基列的一般子空间（矩阵 $Q$ 的列为标准正交基）：

$$
P = QQ^T
$$

将任何向量投影到该子空间上。

**性质：**

1. $P^2 = P$（幂等性）。
2. $P^T = P$（对称性，针对正交投影）。

> **提示**：如果 $u$ 不是单位向量，投影矩阵公式应为 $P = \frac{uu^T}{u^T u}$。只有当 $u$ 是单位向量时，$u^T u = 1$，公式才简化为 $uu^T$。

**Python 数值演示：投影矩阵**

```python
import numpy as np

# 定义向量 u 和 v
u = np.array([1, 1])
v = np.array([2, 3])

# 1. 使用公式计算投影向量
# 注意：这里 u 不是单位向量，所以分母需要 u dot u
proj_v = (np.dot(v, u) / np.dot(u, u)) * u
print(f"投影向量：{proj_v}")  # 应输出 [2.5 2.5]

# 2. 构造投影矩阵 P
# 通用公式 P = (u * u.T) / (u.T * u)
u_col = u.reshape(-1, 1)  # 转为列向量
P = (u_col @ u_col.T) / (u_col.T @ u_col)
print(f"投影矩阵 P:\n{P}")

# 3. 验证性质：P^2 = P 和 P^T = P
print(f"P^2 是否等于 P: {np.allclose(P @ P, P)}")
print(f"P^T 是否等于 P: {np.allclose(P.T, P)}")

# 4. 使用矩阵乘法验证投影结果
v_col = v.reshape(-1, 1)
proj_v_matrix = (P @ v_col).flatten()
print(f"矩阵法投影结果：{proj_v_matrix}")
```

#### 反射：跨越子空间翻转

反射将一个向量跨越一条线或一个平面进行翻转。几何上，它就像照镜子。

跨越由单位向量 $u$ 张成的直线的反射：

$$
R(v) = 2\text{proj}_u(v) - v.
$$

矩阵形式：

$$
R = 2uu^T - I.
$$

**示例：**
跨越直线 $y=x$ 反射 $(2,3)$。取 $u=(1/\sqrt{2},1/\sqrt{2})$：

$$
R = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}.
$$

因此反射交换了坐标：$(2,3) \mapsto (3,2)$。

> **注意**：反射矩阵 $R$ 是正交矩阵，意味着它保持向量长度不变（$\|Rv\| = \|v\|$），但改变方向。

**Python 数值演示：反射矩阵**

```python
# 接上面的代码环境
# 定义单位向量 u (沿 y=x 方向)
u_unit = np.array([1/np.sqrt(2), 1/np.sqrt(2)])
u_unit_col = u_unit.reshape(-1, 1)

# 构造反射矩阵 R = 2uu^T - I
I = np.eye(2)
R = 2 * (u_unit_col @ u_unit_col.T) - I
print(f"反射矩阵 R:\n{R}")

# 验证反射效果
v_test = np.array([2, 3])
v_reflected = R @ v_test
print(f"原始向量：{v_test}, 反射后：{v_reflected}") # 应接近 [3. 2.]

# 验证正交性：R^T * R = I
print(f"R 是否正交 (R^T R = I): {np.allclose(R.T @ R, I)}")
```

#### 几何洞察

- 投影通过移除垂直于子空间的分量来缩短向量。
- 反射保持长度不变，但相对于子空间翻转方向。
- 投影关乎逼近（“最近点”），反射关乎对称。

#### 日常类比

- **投影**：手电筒将你手的 3D 形状投射到 2D 墙壁上。
- **反射**：镜子翻转你的左右两侧。
- **统计学**：投影对应于回归分析——寻找数据的最佳线性逼近。
- **设计**：反射对称性广泛存在于艺术和建筑中。

#### 应用场景

1. **统计学与机器学习**：最小二乘回归是将数据投影到预测变量张成的空间上。
2. **计算机图形学**：投影将 3D 场景变换为 2D 屏幕图像。反射模拟镜子和光滑表面。
3. **优化**：投影通过将猜测值带回可行区域来强制执行约束。
4. **物理学**：反射描述波的行为、光学和粒子相互作用。
5. **数值方法**：投影算子是迭代算法（如 Krylov 子空间方法）的关键。

#### 为什么这很重要

1. 投影捕捉了逼近的本质：保留拟合的部分，丢弃不拟合的部分。
2. 反射体现了对称性和不变性，这是几何和物理学的关键。
3. 两者都是线性的，具有优雅的矩阵表示。
4. 它们很容易与其他变换组合，使其在计算中用途广泛。

#### 动手试一试

1. 求到由 $(3,4)$ 张成的直线的投影矩阵。验证它是幂等的。
2. 计算 $(1,2)$ 跨越 x 轴的反射。
3. 证明反射矩阵是正交的（$R^T R = I$）。
4. **挑战**：对于具有标准正交基 $Q$ 的子空间 $W$，推导反射矩阵 $R = 2QQ^T - I$。

#### 练习题解答

**1. 求到由 $(3,4)$ 张成的直线的投影矩阵。验证它是幂等的。**

**解答：**
设向量 $u = \begin{bmatrix} 3 \\ 4 \end{bmatrix}$。
由于 $u$ 不是单位向量，我们使用通用投影矩阵公式：
$$
P = \frac{uu^T}{u^T u}
$$
首先计算分母（点积）：
$$
u^T u = 3^2 + 4^2 = 9 + 16 = 25
$$
接着计算分子（外积）：
$$
uu^T = \begin{bmatrix} 3 \\ 4 \end{bmatrix} \begin{bmatrix} 3 & 4 \end{bmatrix} = \begin{bmatrix} 9 & 12 \\ 12 & 16 \end{bmatrix}
$$
因此，投影矩阵为：
$$
P = \frac{1}{25} \begin{bmatrix} 9 & 12 \\ 12 & 16 \end{bmatrix} = \begin{bmatrix} 0.36 & 0.48 \\ 0.48 & 0.64 \end{bmatrix}
$$
**验证幂等性 ($P^2 = P$)：**
$$
P^2 = \left( \frac{1}{25} \begin{bmatrix} 9 & 12 \\ 12 & 16 \end{bmatrix} \right) \left( \frac{1}{25} \begin{bmatrix} 9 & 12 \\ 12 & 16 \end{bmatrix} \right) = \frac{1}{625} \begin{bmatrix} 81+144 & 108+192 \\ 108+192 & 144+256 \end{bmatrix}
$$
$$
= \frac{1}{625} \begin{bmatrix} 225 & 300 \\ 300 & 400 \end{bmatrix} = \frac{25}{625} \begin{bmatrix} 9 & 12 \\ 12 & 16 \end{bmatrix} = \frac{1}{25} \begin{bmatrix} 9 & 12 \\ 12 & 16 \end{bmatrix} = P
$$
验证成立。

**2. 计算 $(1,2)$ 跨越 x 轴的反射。**

**解答：**
**几何法：**
x 轴是水平线 $y=0$。跨越 x 轴反射意味着保持 x 坐标不变，将 y 坐标取反。
$$
(x, y) \mapsto (x, -y)
$$
所以，$(1, 2) \mapsto (1, -2)$。

**矩阵法：**
x 轴的方向向量为单位向量 $u = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$。
反射矩阵公式 $R = 2uu^T - I$：
$$
uu^T = \begin{bmatrix} 1 \\ 0 \end{bmatrix} \begin{bmatrix} 1 & 0 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}
$$
$$
R = 2 \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix} - \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 2 & 0 \\ 0 & 0 \end{bmatrix} - \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}
$$
应用矩阵：
$$
R \begin{bmatrix} 1 \\ 2 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix} \begin{bmatrix} 1 \\ 2 \end{bmatrix} = \begin{bmatrix} 1 \\ -2 \end{bmatrix}
$$
结果一致。

**3. 证明反射矩阵是正交的（$R^T R = I$）。**

**解答：**
假设 $u$ 是单位向量，反射矩阵为 $R = 2uu^T - I$。
首先，注意到 $R$ 是对称的，因为 $(uu^T)^T = uu^T$ 且 $I^T = I$，所以 $R^T = R$。
我们需要证明 $R^2 = I$（因为 $R^T R = R^2$）。
$$
\begin{aligned}
R^2 &= (2uu^T - I)(2uu^T - I) \\
&= 4(uu^T)(uu^T) - 2uu^T - 2uu^T + I^2 \\
&= 4u(u^T u)u^T - 4uu^T + I
\end{aligned}
$$
由于 $u$ 是单位向量，$u^T u = 1$。因此：
$$
\begin{aligned}
R^2 &= 4u(1)u^T - 4uu^T + I \\
&= 4uu^T - 4uu^T + I \\
&= I
\end{aligned}
$$
因为 $R^T R = R^2 = I$，所以 $R$ 是正交矩阵。
> **注**：这也说明反射是等距变换，不改变向量长度。

**4. 挑战：对于子空间 $W$ 具有标准正交基 $Q$，推导反射矩阵 $R = 2QQ^T - I$。**

**解答：**
**推导过程：**
1.  **投影矩阵**：对于具有标准正交基列的矩阵 $Q$（即 $Q^T Q = I$），到该子空间 $W$ 的正交投影矩阵为 $P = QQ^T$。
    这意味着对于任意向量 $v$，其在 $W$ 上的投影为 $p = Pv = QQ^T v$。
2.  **反射定义**：向量 $v$ 关于子空间 $W$ 的反射向量 $v'$ 定义为：
    $$
    v' = 2p - v
    $$
    几何解释是：从 $v$ 走到投影点 $p$ 的距离是 $p-v$，再走同样的距离到达反射点，即 $p + (p-v) = 2p - v$。
3.  **代入投影矩阵**：
    $$
    v' = 2(QQ^T v) - v = (2QQ^T)v - Iv = (2QQ^T - I)v
    $$
4.  **结论**：因此，实现该变换的矩阵为：
    $$
    R = 2QQ^T - I
    $$
    当子空间是一条直线且 $Q$ 为单位向量 $u$ 时，$QQ^T = uu^T$，这就回到了之前的公式 $R = 2uu^T - I$。

```python
# 挑战题验证代码：子空间反射
import numpy as np

# 定义一个 R^3 中的平面子空间，由两个正交单位向量张成
q1 = np.array([1, 0, 0])
q2 = np.array([0, 1, 0])
Q = np.column_stack((q1, q2)) # 3x2 矩阵

# 构造反射矩阵 R = 2QQ^T - I
I = np.eye(3)
R = 2 * (Q @ Q.T) - I
print("平面反射矩阵 R:\n", R)
# 对于 xy 平面，z 轴应该被翻转，x,y 不变
# 预期结果应该是对角线 [1, 1, -1]

# 测试向量 v = (1, 2, 3)
v = np.array([1, 2, 3])
v_reflected = R @ v
print(f"原始：{v}, 反射后：{v_reflected}") 
# 预期：(1, 2, -3)
```

投影和反射是线性变换如何体现几何思想的最纯粹的例子之一。一个用于逼近，另一个用于对称——但两者都通过线性代数的 lens 揭示了空间的深层结构。