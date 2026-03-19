### 77. QR 分解

QR 分解是将矩阵分解为一个正交部分和一个三角部分的方法。它直接源于正交性和 Gram–Schmidt 正交化过程，在数值线性代数中扮演着核心角色。QR 分解提供了一种稳定且高效的方式来求解线性方程组、计算最小二乘解以及分析矩阵性质。

#### 定义

对于一个列线性无关的实数 $m \times n$ 矩阵 $A$：

$$
A = QR,
$$

其中：

- $Q$ 是一个 $m \times n$ 矩阵，其列向量是标准正交的（即 $Q^T Q = I$）。
- $R$ 是一个 $n \times n$ 的上三角矩阵。

> **注意**：如果我们要求 $R$ 的对角线元素均为正数，则该分解是唯一的。

#### 与 Gram–Schmidt 过程的联系

对 $A$ 的列向量应用 Gram–Schmidt 正交化过程，即可得到 $Q$ 的标准正交列向量。而在正交化步骤中使用的系数，自然构成了 $R$ 的元素。

- $A$ 的每一列都可以表示为 $Q$ 的标准正交列向量的线性组合。
- 这些组合的系数填充了上三角矩阵 $R$。

> **提示**：理解 $R$ 为何是上三角的关键在于：第 $j$ 列 $a_j$ 仅由前 $j$ 个正交基向量 $q_1, \dots, q_j$ 线性表示，因此 $R$ 中第 $j$ 列第 $i$ 行（$i > j$）的元素为零。

#### 示例

设

$$
A = \begin{bmatrix} 1 & 1 \\ 1 & 0 \\ 0 & 1 \end{bmatrix}.
$$

1. 对列向量应用 Gram–Schmidt 过程：

   - 取 $v_1 = (1,1,0)^T$，归一化：

     $$
     u_1 = \frac{1}{\sqrt{2}}(1,1,0)^T.
     $$
   - 从 $v_2=(1,0,1)^T$ 中减去投影分量：

     $$
     w_2 = v_2 - \langle v_2,u_1\rangle u_1.
     $$

     计算内积 $\langle v_2,u_1\rangle = \tfrac{1}{\sqrt{2}}(1+0+0)=\tfrac{1}{\sqrt{2}}$。
     因此

     $$
     w_2 = (1,0,1)^T - \tfrac{1}{\sqrt{2}}(1,1,0)^T = \left(\tfrac{1}{2}, -\tfrac{1}{2}, 1\right)^T.
     $$

     归一化：

     $$
     u_2 = \frac{1}{\sqrt{1.5}} \left(\tfrac{1}{2}, -\tfrac{1}{2}, 1\right)^T.
     $$

2. 构造 $Q = [u_1, u_2]$。

3. 计算 $R = Q^T A$。

最终结果是 $A = QR$，其中 $Q$ 是标准正交矩阵，$R$ 是上三角矩阵。

#### Python 数值演示

我们可以使用 `numpy` 库来验证上述分解过程。在实际计算中，计算机使用的是改进的 Gram-Schmidt 或 Householder 变换，但结果一致。

```python
import numpy as np

# 定义矩阵 A
A = np.array([[1, 1],
              [1, 0],
              [0, 1]], dtype=float)

# 计算 QR 分解
# mode='reduced' 得到经济型分解 (m x n 的 Q 和 n x n 的 R)
Q, R = np.linalg.qr(A, mode='reduced')

print("矩阵 Q:\n", Q)
print("矩阵 R:\n", R)

# 验证重构
A_reconstructed = Q @ R
print("重构误差 (范数):", np.linalg.norm(A - A_reconstructed))

# 验证 Q 的正交性
I_check = Q.T @ Q
print("Q^T Q 是否接近单位矩阵:\n", I_check)
```

#### 几何意义

- $Q$ 代表正交基变换（旋转和反射），它保持向量的长度和角度不变。
- $R$ 编码了在新的标准正交坐标系下的缩放和剪切变换。
- 两者结合展示了 $A$ 如何变换空间：首先旋转到一个干净的基，然后应用三角 distortion（变形）。

#### 生活类比

- **改变视角**：QR 分解就像旋转你的视角，使得问题的结构变得更简单，然后在这个对齐的框架中测量变形。
- **团队角色**：$Q$ 代表独立、正交的角色（互不干扰），而 $R$ 显示每个角色对最终结果的贡献程度。
- **导航**：$Q$ 给出完美对齐的指南针方向，而 $R$ 记录你沿每个方向移动的距离。

