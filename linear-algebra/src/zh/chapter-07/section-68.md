### 68. 稳定性与谱半径

当一个矩阵被重复应用时——无论是通过迭代、递归还是动力系统——其长期行为并不取决于矩阵中的单个元素，而是由其**特征值**决定的。这里的关键度量是**谱半径**（Spectral Radius），它告诉我们重复应用会导致收敛、振荡还是发散。

#### 谱半径

矩阵 $A$ 的谱半径定义为：

$$
\rho(A) = \max \{ |\lambda| : \lambda \text{ is an eigenvalue of } A \}.
$$

- 它是所有特征值中绝对值最大的那个。
- 如果 $|\lambda| > 1$，该特征值会导致沿其特征向量方向指数增长。
- 如果 $|\lambda| < 1$，它会导致指数衰减。
- 如果 $|\lambda| = 1$，行为取决于该特征值是简单的还是有缺陷的（defective）。

> **注意**：谱半径关注的是特征值的“模”（绝对值）。对于复数特征值，我们需要计算其在复平面上的距离原点的长度。

#### 迭代系统中的稳定性

考虑一个递归过程：

$$
x_{k+1} = A x_k.
$$

- 如果 $\rho(A) < 1$，则当 $k \to \infty$ 时，$A^k \to 0$。所有轨迹都收敛于原点。
- 如果 $\rho(A) > 1$，则 $A^k$ 会沿主导特征向量方向无界增长。
- 如果 $\rho(A) = 1$，轨迹既不会消失也不会发散，但可能会振荡或停滞。

#### 示例：小谱半径的收敛

$$
A = \begin{bmatrix} 0.5 & 0 \\ 0 & 0.8 \end{bmatrix}.
$$

- 特征值：$0.5, 0.8$。
- $\rho(A) = 0.8 < 1$。
- 幂 $A^k$ 将向量收缩至零 → 稳定系统。

#### 示例：大谱半径的发散

$$
B = \begin{bmatrix} 2 & 0 \\ 0 & 0.5 \end{bmatrix}.
$$

- 特征值：$2, 0.5$。
- $\rho(B) = 2 > 1$。
- 幂 $B^k$ 会沿特征向量 $(1,0)$ 方向爆炸式增长。

#### 示例：复特征值的振荡

$$
C = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}.
$$

- 特征值：$\pm i$，模均为 1。
- $\rho(C) = 1$。
- 系统是中性稳定的：向量永远旋转，既不收缩也不增长。

#### Python 数值演示

我们可以使用 `numpy` 来验证上述矩阵的幂行为以及谱半径的计算。

```python
import numpy as np

def analyze_matrix(name, M, steps=10):
    eigenvalues = np.linalg.eigvals(M)
    spectral_radius = np.max(np.abs(eigenvalues))
    print(f"--- {name} ---")
    print(f"特征值：{eigenvalues}")
    print(f"谱半径 ρ(A): {spectral_radius:.4f}")
    
    # 模拟迭代 x_{k+1} = A x_k
    x = np.array([1.0, 1.0])
    norms = []
    for k in range(steps):
        norms.append(np.linalg.norm(x))
        x = M @ x
    
    print(f"向量范数变化趋势 (前 {steps} 步): {norms}")
    if spectral_radius < 1:
        print("结论：系统收敛 (稳定)")
    elif spectral_radius > 1:
        print("结论：系统发散 (不稳定)")
    else:
        print("结论：中性稳定或需进一步检查缺陷性")
    print()

# 定义示例矩阵
A = np.array([[0.5, 0], [0, 0.8]])
B = np.array([[2, 0], [0, 0.5]])
C = np.array([[0, -1], [1, 0]])

analyze_matrix("收敛矩阵 A", A)
analyze_matrix("发散矩阵 B", B)
analyze_matrix("振荡矩阵 C", C)
```

#### 超越简单稳定性：亏损情况

如果一个矩阵拥有满足 $|\lambda|=1$ 的特征值，且该矩阵是**亏损的**（defective，即几何重数小于代数重数，不可对角化），那么 $A^k$ 中会出现关于 $k$ 的多项式项，即使 $\rho(A)=1$，也会导致缓慢发散。

示例：

$$
D = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}.
$$

- 特征值：$\lambda=1$（代数重数 AM=2, 几何重数 GM=1）。
- $\rho(D)=1$。
- 幂随 $k$ 线性增长：

  $$
  D^k = \begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix}.
  $$
- 尽管谱半径等于 1，系统仍是不稳定的。

> **提示**：对于 $\rho(A)=1$ 的情况，必须检查矩阵是否可对角化。如果存在 Jordan 块且块的大小大于 1，系统通常是不稳定的。

#### 几何意义

谱半径衡量了变换的主导模式：

