### 70. 线性微分系统

许多自然现象和工程过程都是随时间连续演化的。当这些过程可以用线性关系来描述时，就会引出线性微分方程组。对此类系统的分析几乎完全依赖于**特征值**和**特征向量**，它们决定了解的行为：是振荡、衰减、增长还是趋于稳定。

#### 一般设定

考虑一个一阶线性微分方程组：

$$
\frac{d}{dt}x(t) = A x(t),
$$

其中：

- $x(t) \in \mathbb{R}^n$ 是时刻 $t$ 的状态向量。
- $A \in \mathbb{R}^{n \times n}$ 是常数系数矩阵。

我们的任务是给定初始状态 $x(0)$，求解 $x(t)$。

#### 矩阵指数

该方程的形式解为：

$$
x(t) = e^{At} x(0),
$$

其中 $e^{At}$ 是矩阵指数，定义为：

$$
e^{At} = I + At + \frac{(At)^2}{2!} + \frac{(At)^3}{3!} + \cdots.
$$

> **注意**：虽然这个级数定义在理论上是完美的，但在实际计算中直接截断级数往往效率低下且数值不稳定。我们通常通过对角化或若尔当标准型来计算它。

如何在实践中计算 $e^{At}$？答案来自于对角化和若尔当形。

#### 情形 1：可对角化矩阵

如果 $A$ 是可对角化的：

$$
A = P D P^{-1}, \quad D = \text{diag}(\lambda_1, \ldots, \lambda_n).
$$

那么：

$$
e^{At} = P e^{Dt} P^{-1}, \quad e^{Dt} = \text{diag}(e^{\lambda_1 t}, \ldots, e^{\lambda_n t}).
$$

因此解为：

$$
x(t) = P \begin{bmatrix} e^{\lambda_1 t} & & \\ & \ddots & \\ & & e^{\lambda_n t} \end{bmatrix} P^{-1} x(0).
$$

每个特征值 $\lambda_i$ 决定了沿其特征向量方向的时间行为。

> **提示**：这意味着复杂的矩阵微分问题被转化为了 $n$ 个独立的标量微分方程 $\frac{d}{dt}y_i = \lambda_i y_i$，其解显然是指数函数。

##### Python 数值演示

我们可以使用 `numpy` 来验证对角化方法计算矩阵指数的过程。

```python
import numpy as np
from scipy.linalg import expm  # 用于验证结果

# 定义矩阵 A
A = np.array([[-2, 0], [0, -3]])

# 计算特征值和特征向量
eigenvalues, P = np.linalg.eig(A)
D = np.diag(eigenvalues)
P_inv = np.linalg.inv(P)

# 设定时间 t
t = 1.0

# 方法 1：使用对角化公式 P * exp(Dt) * P^-1
exp_Dt = np.diag(np.exp(eigenvalues * t))
exp_At_manual = P @ exp_Dt @ P_inv

# 方法 2：使用 scipy 的矩阵指数函数直接计算
exp_At_scipy = expm(A * t)

print("手动对角化计算结果:\n", exp_At_manual)
print("Scipy 直接计算结果:\n", exp_At_scipy)
print("两者差异范数:", np.linalg.norm(exp_At_manual - exp_At_scipy))
```

#### 情形 2：不可对角化矩阵

如果 $A$ 是亏损矩阵（defective），使用其若尔当标准型 $J = P^{-1}AP$：

$$
e^{At} = P e^{Jt} P^{-1}.
$$

对于大小为 2 的若尔当块：

$$
J = \begin{bmatrix} \lambda & 1 \\ 0 & \lambda \end{bmatrix}, \quad
e^{Jt} = e^{\lambda t} \begin{bmatrix} 1 & t \\ 0 & 1 \end{bmatrix}.
$$

这里出现了 $t$ 的多项式项，与指数部分相乘。这解释了为什么当特征值重复且特征向量不足时，解中会出现额外的多项式因子（如 $t e^{\lambda t}$）。

#### 实特征值与复特征值

- **实特征值**：解沿特征向量方向指数增长或衰减。

  - 若 $\lambda < 0$：指数衰减 → 稳定。
  - 若 $\lambda > 0$：指数增长 → 不稳定。

- **复特征值**：$\lambda = a \pm bi$。解涉及振荡：

  $$
  e^{(a+bi)t} = e^{at}(\cos(bt) + i \sin(bt)).
  $$

  - 若 $a < 0$：衰减振荡。
  - 若 $a > 0$：增长振荡。
  - 若 $a = 0$：纯振荡，中性稳定。

