### 71. 内积：超越点积的概念

点积（Dot Product）是大多数学生接触到的第一个内积概念。在 $\mathbb{R}^n$ 中，它的定义为

$$
\langle x, y \rangle = x \cdot y = \sum_{i=1}^n x_i y_i,
$$

它提供了一种测量长度、角度和正交性的方法。但点积只是一个更广泛概念的特例。**内积（Inner Product）** 推广了点积，将其几何直觉扩展到了更抽象的向量空间中。

#### 内积的定义

实向量空间 $V$ 上的内积是一个函数

$$
\langle \cdot, \cdot \rangle : V \times V \to \mathbb{R}
$$

它对于所有 $x,y,z \in V$ 和标量 $\alpha \in \mathbb{R}$ 满足以下公理：

1.  **正定性 (Positivity):**
    $\langle x, x \rangle \geq 0$, 且 $\langle x, x \rangle = 0 \iff x=0$.
2.  **对称性 (Symmetry):**
    $\langle x, y \rangle = \langle y, x \rangle$.
3.  **第一变元线性性 (Linearity in the first argument):**
    $\langle \alpha x + y, z \rangle = \alpha \langle x, z \rangle + \langle y, z \rangle$.

> **注意**：在复向量空间中，对称性条件变为**共轭对称性**：$\langle x, y \rangle = \overline{\langle y, x \rangle}$。这是为了保证自内积 $\langle x, x \rangle$ 是实数且非负。

#### 由内积导出的范数与角度

一旦定义了内积，我们立刻可以得到以下几何概念：

-   **范数（长度）:**
    $\|x\| = \sqrt{\langle x, x \rangle}$.

-   **距离:**
    $d(x,y) = \|x-y\|$.

-   **向量间的夹角:**
    $\cos \theta = \frac{\langle x, y \rangle}{\|x\|\|y\|}$.

因此，内积将 $\mathbb{R}^n$ 中熟悉的几何结构推广到了更广泛的语境中。

#### 超越点积的实例

1.  **加权内积 (在 $\mathbb{R}^n$ 中):**

    $$
    \langle x, y \rangle_W = x^T W y,
    $$

    其中 $W$ 是一个对称正定矩阵。

    -   在这里，长度和角度取决于 $W$ 中编码的权重。
    -   当某些维度比其他维度更重要时非常有用（例如加权最小二乘法）。

    ```python
    import numpy as np

    # 数值演示：加权内积
    x = np.array([1, 2])
    y = np.array([3, 4])
    W = np.array([[2, 0], [0, 1]])  # 第一个维度权重为 2，第二个为 1

    # 标准点积
    dot_product = np.dot(x, y)
    
    # 加权内积
    weighted_inner_product = x.T @ W @ y

    print(f"标准点积：{dot_product}")
    print(f"加权内积：{weighted_inner_product}")
    # 输出显示加权后第一个分量的贡献变大
    ```

2.  **函数空间 (连续内积):**
    在 $V = C[a,b]$ 上，即 $[a,b]$ 上的连续函数空间：

    $$
    \langle f, g \rangle = \int_a^b f(t) g(t) \, dt.
    $$

    -   长度：$\|f\| = \sqrt{\int_a^b f(t)^2 dt}$.
    -   正交性：如果积分乘积为零，则 $f$ 和 $g$ 正交。
    -   这种内积是傅里叶级数的基础。

    ```python
    # 数值演示：函数内积 (使用数值积分)
    t = np.linspace(0, np.pi, 1000)
    f = np.sin(t)
    g = np.cos(t)
    
    # 使用梯形法则近似积分
    inner_product_func = np.trapz(f * g, t)
    
    print(f"sin 和 cos 在 [0, pi] 上的内积近似值：{inner_product_func}")
    # 理论上应接近 0，表示正交
    ```

