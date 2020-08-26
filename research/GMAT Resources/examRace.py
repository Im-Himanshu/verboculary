from urllib.request import urlopen as ureq
from bs4 import BeautifulSoup as soup

my_url = "https://www.examrace.com/GMAT/GMAT-Free-Study-Material/English/Word-List/Word-List-A.html"

myClient = ureq(my_url)
page_html = myClient.read()
myClient.close()