#### 应用

1. **最小二乘法**：与其求解正规方程 $A^T A x = A^T b$，不如使用 $QR$ 分解：

   $$
   Ax = b \quad \Rightarrow \quad QRx = b.
   $$

   两边左乘 $Q^T$：

   $$
   Rx = Q^T b.
   $$

   由于 $R$ 是上三角矩阵，求解 $x$ 非常高效且数值稳定（通过回代法）。

2. **特征值算法**：QR 算法迭代地应用 QR 分解来近似特征值。

3. **数值稳定性**：与求解正规方程相比，正交变换能最大限度地减少数值误差。

4. **机器学习**：许多算法（如线性回归、PCA）使用 QR 分解来提高效率和稳定性。

5. **计算机图形学**：正交因子保持形状不变；三角因子简化变换过程。

#### 为什么它很重要

- QR 分解 bridging 了理论（Gram–Schmidt 正交化）与计算（矩阵分解）。
- 它避免了正规方程的病态问题，提高了数值稳定性。
- 它是统计学、工程和计算机科学中众多算法的基础。

#### 动手试一试 (Try It Yourself)

1. 计算以下矩阵的 QR 分解：

   $$
   A = \begin{bmatrix}1 & 2 \\ 2 & 3 \\ 4 & 5\end{bmatrix}.
   $$
2. 验证 $Q^T Q = I$ 且 $R$ 是上三角矩阵。
3. 使用 QR 分解求解最小二乘问题 $Ax \approx b$，其中 $b=(1,1,1)^T$。
4. **挑战**：证明如果 $A$ 是方阵且为正交矩阵，则 $R=I$ 且 $Q=A$。

---

#### 参考答案与解析

**1. 计算 QR 分解**

设 $A$ 的列向量为 $a_1 = (1, 2, 4)^T$ 和 $a_2 = (2, 3, 5)^T$。

**步骤 1：Gram-Schmidt 正交化**

- 计算 $u_1$：
  $$
  u_1 = a_1 = \begin{bmatrix} 1 \\ 2 \\ 4 \end{bmatrix}, \quad \|u_1\| = \sqrt{1^2 + 2^2 + 4^2} = \sqrt{21}.
  $$
  得到第一个标准正交向量 $q_1$：
  $$
  q_1 = \frac{u_1}{\|u_1\|} = \frac{1}{\sqrt{21}} \begin{bmatrix} 1 \\ 2 \\ 4 \end{bmatrix}.
  $$

- 计算 $u_2$：
  首先计算投影系数：
  $$
  \langle a_2, q_1 \rangle = \frac{1}{\sqrt{21}} (2\times1 + 3\times2 + 5\times4) = \frac{2+6+20}{\sqrt{21}} = \frac{28}{\sqrt{21}}.
  $$
  计算正交分量：
  $$
  u_2 = a_2 - \langle a_2, q_1 \rangle q_1 = \begin{bmatrix} 2 \\ 3 \\ 5 \end{bmatrix} - \frac{28}{21} \begin{bmatrix} 1 \\ 2 \\ 4 \end{bmatrix} = \begin{bmatrix} 2 \\ 3 \\ 5 \end{bmatrix} - \frac{4}{3} \begin{bmatrix} 1 \\ 2 \\ 4 \end{bmatrix}.
  $$
  $$
  u_2 = \begin{bmatrix} 2 - 4/3 \\ 3 - 8/3 \\ 5 - 16/3 \end{bmatrix} = \begin{bmatrix} 2/3 \\ 1/3 \\ -1/3 \end{bmatrix}.
  $$
  计算范数并归一化：
  $$
  \|u_2\| = \sqrt{(2/3)^2 + (1/3)^2 + (-1/3)^2} = \sqrt{\frac{6}{9}} = \frac{\sqrt{6}}{3}.
  $$
  $$
  q_2 = \frac{u_2}{\|u_2\|} = \frac{3}{\sqrt{6}} \begin{bmatrix} 2/3 \\ 1/3 \\ -1/3 \end{bmatrix} = \frac{1}{\sqrt{6}} \begin{bmatrix} 2 \\ 1 \\ -1 \end{bmatrix}.
  $$

**步骤 2：构造 $Q$ 和 $R$**

