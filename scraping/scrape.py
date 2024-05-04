import requests;
import threading;
import json;
import contruct_dex;
import time;
import os
calls: list[requests.Response] = []
dex = {}
done = 0




def pokecall(url):
    return requests.get("https://pokeapi.co/api/v2/" + url)

def call(url):
    return requests.get(url)

def addcall(parentID, url, isDef):
    global done
    u = call(url)
    s = pokecall("pokemon-species/"+str(parentID))
    x: dict = json.loads(u.text)
    name = x['species']['name']
    id = x['id']
    x['is_default'] = isDef
    #if isDef == False:
        #print("printing def: " + str(list(x.keys())))
        #print(name + " >> def: " + str(x['is_default']))
    print(str(id) + ": " + x['name'])
    dex[id] = x
    formName = x['name'].replace(name+"-","")
    write_dex(parentID, u.text, s.text, isDef, formName)
    return json.loads(u.text)

def generalcall(id):
    global done
    try:
        u = pokecall("pokemon-species/"+str(id))
        x = json.loads(u.text)
        fullList = []
        for v in x['varieties']:
            fullList.append(addcall(id, v['pokemon']['url'], v['is_default']))
        dex["spe-"+str(id)] = fullList
        done += 1
    except:
        print("failed!")
        done += 1
    
    
    
def write_dex(id, json_text, species_text, isDef, formName = ""):
    parent = os.getcwd()
    targ = "public/data/api/"+str(id)
    path = os.path.join(parent, targ)
    if os.path.exists(path) == False:
        os.mkdir(path)
    if isDef == False:
        path = os.path.join(path, formName)
        if os.path.exists(path) == False:
            os.mkdir(path)
    f = open(os.path.join(path, "api.json"), "w")
    f.write(json_text)
    f.close()
    if isDef:
        f = open(os.path.join(path, "species.json"), "w")
        f.write(remove_non_ascii_1(species_text))
        f.close()

def remove_non_ascii_1(text):
    return ''.join(i for i in text if ord(i)<128)


USE_MEMORY = False

if __name__ == "__main__":
    done = 0
    dex = {}
    if USE_MEMORY:
        for i in range(contruct_dex.pk_min, contruct_dex.pk_count + 1):
            dex[i] = open("public/data/api/"+str(i)+"")
            #UNFINISHED
    else:
        calls: list[requests.Response] = []

        for i in range(contruct_dex.pk_min, contruct_dex.pk_count + 1):
            t = threading.Thread(target=generalcall,args=[i])
            t.start()
        
        while(done < contruct_dex.pk_count - contruct_dex.pk_min + 1):
            print("finished:",done,end="\n")
            time.sleep(1)
    
    jsonData = json.dumps(dex, indent=4)
    contruct_dex.construct(jsonData)
    