- 想象拉伸和旋转一张橡胶膜。经过多次重复后，薄膜会与对应于最大特征值的方向对齐。
- 如果拉伸系数小于 1，一切都会收缩。
- 如果大于 1，一切都会膨胀。
- 如果恰好等于 1，系统处于稳定性的边缘。

#### 日常类比

- **种群动力学**：如果繁殖因子（最大特征值）低于 1，物种灭绝；高于 1，种群增长；等于 1，保持平衡。
- **银行利息**：利率因子 < 1 使余额缩水；> 1 使余额增长；= 1 保持不变。
- **大厅回声**：如果 $\rho<1$，每次回声都会减弱；如果 $\rho=1$，回声持续；如果 $\rho>1$，声音会变得混乱且无限增大。

#### 应用领域

1. **数值方法**：迭代求解器（如 Jacobi、Gauss–Seidel）的收敛性取决于谱半径是否 < 1。
2. **马尔可夫链**：如果最大特征值 = 1 且其他特征值模 < 1，则存在长期分布。
3. **控制理论**：系统稳定性由单位圆内的特征值（$|\lambda| < 1$）判定。
4. **经济学**：投入产出模型仅在谱半径 < 1 时保持有界。
5. **流行病学**：基本再生数 $R_0$ 本质上是下一代矩阵的谱半径。

#### 为什么它很重要

- 谱半径将整个矩阵的谱压缩为单个稳定性判据。
- 它预测了迭代过程的命运，从金融增长到疾病传播。
- 它在线性系统的衰减、平衡和爆炸之间划出了清晰的界限。

#### Try It Yourself (动手练习)

1. 计算矩阵 $\begin{bmatrix} 0.6 & 0.3 \\ 0.1 & 0.8 \end{bmatrix}$ 的谱半径。该系统是否收敛？
2. 证明对于任意矩阵范数 $\|\cdot\|$，

   $$
   \rho(A) \leq \|A\|.
   $$

   （提示：使用盖尔范德公式 Gelfand's formula。）
3. 对于 $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$，解释为什么即使 $\rho=1$ 它仍然发散。
4. **挑战**：证明盖尔范德公式：

   $$
   \rho(A) = \lim_{k\to\infty} \|A^k\|^{1/k}.
   $$

---

### 练习题详细解答

#### 1. 计算谱半径与收敛性

**题目**：计算 $M = \begin{bmatrix} 0.6 & 0.3 \\ 0.1 & 0.8 \end{bmatrix}$ 的谱半径。系统是否收敛？

**解答**：
首先求特征值。计算特征多项式 $\det(M - \lambda I) = 0$：

$$
\det \begin{bmatrix} 0.6 - \lambda & 0.3 \\ 0.1 & 0.8 - \lambda \end{bmatrix} = (0.6 - \lambda)(0.8 - \lambda) - (0.3)(0.1) = 0
$$

展开方程：
$$
\lambda^2 - 1.4\lambda + 0.48 - 0.03 = 0 \\
\lambda^2 - 1.4\lambda + 0.45 = 0
$$

利用求根公式：
$$
\lambda = \frac{1.4 \pm \sqrt{1.4^2 - 4 \times 0.45}}{2} = \frac{1.4 \pm \sqrt{1.96 - 1.8}}{2} = \frac{1.4 \pm \sqrt{0.16}}{2}
$$
$$
\lambda = \frac{1.4 \pm 0.4}{2}
$$

得到两个特征值：
$$
\lambda_1 = \frac{1.8}{2} = 0.9, \quad \lambda_2 = \frac{1.0}{2} = 0.5
$$

谱半径为特征值模的最大值：
$$
\rho(M) = \max(|0.9|, |0.5|) = 0.9
$$

**结论**：因为 $\rho(M) = 0.9 < 1$，所以该系统是**收敛**的（稳定）。

**Python 验证代码**：
```python
import numpy as np
M = np.array([[0.6, 0.3], [0.1, 0.8]])
eigs = np.linalg.eigvals(M)
print(f"特征值：{eigs}")
print(f"谱半径：{np.max(np.abs(eigs))}")
```

#### 2. 证明谱半径不等式

**题目**：证明对于任意矩阵范数 $\|\cdot\|$，$\rho(A) \leq \|A\|$。

**解答**：
**方法一：利用特征值定义（直观法）**
设 $\lambda$ 是 $A$ 的任意特征值，$v$ 是对应的非零特征向量，即 $Av = \lambda v$。
对等式两边取范数：
$$
\|Av\| = \|\lambda v\| = |\lambda| \|v\|
$$
根据矩阵范数的相容性性质（$\|Ax\| \le \|A\| \|x\|$）：
$$
\|Av\| \le \|A\| \|v\|
$$
结合上述两式：
$$
|\lambda| \|v\| \le \|A\| \|v\|
$$
因为 $v \neq 0$，所以 $\|v\| > 0$，可以消去 $\|v\|$：
$$
|\lambda| \le \|A\|
$$
由于这对任意特征值 $\lambda$ 都成立，因此最大模也满足：
$$
\rho(A) = \max |\lambda| \le \|A\|
$$