$$
Q = \begin{bmatrix} q_1 & q_2 \end{bmatrix} = \begin{bmatrix} \frac{1}{\sqrt{21}} & \frac{2}{\sqrt{6}} \\ \frac{2}{\sqrt{21}} & \frac{1}{\sqrt{6}} \\ \frac{4}{\sqrt{21}} & -\frac{1}{\sqrt{6}} \end{bmatrix}.
$$

$R$ 的元素由 $R = Q^T A$ 确定（或利用 Gram-Schmidt 过程中的系数）：
- $R_{11} = \|u_1\| = \sqrt{21}$
- $R_{12} = \langle a_2, q_1 \rangle = \frac{28}{\sqrt{21}}$
- $R_{22} = \|u_2\| = \frac{\sqrt{6}}{3}$
- $R_{21} = 0$

$$
R = \begin{bmatrix} \sqrt{21} & \frac{28}{\sqrt{21}} \\ 0 & \frac{\sqrt{6}}{3} \end{bmatrix}.
$$

**2. 验证性质**

- **验证 $Q^T Q = I$**：
  由于 $q_1, q_2$ 是单位向量且相互正交，根据构造过程可知 $q_i^T q_j = \delta_{ij}$，故 $Q^T Q = I_2$。
- **验证 $R$ 是上三角**：
  显然 $R_{21} = 0$，符合上三角定义。

**3. 求解最小二乘问题**

我们需要求解 $Rx = Q^T b$，其中 $b=(1,1,1)^T$。

- 计算右侧向量 $d = Q^T b$：
  $$
  d_1 = q_1^T b = \frac{1}{\sqrt{21}}(1+2+4) = \frac{7}{\sqrt{21}} = \frac{\sqrt{21}}{3}.
  $$
  $$
  d_2 = q_2^T b = \frac{1}{\sqrt{6}}(2+1-1) = \frac{2}{\sqrt{6}} = \frac{\sqrt{6}}{3}.
  $$
  即 $d = \begin{bmatrix} \frac{\sqrt{21}}{3} \\ \frac{\sqrt{6}}{3} \end{bmatrix}$。

- 回代求解 $Rx = d$：
  $$
  \begin{bmatrix} \sqrt{21} & \frac{28}{\sqrt{21}} \\ 0 & \frac{\sqrt{6}}{3} \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = \begin{bmatrix} \frac{\sqrt{21}}{3} \\ \frac{\sqrt{6}}{3} \end{bmatrix}.
  $$
  由第二行：
  $$
  \frac{\sqrt{6}}{3} x_2 = \frac{\sqrt{6}}{3} \implies x_2 = 1.
  $$
  代入第一行：
  $$
  \sqrt{21} x_1 + \frac{28}{\sqrt{21}} (1) = \frac{\sqrt{21}}{3}.
  $$
  $$
  \sqrt{21} x_1 = \frac{7}{\sqrt{21}} - \frac{28}{\sqrt{21}} = -\frac{21}{\sqrt{21}} = -\sqrt{21}.
  $$
  $$
  x_1 = -1.
  $$
  **最终解**：$x = \begin{bmatrix} -1 \\ 1 \end{bmatrix}$。

**4. 挑战题证明**

**命题**：若 $A$ 是方阵且为正交矩阵，则在其 QR 分解 $A=QR$ 中（要求 $R$ 对角元为正），有 $R=I$ 且 $Q=A$。

**证明**：
1. 因为 $A$ 是正交矩阵，所以 $A^T A = I$。
2. 代入 $A=QR$：
   $$
   (QR)^T (QR) = I \implies R^T Q^T Q R = I.
   $$
3. 因为 $Q$ 是正交矩阵，$Q^T Q = I$，所以：
   $$
   R^T I R = I \implies R^T R = I.
   $$
4. $R$ 是上三角矩阵，因此 $R^T$ 是下三角矩阵。两个三角矩阵的乘积为单位矩阵，意味着 $R$ 必须是对角矩阵。
5. 又因为 $R^T R = I$，对角线元素的平方必须为 1，即 $R_{ii} = \pm 1$。
6. 根据 QR 分解的唯一性约定，$R$ 的对角线元素必须为正数，因此 $R_{ii} = 1$。
7. 综上，$R = I$。
8. 既然 $A = QR$ 且 $R=I$，则 $Q = A I^{-1} = A$。
   **证毕**。

QR 分解将求解最小二乘法的繁琐过程转化为一个清晰几何过程——在求解之前先旋转到更好的坐标系中。它是线性代数工具包中最强大的工具之一。