> **注意**：对于实矩阵 $A$，复特征值总是成共轭对出现，最终的实际解可以通过取实部和虚部构造出来，确保 $x(t)$ 是实向量。

#### 示例 1：实特征值

$$
A = \begin{bmatrix} -2 & 0 \\ 0 & -3 \end{bmatrix}.
$$

特征值：$-2, -3$。
解：

$$
x(t) = \begin{bmatrix} c_1 e^{-2t} \\ c_2 e^{-3t} \end{bmatrix}.
$$

两项均衰减 → 原点处为稳定平衡点（汇点）。

#### 示例 2：复特征值

$$
A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}.
$$

特征值：$\pm i$。
解：

$$
x(t) = c_1 \begin{bmatrix} \cos t \\ \sin t \end{bmatrix} + c_2 \begin{bmatrix} -\sin t \\ \cos t \end{bmatrix}.
$$

纯振荡 → 绕原点的圆周运动。

#### 示例 3：混合稳定性

$$
A = \begin{bmatrix} 1 & 0 \\ 0 & -2 \end{bmatrix}.
$$

特征值：$1, -2$。
解：

$$
x(t) = \begin{bmatrix} c_1 e^t \\ c_2 e^{-2t} \end{bmatrix}.
$$

一个方向增长，一个方向衰减 → 整体不稳定，因为一个方向的发散占主导地位（鞍点）。

#### 几何意义

- 特征向量构成了系统的“流轴”。
- 特征值决定了沿这些轴的流是螺旋、增长还是收缩。
- 系统的相图（平面上的轨迹）由这种相互作用塑造。

例如：

- 负特征值 → 轨迹漏斗式汇入原点。
- 正特征值 → 轨迹向外排斥。
- 复特征值 → 螺旋线或圆。

#### 日常类比

- **种群动力学**：增长率对应特征值。负率 → 灭绝；正率 → 爆炸式增长。
- **工程振动**：特征值决定共振频率和阻尼。
- **金融**：带有振荡分量（复特征值）的利率描述周期性经济。
- **气候模型**：平衡态的稳定性（如温室气体平衡）取决于特征值的符号。

#### 应用领域

1. **控制理论**：系统的稳定性分析要求特征值位于左半平面。
2. **物理学**：振动、量子振荡和衰变过程都遵循特征值规则。
3. **生物学**：种群模型根据线性微分方程演化。
4. **经济学**：市场的线性模型根据特征值收敛或发散。
5. **神经科学**：神经发放动力学可建模为线性常微分方程组。

#### 为什么这很重要

- 线性微分系统架起了线性代数与现实世界动力学之间的桥梁。
- 特征值决定的不仅仅是数字，而是随时间的行为：增长、衰减、振荡或平衡。
- 它们为分析非线性系统提供了基础，非线性系统通常通过在平衡点附近线性化来研究。

#### 动手试一试

1. 求解 $\frac{dx}{dt} = \begin{bmatrix} -1 & 2 \\ -2 & -1 \end{bmatrix}x$。解释解的含义。
2. 对于 $A = \begin{bmatrix} 0 & -2 \\ 2 & 0 \end{bmatrix}$，计算特征值并描述运动。
3. 验证当 $A$ 可对角化时，$e^{At} = P e^{Dt} P^{-1}$ 成立。
4. **挑战**：证明如果 $A$ 的所有特征值实部均为负，则对于任意初始条件，$\lim_{t \to \infty} x(t) = 0$。

#### 练习题解答与详细过程

**1. 求解 $\frac{dx}{dt} = \begin{bmatrix} -1 & 2 \\ -2 & -1 \end{bmatrix}x$ 并解释**

**解答过程：**
首先求矩阵 $A = \begin{bmatrix} -1 & 2 \\ -2 & -1 \end{bmatrix}$ 的特征值。
特征方程为 $\det(A - \lambda I) = 0$：
$$
\det \begin{bmatrix} -1-\lambda & 2 \\ -2 & -1-\lambda \end{bmatrix} = (-1-\lambda)^2 - (-4) = \lambda^2 + 2\lambda + 1 + 4 = \lambda^2 + 2\lambda + 5 = 0.
$$
解得 $\lambda = \frac{-2 \pm \sqrt{4 - 20}}{2} = -1 \pm 2i$。

