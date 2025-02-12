import pandas as pd
import matplotlib.pyplot as plt

# Load data
data = pd.read_csv("C:/Users/cvcla/Desktop/school2025/Notes2025/Assignments/HPC/timing_results.csv")

# Plot results
plt.figure(figsize=(8, 5))
plt.plot(data["Threads"], data["GlobalSumTime"], marker='o', label="Global Sum")
plt.plot(data["Threads"], data["TreeSumTime"], marker='s', label="Tree Sum")

plt.xlabel("Number of Threads")
plt.ylabel("Execution Time (seconds)")
plt.title("Histogram Computation Time vs. Threads")
plt.legend()
plt.grid(True)

# Save plot
plt.savefig("C:/Users/cvcla/Desktop/school2025/Notes2025/Assignments/HPC/histogram_timing_plot.png")
plt.show()