### 99. 数值线性代数核心要点（浮点数、BLAS/LAPACK）

理论上的线性代数是精确的：数字表现为实数，运算是确定性的，结果是精准的。但在实际应用中，计算是在计算机上进行的，数字以有限精度表示，算法必须在速度、准确性和稳定性之间取得平衡。这种交叉领域——数值线性代数——使得线性代数能够在现代规模下得以应用。

#### 浮点数表示

实数无法在数字机器上精确存储。相反，它们使用 IEEE 754 浮点数标准进行近似。

- 浮点数的存储形式为：

  $$
  x = \pm (1.m_1 m_2 m_3 \dots) \times 2^e
  $$

  其中 $m$ 是尾数（mantissa），$e$ 是指数（exponent）。

- 单精度（float32）：32 位 → 约 7 位十进制精度。
- 双精度（float64）：64 位 → 约 16 位十进制精度。
- 机器 epsilon ($\epsilon$)：1 与下一个可表示数之间的最小间隙。对于双精度，$\epsilon \approx 2.22 \times 10^{-16}$。

**注意**：这意味着像几乎相等的数字相减这样的操作会导致**灾难性抵消（catastrophic cancellation）**，有效数字会消失。

```python
import numpy as np
import sys

# 查看机器精度
print(f"Float32 epsilon: {np.finfo(np.float32).eps}")
print(f"Float64 epsilon: {np.finfo(np.float64).eps}")

# 演示灾难性抵消
a = np.float64(1.0000000000000001)
b = np.float64(1.0)
print(f"1.000...01 - 1.0 = {a - b}") # 结果可能为 0 或精度丢失
```

#### 问题的条件数

一个线性代数问题可能在数学上是良态的，但在数值上仍然难以处理。

- 矩阵 $A$ 的条件数定义为：

  $$
  \kappa(A) = \|A\| \cdot \|A^{-1}\|.
  $$
- 如果 $\kappa(A)$ 很大，输入中的微小误差会导致输出中的巨大误差。
- 示例：求解 $Ax = b$。对于病态矩阵 $A$，即使算法完美，计算出的解也可能不稳定。

**几何直觉**：病态矩阵会不均匀地拉伸向量，因此方向上的微小扰动在逆运算下会被放大。

```python
# 计算条件数示例
A = np.array([[1, 1], [1, 1.0001]])
cond_number = np.linalg.cond(A)
print(f"矩阵条件数：{cond_number}")
# 如果条件数远大于 1，说明矩阵接近奇异
```

**提示**：在实际计算中，如果条件数超过 $1/\epsilon$，结果通常不可信。

#### 算法的稳定性

- 如果一个算法能控制有限精度带来的误差增长，则称其为数值稳定的。
- 带有部分选主元（partial pivoting）的高斯消元法是稳定的；如果不选主元，可能会灾难性地失败。
- 正交分解（QR, SVD）通常比消元法更稳定。

数值分析的重点是设计算法，保证精度在机器 epsilon 的几倍范围内。

#### 直接法与迭代法

1. **直接法**：在有限步内求解（例如高斯消元、LU 分解、正定系统的 Cholesky 分解）。
   - 适用于小型/中型问题。
   - 复杂度约为 $O(n^3)$。

2. **迭代法**：生成 successive 近似解（例如 Jacobi、Gauss–Seidel、共轭梯度法）。
   - 适用于非常大、稀疏的系统。
   - 每次迭代复杂度约为 $O(n^2)$ 或更低，通常利用稀疏性。

#### 计算中的矩阵分解

许多算法依赖于先分解矩阵，然后重复使用分解结果：

- **LU 分解**：适用于求解多个右侧向量。
- **QR 分解**：求解最小二乘问题的稳定方法。
- **SVD**：病态问题的黄金标准，尽管计算成本较高。

这些分解将重复操作转化为结构化、缓存友好的步骤。

#### 稀疏与稠密计算

- **稠密矩阵**：大多数元素非零。使用 dense 线性代数包，如 BLAS 和 LAPACK。
- **稀疏矩阵**：大多数元素为零。仅存储非零元素，使用专用算法以避免浪费计算。

大规模问题（例如有限元模拟、Web 图）之所以可行，仅归功于稀疏方法。

#### BLAS 和 LAPACK：标准库

