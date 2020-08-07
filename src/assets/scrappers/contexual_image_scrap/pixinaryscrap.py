import requests
from bs4 import BeautifulSoup
import json
import progressbar
import os

f = open("synonyms.json", "r+")
synonyms = json.load(f)
p = open("pixiniary.json", "r+")
pixiniary = json.load(p)

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
count = 0


for word in WordImages:
    urls = []
    url = "http://www.pixnary.com/greImages/"
    # This variable contains the link to the image
    link_to_img = url+word+'.jpg'
    html = requests.get(link_to_img)
    s = BeautifulSoup(html.content, features="lxml")
    required_data = s.findAll("p", {"class": ""})
    if (not required_data):
        for syn in synonyms[word]:
            # This variable contains the link to the synonym image
            link_to_syn_img = url+syn+".jpg"
            html = requests.get(link_to_syn_img)
            s = BeautifulSoup(html.content, features="lxml")
            syn_data = s.findAll(
                "p", {"class": ""})
            if(syn_data):
                urls.append(link_to_syn_img)
                # print(syn_data)
    else:
        urls.append(link_to_img)
    pixiniary[word] = urls
    p.seek(0)
    json.dump(pixiniary, p, indent=4)
    p.truncate()
    count += 1
    bar.update(count)

# correct_html = required_data[0].findAll("a", {})[0]["href"]
# print(word+" : "+correct_html)
