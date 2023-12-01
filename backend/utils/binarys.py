import cv2
import numpy as np


def erosion_image(image, ksize=3):
    img_np = np.array(image)

    if len(img_np.shape) == 3:
        img_np = cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY)

    _, binary_image = cv2.threshold(img_np, 127, 255, cv2.THRESH_BINARY)

    kernel = np.ones((ksize, ksize), np.uint8)

    return cv2.erode(binary_image, kernel, iterations=1)

def dilation_image(image, ksize=3):
    img_np = np.array(image)

    if len(img_np.shape) == 3:
        img_np = cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY)

    _, binary_image = cv2.threshold(img_np, 127, 255, cv2.THRESH_BINARY)

    kernel = np.ones((ksize, ksize), np.uint8)

    return cv2.dilate(binary_image, kernel, iterations=1)

def closing_image(image, ksize=3, threshold=127):
    img_np = np.array(image)

    if len(img_np.shape) == 3:
        img_np = cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY)

    _, binary_image = cv2.threshold(img_np, threshold, 255, cv2.THRESH_BINARY)

    kernel = np.ones((ksize, ksize), np.uint8)

    return cv2.morphologyEx(binary_image, cv2.MORPH_CLOSE, kernel)

def opening_image(image, ksize=3, threshold=127):
    img_np = np.array(image)

    if len(img_np.shape) == 3:
        img_np = cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY)

    _, binary_image = cv2.threshold(img_np, threshold, 255, cv2.THRESH_BINARY)

    kernel = np.ones((ksize, ksize), np.uint8)

    return cv2.morphologyEx(binary_image, cv2.MORPH_OPEN, kernel)