- **BLAS (Basic Linear Algebra Subprograms)**：定义了向量和矩阵操作的内核（点积、矩阵 - 向量、矩阵 - 矩阵乘法）。优化的 BLAS 实现利用缓存、SIMD 和多核并行。
- **LAPACK (Linear Algebra PACKage)**：基于 BLAS 构建，提供求解系统、特征值问题、SVD 等的算法。LAPACK 是许多科学计算环境（MATLAB、NumPy、Julia）的骨干。
- **MKL, OpenBLAS, cuBLAS**：针对 Intel CPU、开源系统或 NVIDIA GPU 优化的供应商特定实现。

这些库决定了代码是运行几分钟还是几毫秒。

#### 浮点数陷阱

1. **累积舍入误差**：对量级差异巨大的数字求和可能会丢弃小贡献。
2. **正交性丢失**：重复的 Gram–Schmidt 正交化如果不重新正交化，数值上可能会漂移。
3. **溢出/下溢**：极大/极小的数字超出可表示范围。
4. **NaNs 和 Infs**：除以零或无效操作会传播错误。

**缓解措施**：使用数值稳定的算法，缩放输入，并检查条件数。

#### 并行与 GPU 计算

现代数值线性代数依赖于并行性：

- GPU 通过数千个核心加速稠密线性代数（cuBLAS, cuSOLVER）。
- 分布式库（ScaLAPACK, PETSc, Trilinos）允许在集群上求解数十亿未知数的问题。
- **混合精度方法**：用 float32 甚至 float16 计算，然后用 float64 修正，平衡速度和精度。

#### 现实世界的应用

- **工程模拟**：结构力学、流体动力学依赖稀疏求解器。
- **机器学习**：训练深度网络依赖优化的 BLAS 进行矩阵乘法。
- **金融**：风险模型通过分解协方差矩阵求解巨大的回归问题。
- **大数据**：降维（PCA, SVD）需要大规模、稳定的算法。

#### 为什么这很重要

实践中的线性代数不仅仅是关于定理：它是关于将抽象模型转化为在不完美硬件上可靠运行的计算。数值线性代数提供了必要的工具包——浮点数理解、条件数分析、稳定算法和优化库——确保结果既快速又可信。

#### 动手试一试

1. 计算接近奇异矩阵的条件数（例如 $\begin{bmatrix} 1 & 1 \\ 1 & 1.0001 \end{bmatrix}$）并求解 $Ax=b$。比较单精度与双精度的结果。

   **参考答案与解析：**

   ```python
   import numpy as np

   # 定义矩阵 A 和向量 b
   A = np.array([[1, 1], [1, 1.0001]], dtype=np.float64)
   b = np.array([2, 2.0001], dtype=np.float64)

   # 1. 计算条件数
   cond = np.linalg.cond(A)
   print(f"条件数 kappa(A): {cond}")
   # 输出应显示一个较大的数，表明矩阵病态

   # 2. 双精度求解
   x_double = np.linalg.solve(A, b)
   print(f"双精度解：{x_double}")

   # 3. 单精度求解
   A_single = A.astype(np.float32)
   b_single = b.astype(np.float32)
   x_single = np.linalg.solve(A_single, b_single)
   print(f"单精度解：{x_single}")

   # 4. 比较误差
   # 理论解应接近 [1, 1]
   print(f"双精度误差：{np.linalg.norm(x_double - np.array([1, 1]))}")
   print(f"单精度误差：{np.linalg.norm(x_single - np.array([1, 1], dtype=np.float32))}")
   ```
   **解析**：你会观察到单精度下的误差显著大于双精度。这是因为病态矩阵放大了单精度中较大的机器 epsilon 带来的舍入误差。

