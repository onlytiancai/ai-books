### 91. 2D/3D 几何管线（相机、旋转与变换）

线性代数是现代计算机图形学、机器人学和计算机视觉的**底层基石**。每当屏幕上渲染出一幅图像、相机捕捉到一个场景，或者机械臂在空间中移动时，背后都有一系列的矩阵乘法在将点从一个坐标系变换到另一个坐标系。这些几何管线（Geometry Pipelines）将 3D 现实映射为 2D 表示，确保物体以正确的位置、方向和比例呈现。

#### 坐标的几何意义

3D 空间中的一个点通常表示为列向量：

$$
p = \begin{bmatrix} x \\ y \\ z \end{bmatrix}.
$$

但在计算机处理中，我们通常将其扩展为**齐次坐标（Homogeneous Coordinates）**，将点嵌入到 4D 空间中：

$$
p_h = \begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}.
$$

> **注意**：为什么要增加一个坐标？
> 额外的坐标分量允许我们将**平移（Translation）**也表示为矩阵乘法。这使得整个管线保持一致：每一步变换都只是乘以一个矩阵，无需单独处理向量加法。

#### 2D 和 3D 中的变换

以下是三种基本的几何变换，它们都可以用 4x4 矩阵表示（针对 3D 空间）：

- **平移（Translation）**
  将点沿 $(t_x, t_y, t_z)$ 方向移动。

  $$
  T = \begin{bmatrix} 
  1 & 0 & 0 & t_x \\ 
  0 & 1 & 0 & t_y \\ 
  0 & 0 & 1 & t_z \\ 
  0 & 0 & 0 & 1 
  \end{bmatrix}.
  $$

- **缩放（Scaling）**
  沿每个轴扩展或收缩空间。

  $$
  S = \begin{bmatrix} 
  s_x & 0 & 0 & 0 \\ 
  0 & s_y & 0 & 0 \\ 
  0 & 0 & s_z & 0 \\ 
  0 & 0 & 0 & 1 
  \end{bmatrix}.
  $$

- **旋转（Rotation）**
  在 3D 中，绕 z 轴旋转 $\theta$ 角的矩阵为：

  $$
  R_z(\theta) = \begin{bmatrix} 
  \cos\theta & -\sin\theta & 0 & 0 \\ 
  \sin\theta & \cos\theta & 0 & 0 \\ 
  0 & 0 & 1 & 0 \\ 
  0 & 0 & 0 & 1 
  \end{bmatrix}.
  $$

  绕 x 轴和 y 轴旋转也有类似的形式。

每种变换都是线性变换（或仿射变换），将它们串联起来只需要矩阵相乘。

> **提示**：矩阵乘法的顺序
> 对于列向量 $v$，变换顺序是从右到左。例如，先旋转 $R$，再平移 $T$，组合矩阵为 $M = T \cdot R$。应用变换时计算 $v' = M v = T (R v)$。

下面是一个使用 Python `numpy` 构建这些变换矩阵的示例：

```python
import numpy as np

def translation_matrix(tx, ty, tz):
    T = np.eye(4)
    T[0, 3] = tx
    T[1, 3] = ty
    T[2, 3] = tz
    return T

def scale_matrix(sx, sy, sz):
    S = np.eye(4)
    S[0, 0] = sx
    S[1, 1] = sy
    S[2, 2] = sz
    return S

def rotation_z_matrix(theta):
    R = np.eye(4)
    c, s = np.cos(theta), np.sin(theta)
    R[0, 0] = c
    R[0, 1] = -s
    R[1, 0] = s
    R[1, 1] = c
    return R

# 示例：构建一个复合变换
T = translation_matrix(3, 1, 0)
S = scale_matrix(2, 2, 2)
R = rotation_z_matrix(np.pi / 4) # 45 度

# 注意顺序：先旋转，再缩放，最后平移 (M = T * S * R)
M = T @ S @ R 
print("复合变换矩阵:\n", M)
```

#### 相机管线（The Camera Pipeline）

将 3D 物体渲染到 2D 图像遵循一系列步骤，每一步都是矩阵乘法：

1. **模型变换（Model Transform）**
   将物体从其局部坐标系移动到世界坐标系。

2. **视图变换（View Transform）**
   将相机置于原点，并使其轴与世界坐标对齐， effectively 改变观察视角。

3. **投影变换（Projection Transform）**
   将 3D 点投影到 2D 平面。主要有两种类型：

   - **正交投影（Orthographic）**：平行投影，无透视效果（常用于工程制图）。
   - **透视投影（Perspective）**：远处物体显得更小，更接近人眼视觉。

   透视投影的一个简化示例：

   $$
   P = \begin{bmatrix} 
   f & 0 & 0 & 0 \\ 
   0 & f & 0 & 0 \\ 
   0 & 0 & 1 & 0 
   \end{bmatrix},
   $$

   其中 $f$ 是焦距。注意，真正的透视投影通常还需要进行“透视除法”（除以 $z$ 或 $w$ 分量）。

