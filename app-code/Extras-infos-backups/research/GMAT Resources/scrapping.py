from urllib.request import urlopen as ureq
from bs4 import BeautifulSoup as soup

my_url = 'https://www.vocabulary.com/lists/197265'

uClient = ureq(my_url)
page_html = uClient.read()
uClient.close()

page_soup = soup(page_html, "html.parser")


wordList = page_soup.findAll("li", {"class": "entry learnable"})

fileName = "vocbularyGMAT.csv"
f = open(fileName,"w")

headers = ",\n"

f.write(headers)

for word in wordList:
    wordName = word.a.text

    meaning_container = word.findAll("div", {"class":"definition"})
    wordMeaning = meaning_container[0].text

    print("word" + wordName)
    print("meaning"+ wordMeaning)

    f.write(wordName + "," + wordMeaning + "\n")

f.close()