import cv2
import numpy as np
from collections import defaultdict
from heapq import heappush, heappop, heapify


def lzw_encode(input_string):
    dictionary = {bytes([i]): i for i in range(256)}
    result = []
    s = input_string[0:1]
    for i in range(1, len(input_string)):
        c = input_string[i:i+1]
        if s + c in dictionary:
            s = s + c
        else:
            result.append(dictionary[s])
            dictionary[s + c] = len(dictionary)
            s = c
    result.append(dictionary[s])
    return result

def rlc_encode(input_string):
    result = []
    i = 0
    while i < len(input_string):
        count = 1
        while i + 1 < len(input_string) and input_string[i] == input_string[i+1]:
            i += 1
            count += 1
        result.append((input_string[i], count))
        i += 1
    return result

def huffman_encode(input_string):
    frequency = defaultdict(int)
    for symbol in input_string:
        frequency[symbol] += 1

    heap = [[weight, [symbol, ""]] for symbol, weight in frequency.items()]
    heapify(heap)

    while len(heap) > 1:
        lo = heappop(heap)
        hi = heappop(heap)
        for pair in lo[1:]:
            pair[1] = '0' + pair[1]
        for pair in hi[1:]:
            pair[1] = '1' + pair[1]
        heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])

    huff = sorted(heappop(heap)[1:], key=lambda p: (len(p[-1]), p))
    huffman_dict = {a[0]: a[1] for a in huff}

    return ''.join(huffman_dict[i] for i in input_string)