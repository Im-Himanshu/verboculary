from selenium import webdriver
from bs4 import BeautifulSoup as soup
import time
import progressbar
import json


url = "https://giphy.com/search/"
word = "chicken"
w = open("wordToIDMapping.json", "r+")
g = open("giphy.json", "r+")


data = json.load(g)
words = json.load(w)
# words = ["chicken"]

driver = webdriver.Chrome()
count = 1
widgets = [' [',
           progressbar.Timer(format='elapsed time: %(elapsed)s'),
           '] ',
           progressbar.Bar('*'), ' (',
           progressbar.ETA(), ') ',
           ]

bar = progressbar.ProgressBar(max_value=len(words.keys()),
                              widgets=widgets).start()
try:
    for word in words.keys():
        if word in data.keys():
            count += 1
            continue
        driver.get(url+word)
        time.sleep(10)
        s = soup(driver.page_source, features='lxml')
        # print("\n"+url+str(page_no)+"\n")
        # print(s.prettify()
        all_imgs = s.find_all("img", class_="giphy-gif-img")
        # print(s.prettify())
        urls = []
        for div in all_imgs[:3]:
            urls.append(div["src"])
        data[word] = urls
        g.seek(0)
        json.dump(data, g, indent=4)
        g.truncate()
        print(word)
        count += 1
        bar.update(count)
except:
    driver.quit()

g.close()
w.close()
