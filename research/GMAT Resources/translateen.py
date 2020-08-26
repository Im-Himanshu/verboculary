from urllib.request import urlopen as ureq
from bs4 import BeautifulSoup as soup

fileName = "translateen.csv"
f = open(fileName,"a")
x = 815

for i in range(x):
    if i > 750:
        my_url = "https://www.translateen.com/gmat-wordlist/gmat-vocabulary-list-"+ str(i) +"/"

        uClient = ureq(my_url)
        page_html = uClient.read()
        uClient.close()

        page_soup = soup(page_html, "html.parser")

        table = page_soup.findAll("table")[0]
        rows = table.findAll('tr')
        
        for tr in rows:
            th = tr.findAll("th")
            td = tr.findAll("td")
            
            word = th[0].text
            meaning = td[0].text
            f.write(word + "," + meaning.replace(",","") + "\n")
    
f.close()