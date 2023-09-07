import csv

translateen_file = open('CommonWords.csv', "r")

graduateOnline_file = open('vocbularyGMAT.csv', "r")

translateen = csv.reader(translateen_file)
graduateOnline = csv.reader(graduateOnline_file)

list1 = list(translateen)
list2 = list(graduateOnline)

# f = open("CommonWords.csv","w")

for i in range(len(list1)):
    for j in range(len(list2)):
        if(list1[i][0] == list2[j][0]):
            # print(list1[i][0])
            # f.write(list1[i][0] + "," + list1[i][1] + "\n")
            exit
        else:
            print(list2[i][0])