2. 实现带选主元和不带选主元的高斯消元法。比较病态矩阵的误差。

   **参考答案与解析：**

   ```python
   def gaussian_elimination_no_pivot(A, b):
       n = len(b)
       A = A.astype(float)
       b = b.astype(float)
       for i in range(n):
           for j in range(i+1, n):
               if A[i, i] == 0: continue # 避免除零，但不选主元
               factor = A[j, i] / A[i, i]
               A[j, i:] -= factor * A[i, i:]
               b[j] -= factor * b[i]
       x = np.zeros(n)
       for i in range(n-1, -1, -1):
           x[i] = (b[i] - np.dot(A[i, i+1:], x[i+1:])) / A[i, i]
       return x

   def gaussian_elimination_pivot(A, b):
       n = len(b)
       A = A.astype(float)
       b = b.astype(float)
       for i in range(n):
           # 部分选主元
           max_row = np.argmax(np.abs(A[i:, i])) + i
           A[[i, max_row]] = A[[max_row, i]]
           b[[i, max_row]] = b[[max_row, i]]
           
           for j in range(i+1, n):
               factor = A[j, i] / A[i, i]
               A[j, i:] -= factor * A[i, i:]
               b[j] -= factor * b[i]
       x = np.zeros(n)
       for i in range(n-1, -1, -1):
           x[i] = (b[i] - np.dot(A[i, i+1:], x[i+1:])) / A[i, i]
       return x

   # 测试一个需要选主元的矩阵
   A = np.array([[1e-20, 1], [1, 1]], dtype=float)
   b = np.array([1, 2], dtype=float)
   
   x_no_pivot = gaussian_elimination_no_pivot(A.copy(), b.copy())
   x_pivot = gaussian_elimination_pivot(A.copy(), b.copy())
   
   print(f"无选主元解：{x_no_pivot}")
   print(f"有选主元解：{x_pivot}")
   print(f"真实解（numpy）：{np.linalg.solve(A, b)}")
   ```
   **解析**：在不选主元的情况下，由于小主元 $1e-20$ 导致的大数吃小数现象，结果会完全错误。选主元通过交换行避免了这种情况，保证了数值稳定性。

3. 使用带有 OpenBLAS 的 NumPy 计时大型矩阵乘法；与 naive Python 实现进行比较。

   **参考答案与解析：**

   ```python
   import numpy as np
   import time

   n = 1000
   A = np.random.rand(n, n)
   B = np.random.rand(n, n)

   # 1. NumPy (底层调用 BLAS)
   start = time.time()
   C_np = np.dot(A, B)
   time_np = time.time() - start
   print(f"NumPy (BLAS) 耗时：{time_np:.5f} 秒")

   # 2. Naive Python 实现
   C_py = np.zeros((n, n))
   start = time.time()
   for i in range(n):
       for j in range(n):
           sum_val = 0
           for k in range(n):
               sum_val += A[i, k] * B[k, j]
           C_py[i, j] = sum_val
   time_py = time.time() - start
   print(f"Naive Python 耗时：{time_py:.5f} 秒")

   print(f"加速比：{time_py / time_np:.2f} 倍")
   ```
   **解析**：NumPy 的矩阵乘法底层调用的是高度优化的 C/Fortran 库（如 OpenBLAS 或 MKL），利用了 CPU 缓存和 SIMD 指令。纯 Python 循环由于解释器开销和缺乏底层优化，速度会慢数百倍甚至上千倍。

4. 探索迭代求解器：为稀疏对称正定系统实现共轭梯度法（Conjugate Gradient）。

   **参考答案与解析：**

   ```python
   import numpy as np
   from scipy.sparse import diags
   from scipy.sparse.linalg import cg

   # 构建一个稀疏对称正定矩阵 (三对角矩阵)
   n = 1000
   diagonals = [2 * np.ones(n), -1 * np.ones(n-1), -1 * np.ones(n-1)]
   A_sparse = diags(diagonals, [0, -1, 1]).tocsc()
   b = np.ones(n)

   # 1. 使用 scipy 内置 CG
   x_scipy, info = cg(A_sparse, b)
   print(f"Scipy CG 收敛状态：{info}") # 0 表示收敛
   print(f"残差范数：{np.linalg.norm(A_sparse.dot(x_scipy) - b)}")

   # 2. 简易 CG 实现逻辑示意
   def simple_cg(A, b, max_iter=100):
       x = np.zeros_like(b)
       r = b - A.dot(x)
       p = r.copy()
       for i in range(max_iter):
           Ap = A.dot(p)
           alpha = np.dot(r, r) / np.dot(p, Ap)
           x += alpha * p
           r_new = r - alpha * Ap
           if np.linalg.norm(r_new) < 1e-6:
               break
           beta = np.dot(r_new, r_new) / np.dot(r, r)
           p = r_new + beta * p
           r = r_new
       return x

   x_custom = simple_cg(A_sparse.toarray(), b) # 注意：这里转为稠密仅为了演示逻辑
   print(f"自定义 CG 残差：{np.linalg.norm(A_sparse.dot(x_custom) - b)}")
   ```
   **解析**：共轭梯度法不需要显式计算逆矩阵，每次迭代主要涉及矩阵 - 向量乘法。对于稀疏矩阵，这非常高效。`scipy.sparse.linalg.cg` 是生产环境中的首选，因为它处理了预处理和复杂的收敛判断。

数值线性代数是数学优雅与计算现实之间的桥梁。它教会我们，在计算机上求解方程不仅仅关乎方程本身——还关乎赋予它们生命的算法、表示和硬件。