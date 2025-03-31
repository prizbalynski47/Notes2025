import numpy as np
from dtaidistance import dtw

A = np.array([10,23,4,5,6,7,1,8])
B = np.array([10,10,23,5,5,6,3,7])

eucDistance = np.linalg.norm(A - B)
print(f"Euclidean distance: {eucDistance}")

manDistance = np.sum(np.abs(A - B))
print(f"Manhattan distance: {manDistance}")

l3Distance = np.power(np.sum(np.abs(A - B) ** 3), 1/3)
print(f"L3 norm distance: {l3Distance}")

dtwDistance = dtw.distance(A, B)
print(f"DTW distance: {dtwDistance}")