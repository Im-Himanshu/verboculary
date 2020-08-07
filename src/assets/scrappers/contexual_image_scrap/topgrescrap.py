import requests
from bs4 import BeautifulSoup
import json
import progressbar
import os

f = open("synonyms.json", "r+")
synonyms = json.load(f)
imageDir = './WordImages'
WordImages = os.listdir(imageDir)

t = open("topgre.json", "r+")
topgre = json.load(t)


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
    print("\n"+word)
    urls = []
    try:
        url = "http://topgrewords.blogspot.com/2015/01/"
        html = requests.get(url+word+".html")
        s = BeautifulSoup(html.content, features="lxml")
        # This variable contains the link to the image
        link_to_img = s.findAll(
            "div", {"style": "clear: both; text-align: center;"})[1].findAll('a', {})[0]["href"]
        if(link_to_img):
            urls.append(link_to_img)
    except:
        for syn in synonyms[word]:
            try:
                print(syn)
                html = requests.get(url+syn+".html")
                s = BeautifulSoup(html.content, features="lxml")
                # This variable contains the link to the synonym image
                link_to_syn_img = s.findAll(
                    "div", {"style": "clear: both; text-align: center;"})[1].findAll('a', {})[0]["href"]
                if(link_to_syn_img):
                    urls.append(link_to_syn_img)
            except:
                pass
    topgre[word] = urls
    t.seek(0)
    json.dump(topgre, t, indent=4)
    t.truncate()
    count += 1
    bar.update(count)
