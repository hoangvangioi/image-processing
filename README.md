# 1. Âm bản
Công thức `s = T(r) = Intensivemax - r` mô tả quá trình biến đổi ảnh âm bản trong xử lý ảnh số. Trong công thức này:
- `s` là giá trị mức xám mới sau khi biến đổi.
- `T(r)` là hàm biến đổi mức xám.
- `Intensivemax` là giá trị mức xám tối đa, thường là 255 cho ảnh xám 8-bit.
- `r` là giá trị mức xám ban đầu của pixel.

# 2. Thresholding
```python
if src[i] >= T:
    dest[i] = MAXVAL
else:
    dest[i] = 0
```
- `src[i]` là giá trị mức xám ban đầu của pixel.
- `T` là giá trị ngưỡng.
- `MAXVAL` là giá trị mức xám tối đa, thường là 255 cho ảnh xám 8-bit.
- `dest[i]` là giá trị mức xám mới sau khi áp dụng ngưỡng.

# 3. Logarit
$$s = c \cdot \log(1 + r)$$
- `s` là giá trị pixel đầu ra
- `r` là giá trị pixel gốc
- `c` là hằng số tỷ lệ

# 4. Exponential
$$s = c \cdot r^\gamma$$
- `s` là giá trị pixel đầu ra
- `r` là giá trị pixel gốc
- `c` là hằng số tỷ lệ
- `gamma` là hệ số gamma

# 5. Histogram Equalization
- 

# 6. Averaging Filter
$$g(x, y) = \frac{1}{mn} \sum_{i=-a}^{a} \sum_{j=-b}^{b} f(x+i, y+j)$$

- `g(x, y)` là giá trị pixel tại vị trí `(x, y)` sau khi áp dụng bộ lọc.
- `f(x+i, y+j)` là giá trị pixel tại vị trí `(x+i, y+j)` trong hình ảnh gốc.
- `m` và `n` là kích thước của mặt nạ bộ lọc (trong trường hợp của bạn, cả `m` và `n` đều bằng 3).
- `a` và `b` là nửa kích thước của mặt nạ bộ lọc (trong trường hợp của bạn, cả `a` và `b` đều bằng 1).
- Tổng được tính trên tất cả các pixel trong vùng lân cận của pixel `(x, y)` được xác định bởi mặt nạ bộ lọc.

# 7. Weighted Averaging
Bộ lọc Gaussian hoạt động dựa trên công thức sau:

$$g(x, y) = \frac{1}{\sum_{i=-a}^{a} \sum_{j=-b}^{b} w_{i,j}} \sum_{i=-a}^{a} \sum_{j=-b}^{b} w_{i,j} \cdot f(x+i, y+j)$$

- `g(x, y)` là giá trị pixel tại vị trí `(x, y)` sau khi áp dụng bộ lọc.
- `f(x+i, y+j)` là giá trị pixel tại vị trí `(x+i, y+j)` trong hình ảnh gốc.
- `w_{i,j}` là trọng số của pixel tại vị trí `(i, j)` trong mặt nạ bộ lọc.
- `a` và `b` là nửa kích thước của mặt nạ bộ lọc.
- Tổng được tính trên tất cả các pixel trong vùng lân cận của pixel `(x, y)` được xác định bởi mặt nạ bộ lọc.

# 8. Median Filter
- 

# 9. Roberts Operator
$$g(x, y) = \sqrt{(f * G_x)^2 + (f * G_y)^2}$$

- `g(x, y)` là giá trị pixel tại vị trí `(x, y)` sau khi áp dụng toán tử Roberts.
- `f * G_x` và `f * G_y` là kết quả của việc lọc hình ảnh với mặt nạ `G_x` và `G_y`.

# 10. Sobels Operator
$$g(x, y) = \sqrt{(f * G_x)^2 + (f * G_y)^2}$$

- `g(x, y)` là giá trị pixel tại vị trí `(x, y)` sau khi áp dụng toán tử Sobel.
- `f * G_x` và `f * G_y` là kết quả của việc lọc hình ảnh với mặt nạ `G_x` và `G_y`.

# 11. Laplacian Operator
$$g(x, y) = f * L$$

- `g(x, y)` là giá trị pixel tại vị trí `(x, y)` sau khi áp dụng toán tử Laplacian.
- `f * L` là kết quả của việc lọc hình ảnh với mặt nạ `L`.

# 12. Prewitt Operator
$$g(x, y) = \sqrt{(f * G_x)^2 + (f * G_y)^2}$$

- `g(x, y)` là giá trị pixel tại vị trí `(x, y)` sau khi áp dụng toán tử Prewitt.
- `f * G_x` và `f * G_y` là kết quả của việc lọc hình ảnh với mặt nạ `G_x` và `G_y`.

# 13. Canny Operator
- 
# 14. OTSU Algorithm
$$\sigma^2(t) = \omega_{bg}(t)\sigma^2_{bg}(t) + \omega_{fg}(t)\sigma^2_{fg}(t)$$

- $\omega_{bg}(t)$ và $\omega_{fg}(t)$ là xác suất số lượng pixel cho mỗi lớp tại ngưỡng $t$.
- $\sigma^2_{bg}(t)$ và $\sigma^2_{fg}(t)$ là phương sai của giá trị màu sắc cho mỗi lớp tại ngưỡng $t$.

# 15. Run-Length Coding (RLC) Algorithm
- 
# 16. Lempel-Ziv-Welch (LZW) Algorithm
- 
# 17. Huffman Coding Algorithm
- 
# 18. Erosion Image
- 
# 19. Dilation Image
- 
# 20. Closing Image
- 
# 21. Opening Image
- 