import cv2
import numpy as np


def average_filter(image):
    mask = np.ones((3, 3), dtype=float) / 9

    img_new = np.zeros_like(image)

    for y in range(1, image.shape[0] - 1):
        for x in range(1, image.shape[1] - 1):
            img_new[y, x] = np.sum(image[y-1:y+2, x-1:x+2] * mask)

    return img_new.astype(np.uint8)

def weighted_averaging(image):
    kernel = (
        np.array([[1, 2, 1], [2, 4, 2], [1, 2, 1]], dtype=np.float32) / 16
    )
    return cv2.filter2D(image, -1, kernel)

def median_filter(image, ksize=3):
    m, n = image.shape

    img_new1 = np.zeros([m, n])
    pad = ksize // 2
    for i in range(pad, m-pad):
        for j in range(pad, n-pad):
            temp = []
            for di in range(-pad, pad+1):
                for dj in range(-pad, pad+1):
                    temp.append(image[i+di, j+dj])
            temp = sorted(temp)
            img_new1[i, j] = temp[len(temp)//2]

    return img_new1.astype(np.uint8)
