### 73. 格拉姆 - 施密特正交化过程

格拉姆 - 施密特过程（Gram–Schmidt Process）是一种系统化的方法，用于将任意线性无关的向量组转化为标准正交基（Orthonormal Basis）。这一过程是代数与几何之间最优雅的桥梁之一：它接收任意向量，使它们变得相互垂直，同时保持它们所张成的空间不变。

#### 它解决的问题

给定内积空间中的一组线性无关向量 $\{v_1, v_2, \dots, v_n\}$：

- 它们张成某个子空间 $W$。
- 但它们不一定正交，也不一定为单位向量。

目标：为 $W$ 构造一组标准正交基 $\{u_1, u_2, \dots, u_n\}$。

#### 格拉姆 - 施密特算法

1. 从第一个向量开始：

   $$
   u_1 = \frac{v_1}{\|v_1\|}.
   $$

2. 对于第二个向量，减去其在 $u_1$ 上的投影：

   $$
   w_2 = v_2 - \langle v_2, u_1 \rangle u_1, \quad u_2 = \frac{w_2}{\|w_2\|}.
   $$

3. 对于第三个向量，减去其在 $u_1$ 和 $u_2$ 上的投影：

   $$
   w_3 = v_3 - \langle v_3, u_1 \rangle u_1 - \langle v_3, u_2 \rangle u_2, \quad u_3 = \frac{w_3}{\|w_3\|}.
   $$

4. 依此类推，使用归纳法：

   $$
   w_k = v_k - \sum_{j=1}^{k-1} \langle v_k, u_j \rangle u_j, \quad u_k = \frac{w_k}{\|w_k\|}.
   $$

在每一步中，$w_k$ 被构造为与所有之前的 $u_j$ 正交，然后单位化形成 $u_k$。

> **注意**：公式中的 $\langle v, u \rangle$ 表示向量的内积。在 $\mathbb{R}^n$ 中，通常指点积 $v \cdot u$。$\|v\|$ 表示向量的范数（长度）。

#### Python 数值演示

为了帮助理解该算法的实际计算过程，我们可以使用 `numpy` 来实现格拉姆 - 施密特过程。以下代码演示了如何将一组向量正交化。

```python
import numpy as np

def gram_schmidt(vectors):
    """
    对一组向量进行格拉姆 - 施密特正交化
    参数：vectors - 列表，包含多个 numpy 数组
    返回：正交化后的单位向量列表
    """
    basis = []
    for v in vectors:
        w = v.copy()
        # 减去在已有基向量上的投影
        for b in basis:
            proj = np.dot(v, b) * b
            w = w - proj
        # 单位化
        norm = np.linalg.norm(w)
        if norm > 1e-10: # 避免除以零
            u = w / norm
            basis.append(u)
        else:
            print("警告：检测到线性相关向量，跳过。")
    return basis

# 示例：R^2 中的向量
v1 = np.array([1, 1])
v2 = np.array([1, 0])
vectors = [v1, v2]

orthonormal_basis = gram_schmidt(vectors)

print("原始向量:")
for v in vectors: print(v)
print("\n标准正交基:")
for u in orthonormal_basis: print(u)

# 验证正交性
if len(orthonormal_basis) == 2:
    dot_product = np.dot(orthonormal_basis[0], orthonormal_basis[1])
    print(f"\n验证正交性 (点积应接近 0): {dot_product}")
```

#### $\mathbb{R}^2$ 中的示例

从 $v_1 = (1,1)$, $v_2 = (1,0)$ 开始。

1. 单位化第一个向量：

   $$
   u_1 = \frac{(1,1)}{\sqrt{2}} = \left(\tfrac{1}{\sqrt{2}}, \tfrac{1}{\sqrt{2}}\right).
   $$

2. 减去 $v_2$ 在 $u_1$ 上的投影：

   $$
   w_2 = (1,0) - \left(\tfrac{1}{\sqrt{2}}\cdot1 + \tfrac{1}{\sqrt{2}}\cdot0\right)\left(\tfrac{1}{\sqrt{2}}, \tfrac{1}{\sqrt{2}}\right).
   $$

   $$
   = (1,0) - \tfrac{1}{\sqrt{2}}\left(\tfrac{1}{\sqrt{2}}, \tfrac{1}{\sqrt{2}}\right).
   $$

   $$
   = (1,0) - (0.5,0.5) = (0.5,-0.5).
   $$

