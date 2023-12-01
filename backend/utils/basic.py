import numpy as np


def negative(image):
    return 255 - image

def thresholding(image, threshold=127):
    image[image < threshold] = 0
    image[image >= threshold] = 255
    return image

def logarithmic(image, threshold=127):
    c = threshold / (np.log(1 + np.max(image)))
    log_transformed = c * np.log(1 + image)
    return np.array(log_transformed, dtype=np.uint8)

def exponential(image, gamma=3):
    return np.array(255*(image / 255) ** gamma, dtype='uint8')

def histogram_equalization(image):
    histogram, _ = np.histogram(image.flatten(), bins=256, range=(0, 256))

    cdf = histogram.cumsum()

    cdf_masked = np.ma.masked_equal(cdf, 0)
    cdf_masked = (cdf_masked - cdf_masked.min()) * 255 / (cdf_masked.max() - cdf_masked.min())
    cdf = np.ma.filled(cdf_masked, 0).astype('uint8')

    return cdf[image]