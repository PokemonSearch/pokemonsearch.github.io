import threading;
import requests
import os;
import json
import time

pk_min = 1 #default is 1 (not 0)
pk_count = 1025
print(os.getcwd())
def construct_sprites(pkmn, id):
    parent = os.getcwd()
    targ = "public/data/sprites/"+str(id)
    path = os.path.join(parent, targ)
    if os.path.exists(path) == False:
        os.mkdir(path)
    spritelist = list(pkmn["sprites"])
 
    for cat in list(pkmn["sprites"]) + list():
        url = pkmn["sprites"][cat]
        if url != None:
            try:
                url = url.replace("https://raw.githubusercontent.com/PokeAPI/sprites/master/https://raw.githubusercontent.com/PokeAPI/sprites/master/","https://raw.githubusercontent.com/PokeAPI/sprites/master/")
            except:
                print("replace failed for " + str(id))
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
    
    for gen in pkmn["sprites"]["versions"]:
        for game in gen:
            for cat in game:
                print("found category",cat,"in",game,"(",gen,") for",id)
                url = pkmn["sprites"][gen][game][cat]
                if url != None:
                    try:
                        url = url.replace("https://raw.githubusercontent.com/PokeAPI/sprites/master/https://raw.githubusercontent.com/PokeAPI/sprites/master/","https://raw.githubusercontent.com/PokeAPI/sprites/master/")
                    except:
                        print("replace failed for " + str(id))
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
    for i in range(pk_min, pk_count+1):
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