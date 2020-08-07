import json
import shutil
import requests
import progressbar
import os

website_name = "pixiniary"

w = open(website_name+".json", "r+")
to_be_downloaded = json.load(w)

d = open("downloaded.json", "r+")
downloaded = json.load(d)
imageDir = './WordImages'
WordImages = os.listdir(imageDir)


widgets = [' [',
           progressbar.Timer(format='elapsed time: %(elapsed)s'),
           '] ',
           progressbar.Bar('*'), ' (',
           progressbar.ETA(), ') ',
           ]

bar = progressbar.ProgressBar(max_value=len(WordImages),
                              widgets=widgets).start()

count = -1

for word in list(to_be_downloaded.keys()):
    img_no = 0
    # print("\n"+word)
    if (word in downloaded.keys()):
        count += 1
        continue
    for url in to_be_downloaded[word]:
        response = requests.get(url, stream=True)
        path = imageDir+"/"+word+"/"+website_name+str(img_no)+".jpg"
        with open(path, 'wb') as out_file:
            shutil.copyfileobj(response.raw, out_file)
        del response
        img_no += 1
        downloaded[word] = to_be_downloaded[word]
        d.seek(0)
        json.dump(downloaded, d, indent=4)
        d.truncate()
    count += 1
    bar.update(count)