3.  **复内积 (在 $\mathbb{C}^n$ 中):**

    $$
    \langle x, y \rangle = \sum_{i=1}^n x_i \overline{y_i}.
    $$

    -   共轭运算确保了正定性。
    -   这对于量子力学至关重要，其中状态是复希尔伯特空间中的向量。

4.  **多项式空间:**
    对于 $[-1,1]$ 上的多项式：

    $$
    \langle p, q \rangle = \int_{-1}^1 p(x) q(x) \, dx.
    $$

    -    dẫn 致正交多项式（勒让德多项式、切比雪夫多项式），这是逼近论的基础。

#### 几何解释

-   内积重塑了几何结构。我们不再使用欧几里得度量来测量长度和角度，而是使用由所选内积诱导的度量。
-   不同的内积在同一向量空间上创造了不同的几何结构。

> **提示**：想象一下，加权内积会将单位圆扭曲成椭圆，从而改变哪些向量被视为“正交”。

#### 日常类比

-   **加权投票**：在选举中，某些选票权重更大；在加权内积中，向量的某些维度权重更大。
-   **声音与音乐**：两个信号的内积测量了一个信号与另一个信号的共振程度。
-   **搜索引擎**：词频向量之间的内积测量文档相似度。不同的加权方案（如 TF-IDF）对应于不同的内积。

#### 应用领域

1.  **信号处理**：信号之间的相关性是一种内积。正交性意味着两个信号携带独立的信息。
2.  **傅里叶分析**：傅里叶系数来自与正弦和余弦函数的内积。
3.  **机器学习**：核方法将内积推广到无限维空间。
4.  **量子力学**：概率是复内积模长的平方。
5.  **优化**：加权最小二乘问题使用加权内积。

#### 为什么这很重要

-   内积将几何结构推广到新的语境：加权空间、函数、多项式、量子态。
-   它们为在远超 $\mathbb{R}^n$ 的空间中定义正交性、投影和标准正交基提供了基础。
-   它们统一了纯数学、物理学、工程学和计算机科学中的思想。

#### 动手试一试

1.  证明如果 $W$ 是正定矩阵，则加权内积 $\langle x, y \rangle_W = x^T W y$ 满足内积公理。
2.  计算 $\langle f, g \rangle = \int_0^\pi \sin(t)\cos(t)\, dt$。$f=\sin$ 和 $g=\cos$ 正交吗？
3.  在 $\mathbb{C}^2$ 中，验证 $\langle (1,i), (i,1) \rangle = 0$。这在几何上意味着什么？
4.  **挑战**：证明每个内积都诱导一个范数，并且不同的内积可以在同一空间上导致不同的几何结构。

#### 练习题详细解答

**1. 加权内积公理验证**

**解答：**
我们需要验证三个公理，已知 $W$ 是对称正定矩阵。
-   **正定性**：
    $\langle x, x \rangle_W = x^T W x$。
    因为 $W$ 是正定矩阵，根据定义，对于任意非零向量 $x$，都有 $x^T W x > 0$；且当且仅当 $x=0$ 时，$x^T W x = 0$。
    故 $\langle x, x \rangle_W \geq 0$ 且 $\langle x, x \rangle_W = 0 \iff x=0$ 成立。
-   **对称性**：
    $\langle x, y \rangle_W = x^T W y$。
    这是一个标量，标量的转置等于其自身：$(x^T W y)^T = y^T W^T x$。
    因为 $W$ 是对称矩阵，即 $W^T = W$，所以 $y^T W^T x = y^T W x = \langle y, x \rangle_W$。
    故对称性成立。
-   **线性性**：
    $\langle \alpha x + y, z \rangle_W = (\alpha x + y)^T W z = (\alpha x^T + y^T) W z = \alpha x^T W z + y^T W z = \alpha \langle x, z \rangle_W + \langle y, z \rangle_W$。
    故线性性成立。

**结论**：加权内积满足所有内积公理。

---

**2. 函数内积计算**

