from urllib.request import urlopen as ureq
from bs4 import BeautifulSoup as soup

my_url = "https://www.graduateshotline.com/gre-word-list.html"

uClient = ureq(my_url)
page_html = uClient.read()
uClient.close()

page_soup = soup(page_html, "html.parser")

wordList = page_soup.findAll("table",{"class":"tablex border1"})

wordData = wordList[0]

table_rows = wordData.findAll("tr")

fileName = "graduateOnline.csv"
f = open(fileName, "w")


for tr in table_rows:
    td = tr.find_all('td')
    # row = [i.text for i in td]
    # print(row)

    # for data in td:
    #     row = data.text
    #     f.write(row + "\n")

    word = td[0].text
    meaning = td[1].text
    print(word + "," + meaning + "\n")

    f.write(word + "," + meaning + "\n")

f.close()