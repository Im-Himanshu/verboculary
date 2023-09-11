from selenium import webdriver
import time
import json
import os

driver = webdriver.Chrome()
f = open("synonyms.json", "r+")
synonyms = json.load(f)
imageDir = './WordImages'
WordImages = os.listdir(imageDir)


url = "http://topgrewords.blogspot.com/search?q="

for word in WordImages:
    driver.get(url+word)
    time.sleep(2)
    for syn in synonyms[word]:
        driver.get(url+syn)
        time.sleep(2)
