import urllib
import requests

encoded_query = urllib.parse.quote('how')
params = {'corpus': 'eng-us', 'query': encoded_query, 'topk': 2}
params = '&'.join('{}={}'.format(name, value) for name, value in params.items())

response = requests.get('https://api.phrasefinder.io/search?' + params)

assert response.status_code == 200



# print(response.json()["phrases"][0]["mc"])
print(response.json()["phrases"][0]["sc"])