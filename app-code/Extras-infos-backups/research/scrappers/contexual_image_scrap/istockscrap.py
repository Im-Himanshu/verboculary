from bs4 import BeautifulSoup
import requests
import json
import os
import progressbar


f = open("istock.json", "r+")
istock = json.load(f)
imageDir = './WordImages'
WordImages = os.listdir(imageDir)

url_start = "https://www.istockphoto.com/photos/adjuration?phrase="
url_end = "&sort=mostpopular"


widgets = [' [',
           progressbar.Timer(format='elapsed time: %(elapsed)s'),
           '] ',
           progressbar.Bar('*'), ' (',
           progressbar.ETA(), ') ',
           ]

bar = progressbar.ProgressBar(max_value=len(WordImages),
                              widgets=widgets).start()

count = 0
for word in WordImages:
    if word in istock.keys():
        count += 1
        continue
    r = requests.get(url_start+word+url_end)
    s = BeautifulSoup(r.content, features="lxml")
    all_imgs = s.findAll(
        "img", {"class": "gallery-asset__thumb gallery-mosaic-asset__thumb"})
    urls = []
    for img in all_imgs[:5]:
        urls.append(img["src"])
    istock[word] = urls
    count += 1
    f.seek(0)
    json.dump(istock, f, indent=4)
    f.truncate()
    bar.update(count)