4. **视口变换（Viewport Transform）**
   将归一化的 2D 坐标映射到屏幕像素坐标。

这个从物体到图像的序列就是几何管线。

#### 示例：渲染一个立方体

- 从局部坐标系中的立方体顶点开始（范围 $[-1,1]^3$）。
- 应用缩放矩阵将其拉伸。
- 应用旋转矩阵使其倾斜。
- 应用平移矩阵将其移动到场景中。
- 应用投影矩阵将其扁平化投射到屏幕上。

每一步都是线性代数，最终的图像是按顺序乘以许多矩阵的结果。

#### 与机器人学的联系

机械臂使用类似的管线：每个关节贡献一个旋转或平移，编码为矩阵。通过将它们相乘，我们得到**正向运动学（Forward Kinematics）**——即给定关节角度时，机械手末端的位置和方向。

#### 日常类比

- **摄影**：模型变换布置物体，视图变换定位相机，投影则是将场景扁平化的镜头。
- **舞台表演**：演员在舞台上移动（平移），旋转面向观众（旋转），灯光将他们的影子投射到背景上（投影）。
- **导航**：GPS 坐标被转换为地图坐标，然后转换为屏幕像素——这是另一个几何管线。

#### 为什么这很重要

几何管线统一了图形学、机器人学和视觉领域。它们展示了线性代数如何为视频游戏、动画、模拟甚至自动驾驶汽车的日常视觉效果提供动力。如果没有矩阵乘法的一致性，管理变换的复杂性将是无法处理的。

#### Try It Yourself

1. 写出将一个正方形旋转 45°、缩放 2 倍并平移 $(3, 1)$ 的矩阵序列。将它们相乘以获得组合变换。
2. 在 3D 中构建一个立方体，并手动模拟一个顶点的透视投影。
3. 对于一个简单的 2 关节机械臂，用旋转矩阵表示每个关节，并计算最终手部位置。
4. 证明仿射变换的合成在乘法下是封闭的——为什么这使得管线成为可能？

#### 练习题解答与解析

以下是针对上述练习题的详细解答过程。

##### 1. 2D 复合变换矩阵

**题目分析**：
我们需要处理 2D 空间中的变换。为了统一使用矩阵乘法表示平移，我们使用 2D 齐次坐标（3x1 向量），变换矩阵为 3x3。
变换顺序通常理解为：先对物体应用旋转，再应用缩放，最后应用平移。
对于列向量 $v$，组合矩阵 $M = T \cdot S \cdot R$。

**解答过程**：

1.  **旋转矩阵 $R$ (45°)**：
    $\theta = 45^\circ = \frac{\pi}{4}$, $\cos\theta = \frac{\sqrt{2}}{2}$, $\sin\theta = \frac{\sqrt{2}}{2}$。
    $$
    R = \begin{bmatrix} 
    \frac{\sqrt{2}}{2} & -\frac{\sqrt{2}}{2} & 0 \\ 
    \frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2} & 0 \\ 
    0 & 0 & 1 
    \end{bmatrix}
    $$

2.  **缩放矩阵 $S$ (2 倍)**：
    $$
    S = \begin{bmatrix} 
    2 & 0 & 0 \\ 
    0 & 2 & 0 \\ 
    0 & 0 & 1 
    \end{bmatrix}
    $$

3.  **平移矩阵 $T$ (3, 1)**：
    $$
    T = \begin{bmatrix} 
    1 & 0 & 3 \\ 
    0 & 1 & 1 \\ 
    0 & 0 & 1 
    \end{bmatrix}
    $$

4.  **组合矩阵 $M = T \cdot S \cdot R$**：
    先算 $S \cdot R$：
    $$
    S \cdot R = \begin{bmatrix} 
    2 & 0 & 0 \\ 
    0 & 2 & 0 \\ 
    0 & 0 & 1 
    \end{bmatrix}
    \begin{bmatrix} 
    \frac{\sqrt{2}}{2} & -\frac{\sqrt{2}}{2} & 0 \\ 
    \frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2} & 0 \\ 
    0 & 0 & 1 
    \end{bmatrix}
    = \begin{bmatrix} 
    \sqrt{2} & -\sqrt{2} & 0 \\ 
    \sqrt{2} & \sqrt{2} & 0 \\ 
    0 & 0 & 1 
    \end{bmatrix}
    $$
    再算 $T \cdot (S \cdot R)$：
    $$
    M = \begin{bmatrix} 
    1 & 0 & 3 \\ 
    0 & 1 & 1 \\ 
    0 & 0 & 1 
    \end{bmatrix}
    \begin{bmatrix} 
    \sqrt{2} & -\sqrt{2} & 0 \\ 
    \sqrt{2} & \sqrt{2} & 0 \\ 
    0 & 0 & 1 
    \end{bmatrix}
    = \begin{bmatrix} 
    \sqrt{2} & -\sqrt{2} & 3 \\ 
    \sqrt{2} & \sqrt{2} & 1 \\ 
    0 & 0 & 1 
    \end{bmatrix}
    $$

