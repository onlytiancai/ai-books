### 48. 旋转与剪切变换

线性变换就像空间的魔法，能够以截然不同的方式扭曲、转动和变形空间。其中两个最基础且重要的例子是**旋转（Rotations）**和**剪切（Shears）**。旋转在转动向量的同时保持长度和角度不变；而剪切则让空间的一部分相对于另一部分滑动，虽然形状发生了扭曲，但往往保持面积不变。这两种变换构成了线性代数的几何核心，在计算机图形学、物理学和工程学中不可或缺。

#### 平面上的旋转

在二维空间 $\mathbb{R}^2$ 中，绕原点逆时针旋转角度 $\theta$ 的变换定义为：

$$
R_\theta = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}.
$$

对于任意向量 $(x,y)$，变换后的结果为：

$$
R_\theta \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} x\cos\theta - y\sin\theta \\ x\sin\theta + y\cos\theta \end{bmatrix}.
$$

**主要性质：**

1.  **保持长度不变**：$\|R_\theta v\| = \|v\|$。
2.  **保持角度不变**：向量间的点积保持不变。
3.  **行列式为 +1**：$\det(R_\theta) = 1$，这意味着它保持空间的定向（orientation）和面积不变。
4.  **逆变换**：$R_\theta^{-1} = R_{-\theta}$，即反向旋转相同角度即可还原。

**示例：** 90° 旋转矩阵为：

$$
R_{90^\circ} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}, \quad (1,0) \mapsto (0,1).
$$

> **注意**：这里的角度 $\theta$ 默认指**逆时针**方向。如果是顺时针旋转，则使用 $-\theta$。

**Python 代码示例：二维旋转可视化**

```python
import numpy as np
import matplotlib.pyplot as plt

def rotate_vector(v, theta_degrees):
    theta = np.radians(theta_degrees)
    R = np.array([[np.cos(theta), -np.sin(theta)],
                  [np.sin(theta),  np.cos(theta)]])
    return R @ v

# 原始向量
v = np.array([1, 0])
# 旋转 60 度
v_rotated = rotate_vector(v, 60)

print(f"原始向量：{v}")
print(f"旋转 60 度后：{v_rotated}")

# 可视化
plt.figure(figsize=(5, 5))
plt.quiver(0, 0, v[0], v[1], angles='xy', scale_units='xy', scale=1, color='blue', label='Original')
plt.quiver(0, 0, v_rotated[0], v_rotated[1], angles='xy', scale_units='xy', scale=1, color='red', label='Rotated 60°')
plt.xlim(-1.5, 1.5)
plt.ylim(-1.5, 1.5)
plt.grid()
plt.legend()
plt.title("Vector Rotation in 2D")
plt.gca().set_aspect('equal')
plt.show()
```

#### 三维空间中的旋转

在 $\mathbb{R}^3$ 中，旋转是围绕某根**轴**发生的。例如，绕 z 轴旋转角度 $\theta$ 的矩阵为：

$$
R_z(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta & 0 \\ \sin\theta & \cos\theta & 0 \\ 0 & 0 & 1 \end{bmatrix}.
$$

-   **z 轴保持不变**：第三列和第三行表明 z 坐标不受影响。
-   **xy 平面旋转**：左上角的 $2 \times 2$ 子矩阵与二维旋转完全一致。

三维空间中的一般旋转由行列式为 +1 的正交矩阵描述，这些矩阵构成了**特殊正交群** $SO(3)$。

#### 剪切变换

剪切变换会让一个坐标方向发生滑动，而保持另一个方向固定，从而导致形状扭曲。

在 $\mathbb{R}^2$ 中，常见的剪切矩阵有两种形式：

$$
S = \begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix} \quad \text{或} \quad \begin{bmatrix} 1 & 0 \\ k & 1 \end{bmatrix}.
$$

-   第一种形式表示 x 坐标会根据 y 值发生水平滑动。
-   第二种形式表示 y 坐标会根据 x 值发生垂直滑动。

**示例：**

$$
S = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}, \quad (x,y) \mapsto (x+y, y).
$$

-   正方形会被拉伸成平行四边形。
-   若 $\det(S) = 1$，则变换前后**面积保持不变**。

在 $\mathbb{R}^3$ 中，剪切会扭曲体积但保持面的平行性。

> **提示**：想象一叠扑克牌或一本书。如果你推动顶部使其相对于底部滑动，但每页纸本身不变形，这就是剪切变换的物理直观。

**Python 代码示例：剪切变换可视化**

