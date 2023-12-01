import numpy as np
import cv2


def roberts(image, scale=3.0):
    roberts_x = np.array([[1, 0], [0, -1]], dtype=np.float32)
    roberts_y = np.array([[0, -1], [1, 0]], dtype=np.float32)

    roberts_x_edges = cv2.filter2D(image, -1, roberts_x)
    roberts_y_edges = cv2.filter2D(image, -1, roberts_y)

    roberts_x_edges = roberts_x_edges.astype(np.float32)
    roberts_y_edges = roberts_y_edges.astype(np.float32)

    processedImage = cv2.magnitude(roberts_x_edges, roberts_y_edges)

    processedImage *= scale

    return processedImage.astype(np.uint8)

def sobels(image):
    sobel_x = cv2.Sobel(image, cv2.CV_64F, 1, 0, ksize=3)
    sobel_y = cv2.Sobel(image, cv2.CV_64F, 0, 1, ksize=3)

    processedImage = cv2.magnitude(sobel_x, sobel_y)

    return processedImage.astype(np.uint8)

def prewitt(image):
    prewitt_kernel_x = cv2.getDerivKernels(1, 0, 3, normalize=True)
    prewitt_kernel_y = cv2.getDerivKernels(0, 1, 3, normalize=True)

    prewitt_x = cv2.filter2D(
        image, cv2.CV_64F, prewitt_kernel_x[0] * prewitt_kernel_x[1]
    )
    prewitt_y = cv2.filter2D(
        image, cv2.CV_64F, prewitt_kernel_y[0] * prewitt_kernel_y[1]
    )

    processedImage = cv2.magnitude(prewitt_x, prewitt_y)

    return processedImage.astype(np.uint8)

def laplacian(image):
    img_np = np.array(image)
    if len(img_np.shape) == 3:
        img_np = cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY)
    laplacian = cv2.Laplacian(img_np, cv2.CV_64F)
    return np.uint8(np.abs(laplacian))

def canny(image):
    img_np = np.array(image)
    if len(img_np.shape) == 3:
        img_np = cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY)
    blurred_img = cv2.GaussianBlur(img_np, (5, 5), 0)
    edges = cv2.Canny(blurred_img, 50, 150)
    return edges

def otsu_threshold(image):
    img_np = np.array(image)
    if len(img_np.shape) == 3:
        img_np = cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY)
    _, otsu_thresholded = cv2.threshold(img_np, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return otsu_thresholded
