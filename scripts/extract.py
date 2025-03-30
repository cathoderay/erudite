import nltk

f = open("sgb-words.txt")
words = map(lambda word: word[:-1], f.readlines())

nltk.download("wordnet")

from nltk.corpus import wordnet

count = 0
f = open("dictionary5.json", "w+")

f.write("{\n")
for word in words:
    syns = wordnet.synsets(word)
    if syns:
        f.write(f"""  \"{word}\" : \"{syns[0].definition()}\",\n""")
        print(f"""  \"{word}\" : \"{syns[0].definition()}\"""")
        count += 1
    else:
        pass
f.write("}\n")
f.close()

print("File generated with %d words." % count)