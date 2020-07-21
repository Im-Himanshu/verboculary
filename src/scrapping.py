import urllib2
from bs4 import BeautifulSoup

url = "http://icecat.biz/p/toshiba/pscbxe-01t00een/satellite-pro-notebooks-4051528049077-Satellite+Pro+C8501GR-17732197.html"
html = urllib2.urlopen(url)
soup = BeautifulSoup(html)

imgs = soup.findAll("div", {"class":"thumb-pic"})
#https://stackoverflow.com/questions/18497840/beautifulsoup-how-to-open-images-and-download-them
#https://www.dataquest.io/blog/web-scraping-beautifulsoup/