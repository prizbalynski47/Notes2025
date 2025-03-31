import re

with open(r"C:\Users\cvcla\Desktop\school2025\Notes2025\Assignments\DatabaseSystems\InfoRetrieval\Computer Science _ USU.htm") as file0:
    text0 = file0.read().lower()

words = []

words.append([w for w in re.split(r'[\s<>,.;]+', text0) if w])

print(len(words[0]))

with open(r"C:\Users\cvcla\Desktop\school2025\Notes2025\Assignments\DatabaseSystems\InfoRetrieval\Research_Interests_CS_USU.htm") as file1:
    text1 = file1.read().lower()

words.append([w for w in re.split(r'[\s<>,.;]+', text1) if w])

print(len(words[1]))

with open(r"C:\Users\cvcla\Desktop\school2025\Notes2025\Assignments\DatabaseSystems\InfoRetrieval\Graduate_Programs_CS_USU.htm") as file2:
    text2 = file2.read().lower()

words.append([w for w in re.split(r'[\s<>,.;]+', text2) if w])

print(len(words[2]))

with open(r"C:\Users\cvcla\Desktop\school2025\Notes2025\Assignments\DatabaseSystems\InfoRetrieval\History_Computer Science_USU.htm") as file3:
    text3 = file3.read().lower()

words.append([w for w in re.split(r'[\s<>,.;]+', text3) if w])

print(len(words[3]))

vals = {}

vals["computer"] = [0, 0, 0, 0]
vals["doctoral"] = [0, 0, 0, 0]
vals["algorithms"] = [0, 0, 0, 0]
vals["watson"] = [0, 0, 0, 0]

checkWords = {"computer", "doctoral", "algorithms", "watson"}

for i in range(len(words)):
    for checkWord in checkWords:
        for word in words[i]:
            if word == checkWord:
                vals[checkWord][i] += 1

print(vals)

print("Totals: ")
print("Len: ", len(words[0]) + len(words[1]) + len(words[2]) + len(words[3]))
print("computer: ", sum(vals["computer"]))
print("doctoral: ", sum(vals["doctoral"]))
print("algorithms: ", sum(vals["algorithms"]))
print("watson: ", sum(vals["watson"]))