3. 单位化：

   $$
   u_2 = \frac{(0.5,-0.5)}{\sqrt{0.5^2+(-0.5)^2}} = \frac{(0.5,-0.5)}{\sqrt{0.5}} = \left(\tfrac{1}{\sqrt{2}}, -\tfrac{1}{\sqrt{2}}\right).
   $$

最终的标准正交基：

$$
u_1 = \left(\tfrac{1}{\sqrt{2}}, \tfrac{1}{\sqrt{2}}\right), \quad u_2 = \left(\tfrac{1}{\sqrt{2}}, -\tfrac{1}{\sqrt{2}}\right).
$$

#### 几何直观

- 每一步都移除了与之前选定方向的“重叠”部分。
- 可以将其想象为在原始向量张成的空间内部构建新的垂直坐标轴。
- 结果就像是将原始集合旋转和缩放，变成一个完美的正交系统。

> **提示**：想象你在整理一堆杂乱的棍子。格拉姆 - 施密特过程就像是将它们一根根调整，使得每一根新棍子都与之前调整好的棍子垂直，且不改变它们整体覆盖的范围。

#### 数值稳定性

- 经典格拉姆 - 施密特算法在计算机计算中可能会受到舍入误差（round-off errors）的影响，导致结果不完全正交。
- 一种数值更稳定的替代方案是改进格拉姆 - 施密特法（Modified Gram–Schmidt, MGS），它重新排列投影步骤以减少正交性的损失。
- 在实践中，QR 分解算法通常实现 MGS 或豪斯霍尔德变换（Householder reflections）。

#### 日常类比

- **团队合作**：如果两名队友的角色重叠，格拉姆 - 施密特过程重新分配精力，直到每个人独立工作。
- **噪声过滤**：正交分量将有用信号与冗余信息分离。
- **烹饪食谱**：调整配料，使每种配料增添独特的风味，而不重复已有的味道。

#### 应用领域

1. **QR 分解**：格拉姆 - 施密特提供了基础：$A = QR$，其中 $Q$ 是正交矩阵，$R$ 是上三角矩阵。
2. **数据压缩**：源自格拉姆 - 施密特的标准正交基可导致高效的表示。
3. **信号处理**：确保频率或波分量的独立性。
4. **机器学习**：用于特征的正交化和降维。
5. **物理学**：量子力学中的正交态可以使用格拉姆 - 施密特从任意态构造。

#### 为什么它很重要

- 格拉姆 - 施密特保证任何线性无关集都可以重塑为标准正交基。
- 它是 QR 分解、最小二乘法和数值偏微分方程求解器等计算方法的基础。
- 它使投影、坐标和正交性变得明确且易于管理。

#### 动手试一试

1. 对 $\mathbb{R}^3$ 中的 $(1,0,1)$, $(1,1,0)$, $(0,1,1)$ 应用格拉姆 - 施密特过程。验证标准正交性。
2. 证明标准正交基的张成空间等于原始向量的张成空间。
3. 使用格拉姆 - 施密特过程找到多项式 $\{1,x,x^2\}$ 在 $[-1,1]$ 上的标准正交基，内积定义为 $\langle f,g\rangle = \int_{-1}^1 f(x)g(x)\,dx$。
4. **挑战**：证明格拉姆 - 施密特过程对线性无关集总是有效，但如果集合线性相关则会失败。

#### 练习题参考答案与解析

##### 1. $\mathbb{R}^3$ 中的正交化

**解：**
设 $v_1 = (1,0,1)$, $v_2 = (1,1,0)$, $v_3 = (0,1,1)$。

**第一步：处理 $v_1$**
$$
\|v_1\| = \sqrt{1^2 + 0^2 + 1^2} = \sqrt{2}.
$$
$$
u_1 = \frac{v_1}{\|v_1\|} = \left(\frac{1}{\sqrt{2}}, 0, \frac{1}{\sqrt{2}}\right).
$$