```python
import numpy as np
import matplotlib.pyplot as plt

def apply_shear(points, k):
    S = np.array([[1, k], [0, 1]])
    return (S @ points.T).T

# 定义一个单位正方形的四个顶点
square = np.array([[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]) # 闭合回路
sheared_square = apply_shear(square, k=0.5)

plt.figure(figsize=(6, 6))
plt.plot(square[:, 0], square[:, 1], 'b-', label='Original Square')
plt.plot(sheared_square[:, 0], sheared_square[:, 1], 'r--', label='Sheared (k=0.5)')
plt.fill(square[:, 0], square[:, 1], 'blue', alpha=0.1)
plt.fill(sheared_square[:, 0], sheared_square[:, 1], 'red', alpha=0.1)
plt.grid()
plt.legend()
plt.title("Shear Transformation of a Square")
plt.gca().set_aspect('equal')
plt.show()
```

#### 几何对比

-   **旋转**：精确保持大小和形状，仅改变方向。圆仍然是圆。
-   **剪切**：扭曲形状，但通常保持面积（2D）或体积（3D）。圆会变成椭圆或倾斜的图形。

旋转和剪切结合在一起，可以生成各种各样的线性扭曲效果。

#### 生活类比

-   **旋转**： spinning wheel（旋转的轮子）、转动相机、在手机屏幕上旋转图片。
-   **剪切**：推滑扑克牌堆使顶部相对于底部移位，或者倾斜一摞书但不改变其高度。
-   **组合**：透视画法中的建筑物是矩形的剪切版本，而车轮则是干净地旋转。

#### 应用领域

1.  **计算机图形学**：旋转用于调整物体方向；剪切用于模拟透视效果。
2.  **工程学**：剪切应力使材料变形；旋转模型用于刚体运动。
3.  **机器人学**：旋转定义机械臂的方向；剪切近似局部变形。
4.  **物理学**：旋转是空间的对称性；剪切出现在流体流动和弹性力学中。
5.  **数据科学**：剪切代表保持体积但扭曲分布的变量变换。

#### 为什么这很重要

1.  旋转模型化了纯粹的对称性——没有 distortion，只有重定向。
2.  剪切展示了几何如何在保持体积或面积的同时发生扭曲。
3.  两者都是构建模块：$\mathbb{R}^2$ 中的任何可逆矩阵都可以分解为旋转、剪切和缩放的组合。
4.  它们架起了代数与几何的桥梁，赋予抽象矩阵以视觉意义。

#### 动手试一试

1.  将向量 $(1,0)$ 旋转 60°，显式计算结果。
2.  将剪切矩阵 $S=\begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$ 应用于顶点为 $(0,0),(1,0),(0,1),(1,1)$ 的正方形。结果是什么形状？
3.  证明旋转矩阵是正交的（即 $R^TR=I$）。
4.  **挑战**：证明任何行列式为 1 的保面积 $2\times2$ 矩阵都可以分解为旋转和剪切的乘积。

---

#### 练习题详细解答

**1. 将向量 $(1,0)$ 旋转 60°，显式计算结果。**

**解答：**
根据旋转矩阵公式，当 $\theta = 60^\circ$ 时：
$$
\cos 60^\circ = \frac{1}{2}, \quad \sin 60^\circ = \frac{\sqrt{3}}{2}
$$
旋转矩阵为：
$$
R_{60^\circ} = \begin{bmatrix} \frac{1}{2} & -\frac{\sqrt{3}}{2} \\ \frac{\sqrt{3}}{2} & \frac{1}{2} \end{bmatrix}
$$
作用于向量 $\begin{bmatrix} 1 \\ 0 \end{bmatrix}$：
$$
\begin{bmatrix} \frac{1}{2} & -\frac{\sqrt{3}}{2} \\ \frac{\sqrt{3}}{2} & \frac{1}{2} \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} \frac{1}{2} \cdot 1 + (-\frac{\sqrt{3}}{2}) \cdot 0 \\ \frac{\sqrt{3}}{2} \cdot 1 + \frac{1}{2} \cdot 0 \end{bmatrix} = \begin{bmatrix} \frac{1}{2} \\ \frac{\sqrt{3}}{2} \end{bmatrix}
$$
**结果：** 旋转后的向量为 $(\frac{1}{2}, \frac{\sqrt{3}}{2})$。

**2. 将剪切 $S=\begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$ 应用于正方形顶点。结果是什么形状？**

**解答：**
我们需要将矩阵 $S$ 分别乘以四个顶点向量。
变换公式为 $(x, y) \mapsto (x + 2y, y)$。

