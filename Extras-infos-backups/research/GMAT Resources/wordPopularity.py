import urllib
import requests
import csv

commonwords_file = open('CommonWords.csv', "r")

commonwords = csv.reader(commonwords_file)

list1 = list(commonwords)

f = open("commonwordPopularity.csv", "w")

for i in range(len(list1)):
    encoded_query = urllib.parse.quote(list1[i][0])
    params = {'corpus': 'eng-us', 'query': encoded_query, 'topk': 2}
    params = '&'.join('{}={}'.format(name, value) for name, value in params.items())

    response = requests.get('https://api.phrasefinder.io/search?' + params)

    assert response.status_code == 200

    print(list1[i][0] + " : " + str(response.json()["phrases"][0]["sc"]))

    f.write(list1[i][0] + "," + str(response.json()["phrases"][0]["sc"]) + "\n")