**第二步：处理 $v_2$**
计算 $v_2$ 在 $u_1$ 上的投影系数：
$$
\langle v_2, u_1 \rangle = 1 \cdot \frac{1}{\sqrt{2}} + 1 \cdot 0 + 0 \cdot \frac{1}{\sqrt{2}} = \frac{1}{\sqrt{2}}.
$$
计算正交分量 $w_2$：
$$
w_2 = v_2 - \langle v_2, u_1 \rangle u_1 = (1,1,0) - \frac{1}{\sqrt{2}}\left(\frac{1}{\sqrt{2}}, 0, \frac{1}{\sqrt{2}}\right) = (1,1,0) - \left(\frac{1}{2}, 0, \frac{1}{2}\right) = \left(\frac{1}{2}, 1, -\frac{1}{2}\right).
$$
单位化 $w_2$：
$$
\|w_2\| = \sqrt{\left(\frac{1}{2}\right)^2 + 1^2 + \left(-\frac{1}{2}\right)^2} = \sqrt{\frac{1}{4} + 1 + \frac{1}{4}} = \sqrt{\frac{3}{2}} = \frac{\sqrt{6}}{2}.
$$
$$
u_2 = \frac{w_2}{\|w_2\|} = \frac{2}{\sqrt{6}}\left(\frac{1}{2}, 1, -\frac{1}{2}\right) = \left(\frac{1}{\sqrt{6}}, \frac{2}{\sqrt{6}}, -\frac{1}{\sqrt{6}}\right).
$$

**第三步：处理 $v_3$**
计算投影系数：
$$
\langle v_3, u_1 \rangle = 0 \cdot \frac{1}{\sqrt{2}} + 1 \cdot 0 + 1 \cdot \frac{1}{\sqrt{2}} = \frac{1}{\sqrt{2}}.
$$
$$
\langle v_3, u_2 \rangle = 0 \cdot \frac{1}{\sqrt{6}} + 1 \cdot \frac{2}{\sqrt{6}} + 1 \cdot \left(-\frac{1}{\sqrt{6}}\right) = \frac{1}{\sqrt{6}}.
$$
计算正交分量 $w_3$：
$$
w_3 = v_3 - \langle v_3, u_1 \rangle u_1 - \langle v_3, u_2 \rangle u_2
$$
$$
= (0,1,1) - \frac{1}{\sqrt{2}}\left(\frac{1}{\sqrt{2}}, 0, \frac{1}{\sqrt{2}}\right) - \frac{1}{\sqrt{6}}\left(\frac{1}{\sqrt{6}}, \frac{2}{\sqrt{6}}, -\frac{1}{\sqrt{6}}\right)
$$
$$
= (0,1,1) - \left(\frac{1}{2}, 0, \frac{1}{2}\right) - \left(\frac{1}{6}, \frac{2}{6}, -\frac{1}{6}\right)
$$
$$
= \left(-\frac{1}{2} - \frac{1}{6}, 1 - \frac{1}{3}, 1 - \frac{1}{2} + \frac{1}{6}\right) = \left(-\frac{2}{3}, \frac{2}{3}, \frac{2}{3}\right).
$$
单位化 $w_3$：
$$
\|w_3\| = \sqrt{\left(-\frac{2}{3}\right)^2 + \left(\frac{2}{3}\right)^2 + \left(\frac{2}{3}\right)^2} = \sqrt{\frac{12}{9}} = \frac{2\sqrt{3}}{3}.
$$
$$
u_3 = \frac{w_3}{\|w_3\|} = \frac{3}{2\sqrt{3}}\left(-\frac{2}{3}, \frac{2}{3}, \frac{2}{3}\right) = \left(-\frac{1}{\sqrt{3}}, \frac{1}{\sqrt{3}}, \frac{1}{\sqrt{3}}\right).
$$

**验证正交性：**
- $\langle u_1, u_2 \rangle = \frac{1}{\sqrt{12}} - \frac{1}{\sqrt{12}} = 0$.
- $\langle u_1, u_3 \rangle = -\frac{1}{\sqrt{6}} + \frac{1}{\sqrt{6}} = 0$.
- $\langle u_2, u_3 \rangle = -\frac{1}{\sqrt{18}} + \frac{2}{\sqrt{18}} - \frac{1}{\sqrt{18}} = 0$.
所有向量长度均为 1 且两两正交，验证通过。

##### 2. 张成空间相等性证明

**解：**
我们需要证明 $\text{span}\{u_1, \dots, u_k\} = \text{span}\{v_1, \dots, v_k\}$ 对于所有 $k=1,\dots,n$ 成立。