**最终结果**：
组合变换矩阵为：
$$
M = \begin{bmatrix} 
\sqrt{2} & -\sqrt{2} & 3 \\ 
\sqrt{2} & \sqrt{2} & 1 \\ 
0 & 0 & 1 
\end{bmatrix}
$$

##### 2. 立方体顶点的透视投影模拟

**题目分析**：
假设立方体顶点之一为 $v = (1, 1, 1)$。齐次坐标为 $v_h = [1, 1, 1, 1]^T$。
使用文中给出的简化透视投影矩阵 $P$。假设焦距 $f=1$。

**解答过程**：

1.  **定义顶点**：
    $$
    p_h = \begin{bmatrix} 1 \\ 1 \\ 1 \\ 1 \end{bmatrix}
    $$

2.  **应用投影矩阵** ($f=1$)：
    $$
    P = \begin{bmatrix} 
    1 & 0 & 0 & 0 \\ 
    0 & 1 & 0 & 0 \\ 
    0 & 0 & 1 & 0 
    \end{bmatrix}
    $$
    计算 $p' = P \cdot p_h$：
    $$
    p' = \begin{bmatrix} 
    1 & 0 & 0 & 0 \\ 
    0 & 1 & 0 & 0 \\ 
    0 & 0 & 1 & 0 
    \end{bmatrix}
    \begin{bmatrix} 1 \\ 1 \\ 1 \\ 1 \end{bmatrix}
    = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}
    $$

3.  **透视除法（关键步骤）**：
    标准的透视投影通常会将 $z$ 值存入 $w$ 分量，即矩阵第三行应为 $[0, 0, 1, 0]$ 映射到 $w$，或者如文中简化版直接输出 3D 向量。
    在更标准的管线中，投影后的坐标通常为 $(x, y, z, w)$，其中 $w=z$。屏幕坐标需除以 $w$。
    若按照文中矩阵直接得到 $(x', y', z')$，则投影后的 2D 屏幕坐标通常取前两个分量 $(1, 1)$。
    若考虑透视效果（近大远小），通常公式为 $x_{screen} = f \cdot \frac{x}{z}$。
    在此例中，$x=1, z=1, f=1 \implies x_{screen} = 1$。

**结论**：
顶点 $(1,1,1)$ 经过投影后，在成像平面上的坐标约为 $(1, 1)$。

##### 3. 2 关节机械臂正向运动学

**题目分析**：
假设机械臂基座在原点 $(0,0)$。
关节 1 长度 $L_1$，角度 $\theta_1$。
关节 2 长度 $L_2$，角度 $\theta_2$（相对于关节 1 的连杆）。
我们需要计算末端执行器（手）的位置。

**解答过程**：

1.  **定义变换矩阵**（使用 2D 齐次坐标 3x3）：
    关节 1 的变换 $T_1$（旋转 $\theta_1$）：
    $$
    T_1 = \begin{bmatrix} 
    \cos\theta_1 & -\sin\theta_1 & 0 \\ 
    \sin\theta_1 & \cos\theta_1 & 0 \\ 
    0 & 0 & 1 
    \end{bmatrix}
    $$
    关节 2 相对于关节 1 的变换 $T_2$（平移 $L_1$ 后旋转 $\theta_2$）：
    注意：通常建模为先沿 x 轴平移连杆长度，再旋转。
    $$
    T_2 = \begin{bmatrix} 
    \cos\theta_2 & -\sin\theta_2 & L_1 \\ 
    \sin\theta_2 & \cos\theta_2 & 0 \\ 
    0 & 0 & 1 
    \end{bmatrix}
    $$
    *修正模型*：更常见的 Denavit-Hartenberg 简化模型是：
    $T_1$: 旋转 $\theta_1$, 平移 $L_1$。
    $T_2$: 旋转 $\theta_2$, 平移 $L_2$。
    让我们采用简单的串联模型：
    $M_1 = \text{Rot}(\theta_1) \cdot \text{Trans}(L_1, 0)$
    $M_2 = \text{Rot}(\theta_2) \cdot \text{Trans}(L_2, 0)$
    总变换 $M = M_1 \cdot M_2$。

    为了简化计算，我们直接计算位置向量。
    末端位置 $P = T_1 \cdot T_2 \cdot \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$。

    设 $c_1 = \cos\theta_1, s_1 = \sin\theta_1$, 同理 $c_2, s_2$。
    $$
    T_1 = \begin{bmatrix} c_1 & -s_1 & 0 \\ s_1 & c_1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & L_1 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} c_1 & -s_1 & L_1 c_1 \\ s_1 & c_1 & L_1 s_1 \\ 0 & 0 & 1 \end{bmatrix}
    $$
    $$
