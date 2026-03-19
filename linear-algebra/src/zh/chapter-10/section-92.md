### 92. 计算机图形学与机器人学（齐次技巧的实际应用）

线性代数不仅仅停留在黑板上的理论推导，它实际上是计算机图形学和机器人学背后的核心驱动力。这两个领域都需要描述和操作空间中的物体，并且经常需要在多个坐标系之间进行转换。**齐次坐标技巧（Homogeneous Coordinate Trick）**——即增加一个额外的维度——使得这一过程变得非常优雅：平移、缩放和旋转都可以统一纳入矩阵乘法的框架中。这种统一性使得计算更加高效，流程更加一致。

#### 齐次坐标回顾

在 2D 空间中，一个点 $(x, y)$ 变为 $[x, y, 1]^T$。
在 3D 空间中，一个点 $(x, y, z)$ 变为 $[x, y, z, 1]^T$。

**为什么要添加额外的 1？** 因为这样一来，原本不是线性变换的平移操作，在更高维度的嵌入空间中就变成了线性变换。所有的仿射变换（旋转、缩放、剪切、反射和平移）都可以简化为与一个齐次矩阵的单次乘法。

示例：

$$
T = \begin{bmatrix} 
1 & 0 & 0 & t_x \\ 
0 & 1 & 0 & t_y \\ 
0 & 0 & 1 & t_z \\ 
0 & 0 & 0 & 1 
\end{bmatrix}, \quad 
p_h' = T p_h.
$$

这个技巧使得流水线变得模块化：只需按顺序乘以矩阵即可。

> **注意**：在齐次坐标中，最后那个分量通常称为 $w$。当 $w=1$ 时代表空间中的点；当 $w=0$ 时代表方向向量（不受平移影响）。

#### 计算机图形学流水线

图形引擎（如 OpenGL 或 DirectX）完全依赖于齐次变换：

1.  **模型矩阵 (Model Matrix)**：将物体放置到场景中。
    - 示例：将一辆车旋转 90° 并向前平移 10 个单位。
2.  **视图矩阵 (View Matrix)**：定位虚拟相机。
    - 等价于移动整个世界，使得相机位于原点。
3.  **投影矩阵 (Projection Matrix)**：将 3D 点投影到 2D 平面。
    - 透视投影（Perspective）会使远处的物体变小，正交投影（Orthographic）则不会。
4.  **视口矩阵 (Viewport Matrix)**：将归一化的 2D 坐标转换为屏幕像素。

你在视频游戏中看到的每一个像素，都经过了这一堆矩阵的变换。

#### 机器人学流水线

在机器人学中，同样的原理也适用：

- 带有关节的机械臂被建模为一系列刚体变换的链条。
- 每个关节贡献一个旋转或平移矩阵。
- 将它们相乘可以得到机器人末端执行器（手、工具或夹爪）的最终位姿。

这被称为**正运动学 (Forward Kinematics)**。

示例：一个具有两个关节的 2D 机械臂：

$$
p = R(\theta_1) T(l_1) R(\theta_2) T(l_2) \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}.
$$

这里 $R(\theta_i)$ 是旋转矩阵，$T(l_i)$ 是沿臂长的平移。将它们相乘即可得到手的位置。

#### 图形学与机器人学的共同挑战

1.  **精度 (Precision)**：数值舍入误差可能会累积，稳定的算法至关重要。
2.  **速度 (Speed)**：两个领域都需要实时计算——图形学需要每秒 60 帧，机器人需要毫秒级的反应时间。
3.  **层级 (Hierarchy)**：图形学中的物体可能是嵌套的（汽车的轮子相对于汽车旋转），就像机器人关节一样。齐次变换自然地处理了这些层级关系。
4.  **逆问题 (Inverse Problems)**：图形学使用逆变换进行相机移动；机器人学使用它们进行逆运动学（寻找到达某点所需的关节角度）。

#### 日常类比

- **视频游戏**：移动角色或旋转相机只是每秒运行数百万次的矩阵数学。
- **动画 rigs**：角色的骨骼实际上是伪装的机械臂，关节依次移动。
- **增强现实 (AR)**：将数字对象叠加到现实世界的相机图像上，需要与机器人校准相同的变换。

#### 为什么齐次技巧如此强大

- **统一性**：一个系统（矩阵乘法）处理所有变换。
- **效率**：硬件（GPU、控制器）可以直接优化矩阵运算。
- **可扩展性**：在 2D、3D 或更高维中工作方式相同。
- **可组合性**：长流水线只是矩阵的乘积，避免了特殊情况。

#### 应用领域

- **图形学**：渲染引擎、VR/AR、CAD 软件、动作捕捉。
- **机器人学**：机械臂 manipulators、无人机、自动驾驶车辆、人形机器人。
- **交叉领域**：仿真平台使用相同的数学来测试机器人并渲染虚拟环境。