**证明过程：**
使用数学归纳法。
- **基础步骤** ($k=1$)：$u_1 = \frac{v_1}{\|v_1\|}$。显然 $u_1$ 是 $v_1$ 的倍数，$v_1$ 也是 $u_1$ 的倍数。故 $\text{span}\{u_1\} = \text{span}\{v_1\}$。
- **归纳步骤**：假设对于 $k-1$ 成立，即 $\text{span}\{u_1, \dots, u_{k-1}\} = \text{span}\{v_1, \dots, v_{k-1}\}$。
  根据算法公式：
  $$
  w_k = v_k - \sum_{j=1}^{k-1} \langle v_k, u_j \rangle u_j.
  $$
  这里 $w_k$ 是 $v_k$ 与前 $k-1$ 个 $u_j$ 的线性组合。由于 $u_j$ 属于 $\text{span}\{v_1, \dots, v_{k-1}\}$，所以 $w_k$ 属于 $\text{span}\{v_1, \dots, v_k\}$。因为 $u_k$ 是 $w_k$ 的倍数，所以 $u_k \in \text{span}\{v_1, \dots, v_k\}$。
  反之，由公式可得：
  $$
  v_k = w_k + \sum_{j=1}^{k-1} \langle v_k, u_j \rangle u_j = \|w_k\|u_k + \sum_{j=1}^{k-1} \langle v_k, u_j \rangle u_j.
  $$
  这表明 $v_k$ 是 $\{u_1, \dots, u_k\}$ 的线性组合。
  因此，两个集合互相包含，张成空间相等。

##### 3. 多项式空间的正交化（勒让德多项式）

**问题**：对多项式 $\{1, x, x^2\}$ 在区间 $[-1, 1]$ 上使用格拉姆-施密特正交化，内积定义为 $\langle f, g \rangle = \int_{-1}^{1} f(x)g(x)\,dx$。

**解：**

**第一步：处理 $p_0(x) = 1$**

计算范数：
$$
\|p_0\|^2 = \int_{-1}^{1} 1 \cdot 1\,dx = [x]_{-1}^{1} = 2.
$$
单位化：
$$
u_0(x) = \frac{p_0}{\|p_0\|} = \frac{1}{\sqrt{2}}.
$$

**第二步：处理 $p_1(x) = x$**

计算与 $u_0$ 的内积：
$$
\langle p_1, u_0 \rangle = \int_{-1}^{1} x \cdot \frac{1}{\sqrt{2}}\,dx = \frac{1}{\sqrt{2}} \cdot \frac{x^2}{2}\Big|_{-1}^{1} = \frac{1}{\sqrt{2}} \cdot \frac{1-1}{2} = 0.
$$

由于 $\langle p_1, u_0 \rangle = 0$，说明 $x$ 已经与 $u_0$ 正交（奇函数在对称区间积分为零）。

计算范数：
$$
\|p_1\|^2 = \int_{-1}^{1} x^2\,dx = \frac{x^3}{3}\Big|_{-1}^{1} = \frac{1}{3} - \left(-\frac{1}{3}\right) = \frac{2}{3}.
$$
单位化：
$$
u_1(x) = \frac{p_1}{\|p_1\|} = \frac{x}{\sqrt{2/3}} = \sqrt{\frac{3}{2}}\,x.
$$

**第三步：处理 $p_2(x) = x^2$**

计算与 $u_0$ 的内积：
$$
\langle p_2, u_0 \rangle = \int_{-1}^{1} x^2 \cdot \frac{1}{\sqrt{2}}\,dx = \frac{1}{\sqrt{2}} \cdot \frac{x^3}{3}\Big|_{-1}^{1} = \frac{1}{\sqrt{2}} \cdot \frac{2}{3} = \frac{\sqrt{2}}{3}.
$$

计算与 $u_1$ 的内积：
$$
\langle p_2, u_1 \rangle = \int_{-1}^{1} x^2 \cdot \sqrt{\frac{3}{2}}\,x\,dx = \sqrt{\frac{3}{2}} \int_{-1}^{1} x^3\,dx = 0 \quad \text{（奇函数对称区间积分为零）}.
$$

计算正交分量 $w_2$：
$$
w_2(x) = p_2(x) - \langle p_2, u_0 \rangle u_0(x) - \langle p_2, u_1 \rangle u_1(x) = x^2 - \frac{\sqrt{2}}{3} \cdot \frac{1}{\sqrt{2}} = x^2 - \frac{1}{3}.
$$

计算范数：
$$
\|w_2\|^2 = \int_{-1}^{1} \left(x^2 - \frac{1}{3}\right)^2 dx = \int_{-1}^{1} \left(x^4 - \frac{2}{3}x^2 + \frac{1}{9}\right) dx = \frac{2}{5} - \frac{4}{9} + \frac{2}{9} = \frac{8}{45}.
$$

单位化：
$$
u_2(x) = \frac{w_2}{\|w_2\|} = \frac{x^2 - \frac{1}{3}}{\sqrt{8/45}} = \frac{3\sqrt{5}}{2\sqrt{2}}\left(x^2 - \frac{1}{3}\right) = \frac{\sqrt{5}}{2\sqrt{2}}(3x^2 - 1).
$$