由于特征值是复数 $\lambda = -1 \pm 2i$，实部 $a = -1 < 0$，虚部 $b = 2$。
这意味着解将呈现**衰减振荡**的形式。
通解形式为：
$$
x(t) = e^{-t} \left( c_1 \begin{bmatrix} \cos 2t \\ -\sin 2t \end{bmatrix} + c_2 \begin{bmatrix} \sin 2t \\ \cos 2t \end{bmatrix} \right).
$$
**解释**：轨迹是一个 spiraling sink（螺旋汇点）。随着时间 $t$ 增加，$e^{-t}$ 项使振幅衰减，而三角函数项使状态向量绕原点旋转。系统最终稳定在原点。

**2. 对于 $A = \begin{bmatrix} 0 & -2 \\ 2 & 0 \end{bmatrix}$，计算特征值并描述运动**

**解答过程：**
特征方程：
$$
\det \begin{bmatrix} -\lambda & -2 \\ 2 & -\lambda \end{bmatrix} = \lambda^2 + 4 = 0 \implies \lambda = \pm 2i.
$$
特征值为纯虚数 $\pm 2i$，实部 $a=0$。
**描述**：这对应于**中心点（Center）**。解的形式为纯振荡（正弦和余弦的组合），没有指数衰减或增长项。
轨迹是围绕原点的闭合曲线（椭圆或圆）。系统是中性的，既不发散也不收敛到原点，能量守恒。

**3. 验证 $e^{At} = P e^{Dt} P^{-1}$ 当 $A$ 可对角化**

**解答过程：**
已知 $A = P D P^{-1}$。
根据矩阵指数定义：
$$
e^{At} = \sum_{k=0}^{\infty} \frac{(At)^k}{k!} = \sum_{k=0}^{\infty} \frac{(P D P^{-1} t)^k}{k!}.
$$
注意矩阵幂的性质：$(P D P^{-1})^k = P D^k P^{-1}$。
因此：
$$
(At)^k = (P D P^{-1} t)^k = P (Dt)^k P^{-1}.
$$
代入级数：
$$
e^{At} = \sum_{k=0}^{\infty} \frac{P (Dt)^k P^{-1}}{k!} = P \left( \sum_{k=0}^{\infty} \frac{(Dt)^k}{k!} \right) P^{-1} = P e^{Dt} P^{-1}.
$$
得证。这里利用了矩阵乘法的线性性质，可以将常数矩阵 $P$ 和 $P^{-1}$ 提取到求和符号之外。

**4. 挑战：证明若所有特征值实部为负，则 $\lim_{t \to \infty} x(t) = 0$**

**解答过程：**
假设 $A$ 可对角化（对于不可对角化情况，若尔当块中的多项式项 $t^k$ 增长速度慢于指数衰减 $e^{\text{Re}(\lambda)t}$，结论依然成立，这里以对角化为例说明核心思想）。
设 $A = P D P^{-1}$，其中 $D = \text{diag}(\lambda_1, \ldots, \lambda_n)$。
解为 $x(t) = P e^{Dt} P^{-1} x(0)$。
令 $c = P^{-1} x(0)$ 为常数向量。则：
$$
x(t) = P \begin{bmatrix} e^{\lambda_1 t} & & \\ & \ddots & \\ & & e^{\lambda_n t} \end{bmatrix} c = \sum_{i=1}^n c_i e^{\lambda_i t} v_i,
$$
其中 $v_i$ 是 $P$ 的列向量（特征向量）。
考虑每一项的模：
$$
|e^{\lambda_i t}| = |e^{(\text{Re}(\lambda_i) + i \text{Im}(\lambda_i)) t}| = e^{\text{Re}(\lambda_i) t}.
$$
已知所有 $\text{Re}(\lambda_i) < 0$。
因此，当 $t \to \infty$ 时，$e^{\text{Re}(\lambda_i) t} \to 0$。
由于有限项求和，且 $P$ 和 $c$ 都是有界常数，故：
$$
\lim_{t \to \infty} x(t) = 0.
$$
证毕。

线性微分系统展示了特征值如何在模型中控制时间的流动。它们解释了为什么有些过程会消亡，有些会振荡，而有些会无限增长——为无数现实世界现象提供了数学骨架。

#### 结语 
```
谱象引流变，
兴衰交织岁月间，
特征根中见未来。
```

## 第 8 章。正交性、最小二乘法与 QR 分解
#### 开篇
```
正交相望，
相交而不乱路径，
静默中平衡。
```