#### 动手试一试 (Try It Yourself)

1.  构建一个 2D 变换流水线：旋转一个三角形，平移它，并将其投影到屏幕空间。写出最终的变换矩阵。
2.  建模一个简单的 2 关节机械臂。使用齐次矩阵推导正运动学。
3.  实现相机变换：将一个立方体放置在 $(0,0,5)$，将相机移动到 $(0,0,0)$，并计算其 2D 屏幕投影。
4.  证明直接组合旋转和平移等价于将它们嵌入齐次矩阵并相乘。

齐次坐标是让图形学和机器人共享相同数学 DNA 的秘密武器。它们统一了我们移动像素、机器和虚拟世界的方式。

#### 练习题参考答案与解析

下面提供上述练习题的详细解答过程及 Python 代码验证。

##### 1. 2D 变换流水线

**解答过程：**
假设我们要对一个点 $(x, y)$ 先逆时针旋转 $\theta$ 角，再平移 $(t_x, t_y)$。
在齐次坐标下，点表示为 $p = [x, y, 1]^T$。

旋转矩阵 $R$ 和平移矩阵 $T$ 分别为：
$$
R = \begin{bmatrix} \cos\theta & -\sin\theta & 0 \\ \sin\theta & \cos\theta & 0 \\ 0 & 0 & 1 \end{bmatrix}, \quad
T = \begin{bmatrix} 1 & 0 & t_x \\ 0 & 1 & t_y \\ 0 & 0 & 1 \end{bmatrix}
$$
注意变换顺序：通常先旋转后平移，矩阵乘法顺序为 $M = T \cdot R$（因为矩阵作用在列向量左侧）。
最终变换矩阵 $M$ 为：
$$
M = \begin{bmatrix} \cos\theta & -\sin\theta & t_x \\ \sin\theta & \cos\theta & t_y \\ 0 & 0 & 1 \end{bmatrix}
$$
投影到屏幕空间通常涉及缩放和坐标原点翻转（屏幕坐标系原点在左上角），这里简化为恒等投影。

**Python 代码演示：**

```python
import numpy as np

def create_2d_transform(theta, tx, ty):
    # 旋转矩阵 (齐次)
    c, s = np.cos(theta), np.sin(theta)
    R = np.array([
        [c, -s, 0],
        [s,  c, 0],
        [0,  0, 1]
    ])
    # 平移矩阵 (齐次)
    T = np.array([
        [1, 0, tx],
        [0, 1, ty],
        [0, 0, 1]
    ])
    # 组合矩阵 (先旋转后平移)
    M = T @ R
    return M

# 示例：旋转 90 度，平移 (10, 5)
theta = np.pi / 2
M = create_2d_transform(theta, 10, 5)
print("最终变换矩阵 M:\n", M)

# 验证点 (1, 0) 变换后的位置
p = np.array([1, 0, 1])
p_new = M @ p
print(f"点 (1, 0) 变换后：({p_new[0]:.2f}, {p_new[1]:.2f})")
```

##### 2. 2 关节机械臂正运动学

**解答过程：**
设基座在原点。第一臂长 $l_1$，关节角 $\theta_1$；第二臂长 $l_2$，关节角 $\theta_2$（相对于第一臂）。
变换链为：基座 -> 旋转 $\theta_1$ -> 平移 $l_1$ -> 旋转 $\theta_2$ -> 平移 $l_2$ -> 末端。
注意：题目公式给出的顺序是 $R(\theta_1) T(l_1) R(\theta_2) T(l_2)$，这通常表示相对于当前局部坐标系的变换（后乘），或者特定的坐标系定义。我们按照标准齐次矩阵乘法推导末端位置 $p_{end}$。

令 $c_1 = \cos\theta_1, s_1 = \sin\theta_1$ 等。
$$
T_{total} = \begin{bmatrix} c_1 & -s_1 & 0 \\ s_1 & c_1 & 0 \\ 0 & 0 & 1 \end{bmatrix} 
\begin{bmatrix} 1 & 0 & l_1 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}
\begin{bmatrix} c_2 & -s_2 & 0 \\ s_2 & c_2 & 0 \\ 0 & 0 & 1 \end{bmatrix}
\begin{bmatrix} 1 & 0 & l_2 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$
计算后可得末端位置 $(x, y)$：
$$
x = l_1 \cos\theta_1 + l_2 \cos(\theta_1 + \theta_2) \\
y = l_1 \sin\theta_1 + l_2 \sin(\theta_1 + \theta_2)
$$

**Python 代码演示：**

