from selenium import webdriver
from bs4 import BeautifulSoup as soup
import time
import json


url = "https://art19.com/shows/merriam-websters-word-of-the-day?page="

driver = webdriver.Chrome()
page_count = 502

data = {}

with open("podcast.json", "r+") as f:
    data = json.load(f)
    for page_no in range(1, page_count+1):
        driver.get(url+str(page_no))
        time.sleep(5)
        s = soup(driver.page_source, features='lxml')
        print("\n"+url+str(page_no)+"\n")
        # print(s.prettify())
        all_links_in_class_ember_view = s.find_all("a", class_="ember-view")
        for div in all_links_in_class_ember_view:
            if len(div["class"]) != 1:
                continue
            word = div.string.split()[0]
            link = "https://rss.art19.com/episodes/" + \
                div["href"].split("/")[-1]+".mp3"
            if (word == "Developers" or word in data.keys()):
                continue
            data[word] = link
        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()
        # print(word + " : " + link)
