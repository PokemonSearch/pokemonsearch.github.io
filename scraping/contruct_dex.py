import threading;
import requests
import os;
import json


print(os.getcwd())
def construct_sprites(pkmn, id):
    parent = os.getcwd()
    targ = "data/sprites/"+str(id)
    path = os.path.join(parent, targ)
    if os.path.exists(path) == False:
        os.mkdir(path)
    for cat in list(pkmn["sprites"]):
        url = pkmn["sprites"][cat]
        if url != None:
            final_path = path
            if pkmn['is_default'] == False:
                formName = pkmn['name'].replace(pkmn['species']['name']+"-","")
                final_path = os.path.join(path, formName)
                if os.path.exists(final_path) == False:
                    os.mkdir(final_path)
            sprite = requests.get(url, allow_redirects=True)
            f = open(os.path.join(final_path, str(cat)+".png"), "wb")
            f.write(sprite.content)
            f.close()


def construct(dex_str):
    dex: dict = json.loads(dex_str)
    for i in range(1, 1010+1):
        pList = dex["spe-"+str(i)]
        for p in pList:
            print("constructing " + p["name"])
            t = threading.Thread(target=construct_sprites,args=[p, i])
            t.start()

def construct_from_memory():
    f = open("dex.json","r")
    val = json.loads(f.read())
    f.close()
    construct(val)