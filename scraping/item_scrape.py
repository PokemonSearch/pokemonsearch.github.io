import requests;
import json;
import os


item_txt = []
grab_sprites = False
exception_list = ["heavy-duty-boots"]

def pokecall(url):
    return requests.get("https://pokeapi.co/api/v2/" + url)

item_list = json.loads(pokecall("item/?limit=2050").text)
for item in item_list["results"]:
    item_name = item['name']
    print("adding",item_name)
    item_txt.append(item_name)
    if grab_sprites or item_name in exception_list:
        try:
            item_data = json.loads(requests.get(item['url']).text)
            print("downloading sprite: " + item_data['sprites']['default'])
            sprite = requests.get(item_data['sprites']['default'],allow_redirects=True)
            parent = os.getcwd()
            print("saving to " + "data/items/sprites/"+str(item_data['name']))
            targ = "public/data/items/sprites/"+str(item_data['name'])
            path = os.path.join(parent, targ)
            if os.path.exists(path) == False:
                os.mkdir(path)
            f = open(os.path.join(path, str(item_data['name'])+".png"), "wb")
            f.write(sprite.content)
            f.close()
        except:
            print(item_data['sprites'])
            print("failed to grab sprite from " + item_data['sprites']['default'])

parent = os.getcwd()
targ = "public/data/items"
path = os.path.join(parent, targ)
f = open(os.path.join(path, "items.txt"), "w")
f.write(json.dumps(item_txt))
f.close()