**解答：**
我们需要计算积分：
$$
\langle f, g \rangle = \int_0^\pi \sin(t)\cos(t)\, dt.
$$
利用三角恒等式 $\sin(t)\cos(t) = \frac{1}{2}\sin(2t)$，积分变为：
$$
\int_0^\pi \frac{1}{2}\sin(2t)\, dt = \frac{1}{2} \left[ -\frac{1}{2}\cos(2t) \right]_0^\pi
$$
$$
= -\frac{1}{4} (\cos(2\pi) - \cos(0)) = -\frac{1}{4} (1 - 1) = 0.
$$
**结论**：因为内积为 0，所以函数 $f=\sin$ 和 $g=\cos$ 在区间 $[0, \pi]$ 上是**正交**的。

---

**3. 复内积验证**

**解答：**
在 $\mathbb{C}^n$ 中，内积定义为 $\langle x, y \rangle = \sum x_i \overline{y_i}$。
设 $x = (1, i)$, $y = (i, 1)$。
$$
\langle x, y \rangle = 1 \cdot \overline{i} + i \cdot \overline{1}
$$
$$
= 1 \cdot (-i) + i \cdot 1 = -i + i = 0.
$$
**几何意义**：
这意味着在复向量空间 $\mathbb{C}^2$ 的标准内积几何下，向量 $(1, i)$ 和 $(i, 1)$ 是**正交**的（垂直的）。尽管它们在实部虚部看起来有重叠，但在复几何结构中它们相互垂直。

---

**4. 挑战题：内积诱导范数**

**解答概要：**
-   **诱导范数**：定义 $\|x\| = \sqrt{\langle x, x \rangle}$。
-   **验证范数公理**：
    1.  **非负性**：由内积的正定性直接得到 $\|x\| \geq 0$ 且 $\|x\|=0 \iff x=0$。
    2.  **齐次性**：$\|\alpha x\| = \sqrt{\langle \alpha x, \alpha x \rangle} = \sqrt{\alpha^2 \langle x, x \rangle} = |\alpha| \|x\|$。
    3.  **三角不等式**：这需要利用柯西 - 施瓦茨不等式 $|\langle x, y \rangle| \leq \|x\|\|y\|$ 来证明 $\|x+y\| \leq \|x\| + \|y\|$。
-   **不同几何结构**：
    考虑 $\mathbb{R}^2$。
    -   标准内积下，单位圆是 $x^2 + y^2 = 1$。
    -   加权内积（如 $W=\text{diag}(1, 4)$）下，单位“圆”变为 $x^2 + 4y^2 = 1$，这是一个椭圆。
    -   这就证明了不同的内积定义了不同的“长度”和“形状”，即不同的几何结构。

#### 数值实验：验证不同内积下的几何差异

```python
import numpy as np
import matplotlib.pyplot as plt

# 生成单位圆上的点 (标准内积下)
theta = np.linspace(0, 2*np.pi, 100)
x_std = np.cos(theta)
y_std = np.sin(theta)

# 定义加权矩阵 W
W = np.array([[1, 0], [0, 4]])

# 在加权内积下，"单位圆" 满足 x^T W x = 1
# 即 x^2 + 4y^2 = 1 -> x = cos(t), y = 0.5 * sin(t)
x_weighted = np.cos(theta)
y_weighted = 0.5 * np.sin(theta)

plt.figure(figsize=(6, 6))
plt.plot(x_std, y_std, label='标准内积 (圆)')
plt.plot(x_weighted, y_weighted, label='加权内积 (椭圆)', linestyle='--')
plt.axhline(0, color='black', linewidth=0.5)
plt.axvline(0, color='black', linewidth=0.5)
plt.legend()
plt.title('不同内积下的单位“圆”')
plt.grid(True)
plt.show()
```

点积只是开始。内积提供了将几何扩展到加权空间、连续函数和无限维空间的语言——改变了我们在数学和科学中测量相似度、距离和结构的方式。