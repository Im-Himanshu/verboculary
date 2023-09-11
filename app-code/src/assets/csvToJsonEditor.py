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

with open('csvToJsonData.json', 'r+') as f:
    data = json.load(f)
    with open('wordToIDMapping.json', 'r+') as w:
        wordtoid = json.load(w)
        for word in WordImages:
            data[str(wordtoid[word])].append(wPaths[word])
            # print(data[str(wordtoid[word])])
            # print(wPaths[word])
        f.seek(0)        # <--- should reset file position to the beginning.
        json.dump(data, f, indent=4)
        f.truncate()