```python
def forward_kinematics_2d(l1, l2, theta1, theta2):
    # 定义齐次变换函数
    def rot(t):
        c, s = np.cos(t), np.sin(t)
        return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])
    def trans(l):
        return np.array([[1, 0, l], [0, 1, 0], [0, 0, 1]])
    
    # 矩阵连乘
    T = rot(theta1) @ trans(l1) @ rot(theta2) @ trans(l2)
    
    # 初始点 (0,0,1)
    p0 = np.array([0, 0, 1])
    p_end = T @ p0
    
    return p_end[:2]

# 示例：臂长均为 1，角度均为 45 度
pos = forward_kinematics_2d(1, 1, np.pi/4, np.pi/4)
print(f"末端位置：({pos[0]:.4f}, {pos[1]:.4f})")
# 理论验证：x = 1*cos(45) + 1*cos(90) = 0.707, y = 1*sin(45) + 1*sin(90) = 1.707
```

##### 3. 相机变换与投影

**解答过程：**
1.  **世界坐标**：立方体中心在 $P_{world} = (0, 0, 5)^T$。
2.  **相机坐标**：相机位于原点 $(0,0,0)$，假设看向 Z 轴正方向（为了简化，通常相机看向 -Z，但此处物体在 +Z，故假设看向 +Z 或调整物体位置。为符合题目，我们假设相机看向 +Z 轴）。
3.  **视图矩阵**：相机在原点，视图矩阵为单位矩阵 $V = I$。
4.  **投影矩阵**：使用简单透视投影。假设焦距为 $f$。
    投影公式为 $x_{screen} = f \cdot \frac{x}{z}, \quad y_{screen} = f \cdot \frac{y}{z}$。
    在齐次坐标中，这可以通过矩阵实现，最后除以 $w$ 分量。
    $$
    P = \begin{bmatrix} f & 0 & 0 & 0 \\ 0 & f & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 1/f & 0 \end{bmatrix} \quad (\text{简化模型})
    $$
    更常见的简单透视除法直接计算即可。
    对于点 $(0, 0, 5)$，投影后 $x'=0, y'=0$。如果在旁边有点 $(1, 0, 5)$，则 $x' = f/5$。

**Python 代码演示：**

```python
def perspective_project(point, focal_length=1.0):
    x, y, z = point
    if z == 0: return None # 避免除零
    # 透视除法
    x_proj = focal_length * x / z
    y_proj = focal_length * y / z
    return np.array([x_proj, y_proj])

# 立方体某个顶点 (1, 1, 5)
point_3d = np.array([1, 1, 5])
point_2d = perspective_project(point_3d, focal_length=1.0)
print(f"3D 点 {point_3d} 投影到 2D 屏幕：{point_2d}")
```

##### 4. 旋转与平移的组合等价性证明

**解答过程：**
我们需要证明：先旋转 $R$ 后平移 $t$ 作用于点 $p$，等价于齐次矩阵 $M = \begin{bmatrix} R & t \\ 0 & 1 \end{bmatrix}$ 作用于齐次点 $p_h = \begin{bmatrix} p \\ 1 \end{bmatrix}$。

**普通向量计算：**
$$
p' = R p + t
$$
其中 $R$ 是 $2\times2$ 或 $3\times3$ 矩阵，$t$ 是向量。

**齐次矩阵计算：**
$$
p_h' = \begin{bmatrix} R & t \\ 0 & 1 \end{bmatrix} \begin{bmatrix} p \\ 1 \end{bmatrix} = \begin{bmatrix} R p + t \cdot 1 \\ 0 \cdot p + 1 \cdot 1 \end{bmatrix} = \begin{bmatrix} R p + t \\ 1 \end{bmatrix}
$$
取前 $n$ 个分量，即得到 $p' = R p + t$。
两者结果完全一致。这证明了齐次矩阵可以将仿射变换统一为线性乘法。

**Python 代码验证：**

```python
# 验证等价性
R = np.array([[0, -1], [1, 0]]) # 90 度旋转
t = np.array([3, 4])
p = np.array([1, 0])

# 方法 1: 直接计算
p_direct = R @ p + t

# 方法 2: 齐次矩阵
R_h = np.zeros((3,3))
R_h[:2, :2] = R
R_h[:2, 2] = t
R_h[2, 2] = 1
p_h = np.array([1, 0, 1])
p_h_res = R_h @ p_h

print(f"直接计算结果：{p_direct}")
print(f"齐次矩阵结果：{p_h_res[:2]}")
print(f"结果是否一致：{np.allclose(p_direct, p_h_res[:2])}")
```

> **提示**：在实际编程中（如使用 Unity 或 OpenGL），尽量使用矩阵库（如 GLM, numpy）来处理这些变换，避免手动编写加法逻辑，这样可以利用硬件加速并保持代码的一致性。