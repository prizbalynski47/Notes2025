NUM_CORES = 3
NUM_PROCESSES = 15

processes = []
for i in range(1, NUM_PROCESSES + 1):
    processes.append(i)

coreTimes = [0] * NUM_CORES
coreIndeces = []
for i in range(0,NUM_CORES):
    coreIndeces.append([])

core = 0
increment = 1
for i in range(len(processes)):
    
    coreTimes[core] += processes[len(processes) - (i + 1)]
    coreIndeces[core].append(len(processes) - (i + 1))

    core += increment
    if core == NUM_CORES:
        increment = -1
        core = NUM_CORES - 1
    if core == -1:
        increment = 1
        core = 0


print("c1: ", coreTimes[0])
print("c2: ", coreTimes[1])
print("c3: ", coreTimes[2])

print("c1 indeces: ", coreIndeces[0])
print("c2 indeces: ", coreIndeces[1])
print("c3 indeces: ", coreIndeces[2])