**结论**：标准正交基为：
$$
u_0(x) = \frac{1}{\sqrt{2}}, \quad u_1(x) = \sqrt{\frac{3}{2}}\,x, \quad u_2(x) = \frac{\sqrt{5}}{2\sqrt{2}}(3x^2 - 1).
$$

> **注意**：这里得到的多项式与**勒让德多项式**（Legendre polynomials）密切相关。勒让德多项式 $P_n(x)$ 定义为：
> - $P_0(x) = 1$
> - $P_1(x) = x$
> - $P_2(x) = \frac{1}{2}(3x^2 - 1)$
>
> 它们正交但不单位化：$\int_{-1}^{1} P_m(x) P_n(x)\,dx = \frac{2}{2n+1}\delta_{mn}$。

##### 4. 挑战：格拉姆-施密特过程的适用性证明

**命题**：格拉姆-施密特过程对线性无关集总是有效，但如果集合线性相关则会失败。

**证明：**

**（第一部分）线性无关集 $\Rightarrow$ 过程成功**

设 $\{v_1, v_2, \ldots, v_n\}$ 线性无关。

使用数学归纳法证明在每一步 $k$，$w_k \neq 0$，从而可以单位化。

- **基础步骤 ($k=1$)**：$w_1 = v_1$。由于 $v_1 \neq 0$（线性无关集不含零向量），故 $\|w_1\| > 0$，可单位化。

- **归纳假设**：假设前 $k-1$ 步都成功，得到正交向量组 $\{u_1, \ldots, u_{k-1}\}$。

- **归纳步骤**：第 $k$ 步，设 $w_k = v_k - \sum_{j=1}^{k-1} \langle v_k, u_j \rangle u_j$。

  假设 $w_k = 0$，则：
  $$
  v_k = \sum_{j=1}^{k-1} \langle v_k, u_j \rangle u_j.
  $$
  这意味着 $v_k$ 可以表示为 $\{u_1, \ldots, u_{k-1}\}$ 的线性组合。

  根据归纳步骤，$\text{span}\{u_1, \ldots, u_{k-1}\} = \text{span}\{v_1, \ldots, v_{k-1}\}$。

  因此 $v_k \in \text{span}\{v_1, \ldots, v_{k-1}\}$，这与 $\{v_1, \ldots, v_n\}$ 线性无关矛盾！

  所以 $w_k \neq 0$，过程在第 $k$ 步也成功。

由归纳法，过程对所有步骤都成功。

**（第二部分）线性相关集 $\Rightarrow$ 过程失败**

设 $\{v_1, v_2, \ldots, v_n\}$ 线性相关，则存在不全为零的标量 $c_1, \ldots, c_n$ 使得：
$$
c_1 v_1 + c_2 v_2 + \cdots + c_n v_n = 0.
$$

设 $k$ 是最小的下标使得 $v_k$ 可以表示为 $\{v_1, \ldots, v_{k-1}\}$ 的线性组合。

在前 $k-1$ 步，过程正常运行（因为 $\{v_1, \ldots, v_{k-1}\}$ 线性无关）。

在第 $k$ 步：
$$
w_k = v_k - \sum_{j=1}^{k-1} \langle v_k, u_j \rangle u_j.
$$

由于 $v_k \in \text{span}\{v_1, \ldots, v_{k-1}\} = \text{span}\{u_1, \ldots, u_{k-1}\}$，向量 $v_k$ 已经完全在已构造的正交基的张成空间中。

根据正交分解定理，$v_k$ 在 $\text{span}\{u_1, \ldots, u_{k-1}\}$ 上的投影就是 $v_k$ 本身：
$$
v_k = \sum_{j=1}^{k-1} \langle v_k, u_j \rangle u_j.
$$

因此：
$$
w_k = v_k - v_k = 0.
$$

此时 $\|w_k\| = 0$，无法单位化，过程失败。

**结论**：
- 线性无关 $\Rightarrow$ 每步 $w_k \neq 0$ $\Rightarrow$ 过程成功
- 线性相关 $\Rightarrow$ 存在某步 $w_k = 0$ $\Rightarrow$ 过程失败

> **实际应用中的处理**：在数值计算中，如果检测到 $\|w_k\| \approx 0$（小于某个阈值），说明该向量与之前的向量线性相关。通常会跳过该向量，继续处理下一个。这样可以从相关集中提取最大线性无关子集。