-   顶点 $(0,0)$:
    $$ \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \rightarrow (0,0) $$
-   顶点 $(1,0)$:
    $$ \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix} \rightarrow (1,0) $$
-   顶点 $(0,1)$:
    $$ \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 2 \\ 1 \end{bmatrix} \rightarrow (2,1) $$
-   顶点 $(1,1)$:
    $$ \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 \\ 1 \end{bmatrix} = \begin{bmatrix} 1+2 \\ 1 \end{bmatrix} = \begin{bmatrix} 3 \\ 1 \end{bmatrix} \rightarrow (3,1) $$

**结果形状：**
新的顶点为 $(0,0), (1,0), (2,1), (3,1)$。
由于底边仍在 x 轴上（长度 1），顶边平行于 x 轴（从 $x=2$ 到 $x=3$，长度 1），且侧边斜率相同，这是一个**平行四边形**。
其面积为 底 $\times$ 高 = $1 \times 1 = 1$，与原正方形面积相同（因为 $\det(S)=1$）。

**3. 证明旋转矩阵是正交的（$R^TR=I$）。**

**解答：**
设旋转矩阵为：
$$
R = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}
$$
其转置矩阵 $R^T$ 为：
$$
R^T = \begin{bmatrix} \cos\theta & \sin\theta \\ -\sin\theta & \cos\theta \end{bmatrix}
$$
计算乘积 $R^T R$：
$$
R^T R = \begin{bmatrix} \cos\theta & \sin\theta \\ -\sin\theta & \cos\theta \end{bmatrix} \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}
$$
进行矩阵乘法：
-   左上角元素：$\cos\theta \cdot \cos\theta + \sin\theta \cdot \sin\theta = \cos^2\theta + \sin^2\theta = 1$
-   右上角元素：$\cos\theta \cdot (-\sin\theta) + \sin\theta \cdot \cos\theta = -\cos\theta\sin\theta + \sin\theta\cos\theta = 0$
-   左下角元素：$-\sin\theta \cdot \cos\theta + \cos\theta \cdot \sin\theta = 0$
-   右下角元素：$-\sin\theta \cdot (-\sin\theta) + \cos\theta \cdot \cos\theta = \sin^2\theta + \cos^2\theta = 1$

因此：
$$
R^T R = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = I
$$
**结论：** 旋转矩阵确实是正交矩阵。

**4. 挑战：证明任何行列式为 1 的 $2\times2$ 矩阵都可以分解为旋转和剪切的乘积。**

**解答思路（构造性证明）：**
设 $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$ 且 $\det(A) = ad - bc = 1$。我们要证明 $A$ 可以写成旋转矩阵 $R$ 和剪切矩阵 $S$ 的乘积。

**方法一：利用 QR 分解的思想**
任何可逆矩阵都可以分解为正交矩阵 $Q$ 和上三角矩阵 $U$ 的乘积（$A=QU$）。
1.  在 $\mathbb{R}^2$ 中，行列式为 +1 的正交矩阵 $Q$ 即为旋转矩阵 $R_\theta$。
2.  上三角矩阵 $U = \begin{bmatrix} u_{11} & u_{12} \\ 0 & u_{22} \end{bmatrix}$。
3.  因为 $\det(A) = \det(Q)\det(U) = 1 \cdot (u_{11}u_{22}) = 1$，所以 $u_{22} = 1/u_{11}$。
4.  我们可以将 $U$ 进一步分解为缩放和剪切。但题目要求仅使用旋转和剪切。
    注意：剪切矩阵通常指对角线为 1 的三角矩阵。如果允许缩放，分解更容易。若严格限制为“行列式为 1 的剪切”（即 $\begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix}$），我们需要更细致的分解。

**方法二：利用初等矩阵生成 $SL(2, \mathbb{R})$**
数学上已知，特殊线性群 $SL(2, \mathbb{R})$（即行列式为 1 的 $2 \times 2$ 矩阵群）可以由初等剪切矩阵生成。
任何 $A \in SL(2, \mathbb{R})$ 可以通过行变换（即左乘剪切矩阵）化为单位矩阵或旋转矩阵。
具体步骤简述：
1.  若 $c \neq 0$，我们可以通过左乘一个剪切矩阵 $\begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix}$ 或 $\begin{bmatrix} 1 & 0 \\ k & 1 \end{bmatrix}$ 来消除某个元素或调整比例。
2.  通过一系列剪切操作，可以将矩阵化为对角矩阵 $\begin{bmatrix} \lambda & 0 \\ 0 & 1/\lambda \end{bmatrix}$。
3.  对角矩阵可以通过