### 66. 实谱与复谱

并非所有的特征值都是实数。即使我们处理的是实矩阵，特征值也可能以复数的形式出现。理解特征值何时为实数、何时为复数，以及这在几何上意味着什么，对于掌握线性变换的完整行为至关重要。

#### 复数域上的特征值

每个方阵 $A \in \mathbb{R}^{n \times n}$ 在复数域中至少有一个特征值。这是由**代数基本定理**（Fundamental Theorem of Algebra）保证的，该定理指出每个多项式（如特征多项式）在 $\mathbb{C}$ 中都有根。

- 如果 $p_A(\lambda)$ 只有实根，则所有特征值均为实数。
- 如果 $p_A(\lambda)$ 含有无实根的二次因式，则特征值会以**共轭复数对**的形式出现。

> **注意**：对于实矩阵，如果存在复数特征值，它们总是成对出现的。若 $\lambda = a+bi$ 是特征值，则其共轭 $\overline{\lambda} = a-bi$ 也是特征值。

#### 为什么会出现复数

考虑一个二维旋转矩阵：

$$
R_\theta = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}.
$$

其特征多项式为

$$
p(\lambda) = \lambda^2 - 2\cos\theta \lambda + 1.
$$

特征值为

$$
\lambda = \cos\theta \pm i \sin\theta = e^{\pm i\theta}.
$$

- 除非 $\theta = 0, \pi$，否则这些特征值不是实数。
- 几何上这很合理：纯旋转没有不变的实方向。相反，特征值是模长为 1 的复数，编码了旋转角度。

#### 实数与复数场景对比

1. **实对称矩阵 (Symmetric Real Matrices):**
   - 所有特征值均为实数。
   - 特征向量构成正交基。
   - 示例：$\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$ 的特征值为 $3, 1$。

2. **一般实矩阵 (General Real Matrices):**
   - 特征值可能是复数。
   - 若为复数，它们总是成共轭对出现：若 $\lambda = a+bi$，则 $\overline{\lambda} = a-bi$ 也是特征值。

3. **反对称矩阵 (Skew-Symmetric Matrices):**
   - 特征值为纯虚数。
   - 示例：$\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$ 的特征值为 $\pm i$。

下面我们通过 Python 代码来验证上述几种矩阵的特征值情况：

```python
import numpy as np

# 1. 实对称矩阵
A_sym = np.array([[2, 1], [1, 2]])
eigvals_sym = np.linalg.eigvals(A_sym)
print(f"对称矩阵特征值：{eigvals_sym}")  # 应为实数 [3. 1.]

# 2. 旋转矩阵 (一般实矩阵)
theta = np.pi / 3  # 60 度
A_rot = np.array([[np.cos(theta), -np.sin(theta)], 
                  [np.sin(theta), np.cos(theta)]])
eigvals_rot = np.linalg.eigvals(A_rot)
print(f"旋转矩阵特征值：{eigvals_rot}")  # 应为复数共轭对

# 3. 反对称矩阵
A_skew = np.array([[0, -1], [1, 0]])
eigvals_skew = np.linalg.eigvals(A_skew)
print(f"反对称矩阵特征值：{eigvals_skew}")  # 应为纯虚数 [0.+1.j 0.-1.j]
```

#### 复特征值的几何意义

- 如果特征值是实数，变换沿实方向进行缩放。
- 如果特征值是复数，变换涉及旋转和缩放的组合。

对于 $\lambda = re^{i\theta}$：

- $r = |\lambda|$ 控制扩张或收缩。
- $\theta$ 控制旋转。

因此，复特征值代表一种**螺旋运动**：在旋转的同时拉伸或 shrinking。

> **提示**：想象复平面上的乘法。乘以一个复数 $\lambda$ 相当于将向量旋转 $\arg(\lambda)$ 并缩放 $|\lambda|$ 倍。

#### 示例：螺旋动力学

矩阵

$$
A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}
$$

将向量旋转 90°。

- 特征值：$\pm i$。
- 模长 = 1，角度 = $\pi/2$。
- 解释：每一步都是 90° 旋转，无缩放。

如果我们改为

$$
B = \begin{bmatrix} 0.8 & -0.6 \\ 0.6 & 0.8 \end{bmatrix},
$$

特征值为复数且模长 < 1。

- 解释：旋转结合收缩 → 螺旋趋向原点。

我们可以用代码验证矩阵 $B$ 的特征值模长：

```python
B = np.array([[0.8, -0.6], [0.6, 0.8]])
eigvals_B = np.linalg.eigvals(B)
modulus_B = np.abs(eigvals_B)
print(f"矩阵 B 特征值：{eigvals_B}")
print(f"特征值模长：{modulus_B}")  # 应接近 1.0 (0.8^2 + 0.6^2 = 1)
```

#### 日常类比

- **时钟指针**：无拉伸的旋转就像时钟指针移动——方向连续变化但长度保持不变。
- **螺旋楼梯**：每向前一步都涉及上升和旋转，就像复特征值中的缩放和旋转。
- **音高变化**：一个音符可以在音高上升（旋转）的同时音量减弱（缩放）。

#### 应用领域

1. **微分方程**：复特征值产生包含正弦和余弦项的振荡解。
2. **物理学**：振动和波动现象依赖复特征值来建模周期性行为。
3. **控制系统**：稳定性需要检查复平面中特征值的模长。
4. **计算机图形学**：旋转和螺旋运动自然地由复谱描述。
5. **信号处理**：傅里叶变换依赖于卷积算子的复特征结构。