**方法二：利用提示中的盖尔范德公式**
已知盖尔范德公式 $\rho(A) = \lim_{k\to\infty} \|A^k\|^{1/k}$。
根据矩阵范数的次乘性（sub-multiplicativity），$\|A^k\| \le \|A\|^k$。
两边开 $k$ 次方：
$$
\|A^k\|^{1/k} \le (\|A\|^k)^{1/k} = \|A\|
$$
令 $k \to \infty$，左边趋近于 $\rho(A)$，右边保持不变：
$$
\rho(A) \le \|A\|
$$
证毕。

#### 3. 解释亏损矩阵的发散性

**题目**：对于 $D = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$，解释为什么它发散即使 $\rho=1$。

**解答**：
1.  **特征值分析**：$D$ 是上三角矩阵，对角线元素即为特征值。$\lambda_1 = 1, \lambda_2 = 1$。因此 $\rho(D) = 1$。
2.  **几何重数**：求解 $(D - I)v = 0$，即 $\begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = 0$，得到 $y=0$。特征向量只有一维 span$\left(\begin{bmatrix} 1 \\ 0 \end{bmatrix}\right)$。几何重数 (GM)=1 < 代数重数 (AM)=2。因此 $D$ 不可对角化，是亏损矩阵。
3.  **矩阵幂的计算**：通过数学归纳法可以证明：
    $$
    D^k = \begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix}
    $$
4.  **稳定性判断**：虽然特征值的模没有超过 1，但矩阵幂中的元素 $k$ 随着迭代次数无限增长。对于任意向量 $x_0 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$：
    $$
    x_k = D^k x_0 = \begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} k \\ 1 \end{bmatrix}
    $$
    当 $k \to \infty$ 时，$\|x_k\| \to \infty$。
5.  **结论**：由于 Jordan 块的存在引入了多项式增长项 $k$，导致系统不稳定。这说明 $\rho(A) \le 1$ 是稳定的必要条件，但对于 $\rho(A)=1$ 的情况，还需矩阵可对角化才能保证稳定。

#### 4. 挑战：证明盖尔范德公式

**题目**：证明 $\rho(A) = \lim_{k\to\infty} \|A^k\|^{1/k}$。

**解答**：
证明分为两部分：下界估计和上界估计。

**第一部分：证明 $\rho(A) \le \liminf_{k\to\infty} \|A^k\|^{1/k}$**
对于任意特征值 $\lambda$ 和对应的特征向量 $v$，有 $A^k v = \lambda^k v$。
取范数：
$$
|\lambda|^k \|v\| = \|\lambda^k v\| = \|A^k v\| \le \|A^k\| \|v\|
$$
消去 $\|v\|$ 得 $|\lambda|^k \le \|A^k\|$，即 $|\lambda| \le \|A^k\|^{1/k}$。
这对所有特征值成立，故 $\rho(A) \le \|A^k\|^{1/k}$ 对所有 $k$ 成立。
因此，$\rho(A) \le \liminf_{k\to\infty} \|A^k\|^{1/k}$。

**第二部分：证明 $\limsup_{k\to\infty} \|A^k\|^{1/k} \le \rho(A)$**
这是较难的部分。我们利用 Jordan 标准型或摄动法。
对于任意 $\epsilon > 0$，构造矩阵 $B = \frac{1}{\rho(A) + \epsilon} A$。
则 $\rho(B) = \frac{\rho(A)}{\rho(A) + \epsilon} < 1$。
根据稳定性理论，若谱半径小于 1，则矩阵幂收敛于零矩阵，即 $\lim_{k\to\infty} B^k = 0$。
这意味着序列 $\|B^k\|$ 是有界的。存在常数 $C$ 使得 $\|B^k\| \le C$ 对所有 $k$ 成立。
代回 $A$：
$$
\left\| \left( \frac{A}{\rho(A) + \epsilon} \right)^k \right\| \le C \implies \|A^k\| \le C (\rho(A) + \epsilon)^k
$$
两边开 $k$ 次方：
$$
\|A^k\|^{1/k} \le C^{1/k} (\rho(A) + \epsilon)
$$
令 $k \to \infty$，注意到 $\lim_{k\to\infty} C^{1/k} = 1$，得：
$$
\limsup_{k\to\infty} \|A^k\|^{1/k} \le \rho(A) + \epsilon
$$
由于 $\epsilon$ 是任意正数，令 $\epsilon \to 0$