#   Make sure you have WordImages, wordToIDMapping.json, csvToJsonData.json in the same folder before running this code


import json
import os

imageDir = './WordImages'

WordImages = os.listdir(imageDir)

wPaths = {}
for word in WordImages:
    images = os.listdir(os.path.join(imageDir, word))
    for i in range(len(images)):
        images[i] = "/assets/img/WordImages/"+word+"/"+images[i]
    wPaths[word] = images

f = open('csvToJsonData.json', 'r+')
w = open('wordToIDMapping.json', 'r+')

data = json.load(f)
wordtoid = json.load(w)


for word in WordImages:
    if (data[str(wordtoid[word])][7]):
        print("boop")
    #     data[str(wordtoid[word])][7] = wPaths[word]
    # elif (len(data[str(wordtoid[word])]) == 7):
    #     data[str(wordtoid[word])].append(wPaths[word])

    # print(data[str(wordtoid[word])])
    # print(wPaths[word])
# f.seek(0)        # <--- should reset file position to the beginning.
# json.dump(data, f, indent=4)
# f.truncate()
f.close()
w.close()