#### 为什么这很重要

- 实特征值描述纯拉伸或压缩。
- 复特征值描述旋转和缩放的组合。
-  Together，它们提供了矩阵在实空间和复空间中行为的完整图景。
- 如果不考虑复特征值，我们会错过整整一类变换，如旋转和振荡。

#### Try It Yourself (动手练习)

1. 求 $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$ 的特征值。并进行几何解释。
2. 对于 45° 旋转，求 $\begin{bmatrix} \cos\frac{\pi}{4} & -\sin\frac{\pi}{4} \\ \sin\frac{\pi}{4} & \cos\frac{\pi}{4} \end{bmatrix}$ 的特征值。证明它们为 $e^{\pm i\pi/4}$。
3. 检查 $\begin{bmatrix} 2 & -5 \\ 1 & -2 \end{bmatrix}$ 的特征值。它们是实数还是复数？
4. **挑战**：证明奇数次实多项式至少有一个实根。将其与奇数维实矩阵的特征值联系起来。

---

#### 练习解答与代码验证

**1. 解答：**
设矩阵为 $A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$。
特征多项式为：
$$
\det(A - \lambda I) = \det \begin{bmatrix} -\lambda & -1 \\ 1 & -\lambda \end{bmatrix} = \lambda^2 - (-1)(1) = \lambda^2 + 1.
$$
令 $\lambda^2 + 1 = 0$，解得 $\lambda = \pm i$。
**几何解释**：这是一个纯旋转矩阵（旋转 90°）。由于没有实向量在旋转 90° 后保持方向不变（即没有实特征向量），因此特征值必须是复数。模长为 1 表示无缩放。

**代码验证：**
```python
A1 = np.array([[0, -1], [1, 0]])
print(f"练习 1 特征值：{np.linalg.eigvals(A1)}")
```

**2. 解答：**
设 $\theta = \frac{\pi}{4}$。矩阵为 $R_{\pi/4}$。
根据前文推导，旋转矩阵的特征值通式为 $\lambda = \cos\theta \pm i \sin\theta = e^{\pm i\theta}$。
代入 $\theta = \frac{\pi}{4}$：
$$
\lambda = \cos\frac{\pi}{4} \pm i \sin\frac{\pi}{4} = \frac{\sqrt{2}}{2} \pm i \frac{\sqrt{2}}{2}.
$$
根据欧拉公式，$e^{\pm i\pi/4} = \cos(\pi/4) \pm i \sin(\pi/4)$，得证。

**代码验证：**
```python
theta = np.pi / 4
A2 = np.array([[np.cos(theta), -np.sin(theta)], [np.sin(theta), np.cos(theta)]])
eigvals_2 = np.linalg.eigvals(A2)
print(f"练习 2 特征值：{eigvals_2}")
# 验证是否接近 e^(i*pi/4)
target = np.exp(1j * theta)
print(f"目标值：{target}, {np.conj(target)}")
```

**3. 解答：**
设矩阵 $C = \begin{bmatrix} 2 & -5 \\ 1 & -2 \end{bmatrix}$。
特征多项式为：
$$
\det(C - \lambda I) = (2-\lambda)(-2-\lambda) - (-5)(1) = -(4 - \lambda^2) + 5 = \lambda^2 - 4 + 5 = \lambda^2 + 1.
$$
令 $\lambda^2 + 1 = 0$，解得 $\lambda = \pm i$。
**结论**：它们是复数（纯虚数）。

**代码验证：**
```python
A3 = np.array([[2, -5], [1, -2]])
print(f"练习 3 特征值：{np.linalg.eigvals(A3)}")
```

**4. 解答：**
**证明思路**：
设 $p(x)$ 是奇数次实多项式，最高次项为 $a_n x^n$（$n$ 为奇数，$a_n \neq 0$）。
- 当 $x \to +\infty$ 时，$p(x)$ 的符号与 $a_n$ 相同。
- 当 $x \to -\infty$ 时，由于 $n$ 是奇数，$x^n$ 变号，故 $p(x)$ 的符号与 $a_n$ 相反。
根据**介值定理**（Intermediate Value Theorem），连续函数如果在两端取值异号，则中间必经过零点。因此至少存在一个实数 $c$ 使得 $p(c)=0$。

**与矩阵的联系**：
对于 $n \times n$ 实矩阵（$n$ 为奇数），其特征多项式 $p_A(\lambda)$ 的次数为 $n$（奇数）。根据上述结论，该多项式至少有一个实根。
**结论**：奇数维实矩阵至少有一个实特征值。这意味着在奇维空间中，任何线性变换至少有一个方向是不发生旋转的（仅缩放）。

**代码验证（3x3 矩阵示例）：**
```python
# 创建一个随机的 3x3 实矩阵
np.random.seed(42)
A4 = np.random.rand(3, 3)
eigvals_4 = np.linalg.eigvals(A4)
print(f"练习 4 示例 (3x3 矩阵) 特征值：{eigvals_4}")
# 观察输出，至少有一个特征值的虚部接近 0
real_eigenvalues = eigvals_4[np.isclose(eigvals_4.imag, 0)]
print(f"其中的实特征值：{real_eigenvalues}")
```

复谱将我们对线性代数的理解扩展到了振荡、旋转和螺旋的丰富世界中，在那里仅靠实数是不够的——几何与复分析融合揭示了真相。