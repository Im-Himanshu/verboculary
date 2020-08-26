import requests
import json
import progressbar

widgets = [' [',
           progressbar.Timer(format='elapsed time: %(elapsed)s'),
           '] ',
           progressbar.Bar('*'), ' (',
           progressbar.ETA(), ') ',
           ]

synonyms = []
antonyms = []
words = []

with open('csvToJsonData.json', 'r+') as f:
    data = json.load(f)
    for i in range(1211):
        words.append(data[str(i)][1])
print(len(words))

bar = progressbar.ProgressBar(max_value=len(words),
                              widgets=widgets).start()
counter = 1113

with open('synonyms.json', 'r+') as f:
    syn = json.load(f)
    with open('antonyms.json', 'r+') as d:
        ant = json.load(d)
        for word in words:
            synonyms = []
            antonyms = []
            if word in syn.keys():
                print('\n'+word+"found in json")
                pass
            else:
                response = requests.get(
                    "https://api.datamuse.com/words?rel_syn="+word+"&max=4")
                results_syn = response.json()
                response = requests.get(
                    "https://api.datamuse.com/words?rel_ant="+word+"&max=4")
                results_ant = response.json()
                for result in results_syn:
                    synonyms.append(result["word"])
                if (len(synonyms) == 0):
                    print("\nNo synonyms found for "+word)
                else:
                    print("\n"+word+" : "+str(synonyms))
                for result in results_ant:
                    antonyms.append(result["word"])
                if (len(antonyms) == 0):
                    print("No antonyms found for "+word+'\n')
                else:
                    print(word+" : "+str(antonyms)+'\n')
                syn[word] = synonyms
                ant[word] = antonyms
                counter += 1
                bar.update(counter)
                f.seek(0)
                d.seek(0)
                json.dump(syn, f, indent=4)
                json.dump(ant, d, indent=4)
                print("dumped")
                f.truncate()
                d.truncate()
